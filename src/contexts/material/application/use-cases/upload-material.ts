import { v4 as uuidv4 } from 'uuid';
import mime from 'mime-types';
import { UploadMaterial } from '@/contexts/material/application/ports/in/upload-material';
import { ParserManager } from '@/contexts/material/application/services/parser-manager';
import { MaterialRepo } from '@/contexts/material/application/ports/out/material-repo';
import { TextChunker } from '@/contexts/material/application/ports/out/text-chunker';
import { EmbeddingProvider } from '@/contexts/material/application/ports/out/embedding-provider';
import { Summarizer } from '@/contexts/material/application/ports/out/summarizer';
import { VectorRepo } from '@/contexts/material/application/ports/out/vector-repo';
import { UserUpload } from '@/contexts/material/entities/user-upload';
import { Material } from '@/contexts/material/entities/material';
import { LeafChunk, ParentChunk, SummarizedChunk, TextChunk } from '@/contexts/material/entities/chunk';

export class UploadMaterialUseCase implements UploadMaterial {
    async execute(
        manager: ParserManager,
        materialRepo: MaterialRepo,
        textChunker: TextChunker,
        embeddingProvider: EmbeddingProvider,
        summarizer: Summarizer,
        chunksVectorRepo: VectorRepo,
        upload: UserUpload,
    ): Promise<Material> {
        const content = await manager.parse(upload);

        const material: Material = {
            id: uuidv4(),
            title: upload.name,
            content: content,
        };

        if (material.content.type === 'text') {
            const chunks = textChunker.chunk(material.content.text, 300);
            const leafChunks = await processLeafChunks(chunks, embeddingProvider, summarizer);
            const parentChunks = await processParentChunks(chunks, leafChunks, summarizer);
            await chunksVectorRepo.put(leafChunks);
            // TODO store leafs / parents in graph repo
            // during retrieval we'll want to replace children if many come from the same parent
            void parentChunks;
        }

        return await materialRepo.upsert(material);
    }

    getAvailableMimeTypes(manager: ParserManager): string[] {
        return manager.parsers.map(p => p.getValidMimeTypes()).flat();
    }

    getAvailableFileExtensions(manager: ParserManager): string[] {
        const mimeTypes = this.getAvailableMimeTypes(manager);
        return Array.from(
            new Set(
                mimeTypes
                    .map(type => mime.extension(type))
                    .filter((ext): ext is string => !!ext)
            )
        );
    }
}

async function processLeafChunks(chunks: TextChunk[], embeddingProvider: EmbeddingProvider, summarizer: Summarizer): Promise<LeafChunk[]> {
    const leafChunks = findLeafChunks(chunks);
    const embedded = await embeddingProvider.embed(leafChunks);
    return await summarizer.summarize(embedded);
}

function findLeafChunks(chunks: TextChunk[]) {
    const maxDepth = findMaxChunkDepth(chunks);
    return findChunksAtLevel(chunks, maxDepth);
}

function findMaxChunkDepth(chunks: TextChunk[]) {
    return Math.max(...chunks.map(c => c.metadata.level));
}

function findChunksAtLevel(chunks: TextChunk[], level: number) {
    return chunks.filter(c => c.metadata.level === level);
}

async function processParentChunks(chunks: TextChunk[], leafChunks: LeafChunk[], summarizer: Summarizer): Promise<ParentChunk[]> {
    let level = findMaxChunkDepth(chunks) - 1;
    let currentChildren: SummarizedChunk[] = leafChunks;
    let currentParents = findChunksAtLevel(chunks, level);
    const res: ParentChunk[] = [];
    while (level >= 0) {
        const summarizedLayer: SummarizedChunk[] = await summarizeParentsFromChildren(currentParents, currentChildren, summarizer);
        res.push(...summarizedLayer);

        level -= 1;
        currentChildren = summarizedLayer;
        currentParents = findChunksAtLevel(chunks, level);
    }
    return res;
}

async function summarizeParentsFromChildren(parentsToSummarize: TextChunk[], children: SummarizedChunk[], summarizer: Summarizer) {
    return Promise.all(
        parentsToSummarize.map(async parent => {
            const currentChildren = findChildren(parent, children);
            throwOnEmptyChildren(currentChildren, 'Each parent expected to have children at this point!');
            const joinedSummaries = joinChunkSummaries(currentChildren);
            const parentSummary = await generateSummaryFromText(joinedSummaries, summarizer);
            return { ...parent, summary: parentSummary };
        })
    );
}

function findChildren(parent: TextChunk, children: SummarizedChunk[]): SummarizedChunk[] {
    return children.filter(c => c.parentId === parent.id);
}

function joinChunkSummaries(chunks: SummarizedChunk[]) {
    return chunks.map(c => c.summary).join('\n\n');
}

async function generateSummaryFromText(text: string, summarizer: Summarizer) {
    return summarizer.summarizeOne({ text })
        .then(res => res.summary);
}

function throwOnEmptyChildren(children: TextChunk[], message: string, parentId?: string) {
    if (children.length === 0) {
        throw new Error(`${message} parentId: ${parentId ?? 'undefined'}`);
    }
}
