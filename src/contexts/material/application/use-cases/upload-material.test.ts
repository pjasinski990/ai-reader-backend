import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { UploadMaterialUseCase } from '@/contexts/material/application/use-cases/upload-material';
import { ParserManager } from '@/contexts/material/application/services/parser-manager';
import { MaterialRepo } from '@/contexts/material/application/ports/out/material-repo';
import { TextChunker } from '@/contexts/material/application/ports/out/text-chunker';
import { EmbeddingProvider } from '@/contexts/material/application/ports/out/embedding-provider';
import { Summarizer } from '@/contexts/material/application/ports/out/summarizer';
import { VectorRepo } from '@/contexts/material/application/ports/out/vector-repo';
import { MockParser } from '@/contexts/material/infra/testing/mock-parser';
import { UserUpload } from '@/contexts/material/entities/user-upload';
import { InMemoryMaterialRepo } from '@/contexts/material/infra/testing/in-memory-material-repo';
import { RecursiveTextChunker } from '@/contexts/material/infra/chunking/recursive-text-chunker';
import { MockEmbeddingProvider } from '@/contexts/material/infra/testing/mock-embedding-provider';
import { MockSummarizer } from '@/contexts/material/infra/testing/mock-summarizer';
import { InMemoryVectorRepo } from '@/contexts/material/infra/testing/in-memory-vector-repo';

describe('upload material use case', () => {
    let useCase: UploadMaterialUseCase;
    let manager: ParserManager;
    let materialRepo: MaterialRepo;
    let textChunker: TextChunker;
    let embeddingProvider: EmbeddingProvider;
    let summarizer: Summarizer;
    let chunksVectorRepo: VectorRepo;
    let parser: MockParser;

    const testUpload: UserUpload = {
        title: 'test-file.pdf',
        projectId: 'some-project',
        mimeType: 'application/pdf',
        buffer: Buffer.from('some content'),
    };

    beforeEach(() => {
        manager = new ParserManager();
        parser = new MockParser(['application/pdf']);
        manager.register(parser);
        materialRepo = new InMemoryMaterialRepo();
        textChunker = new RecursiveTextChunker();
        embeddingProvider = new MockEmbeddingProvider();
        summarizer = new MockSummarizer();
        chunksVectorRepo = new InMemoryVectorRepo();
        useCase = new UploadMaterialUseCase(
            manager,
            materialRepo,
            textChunker,
            embeddingProvider,
            summarizer,
            chunksVectorRepo,
        );
    });

    afterEach(() => {
        materialRepo.clear();
    });

    it('should upload parsed material content to repo', async () => {
        const uploaded = await useCase.execute(testUpload);

        const stored = await materialRepo.getAll();
        expect(stored.length).toEqual(1);
        expect(stored[0]).toEqual(uploaded);
    });

    it('should throw when no parser can handle the file', async () => {
        const upload: UserUpload = {
            title: 'not-supported.txt',
            projectId: 'irrelevant',
            mimeType: 'text/plain',
            buffer: Buffer.from('irrelevant'),
        };

        await expect(
            useCase.execute(upload)
        ).rejects.toThrow('Unsupported file type');

        const stored = await materialRepo.getAll();
        expect(stored.length).toBe(0);
    });

    it('should allow multiple materials to be uploaded', async () => {
        const secondUpload: UserUpload = {
            title: 'another.pdf',
            projectId: 'some-project',
            mimeType: 'application/pdf',
            buffer: Buffer.from('more'),
        };
        await useCase.execute(testUpload);
        await useCase.execute(secondUpload);

        const stored = await materialRepo.getAll();
        expect(stored.length).toBe(2);
        expect(stored[0].title).toBe(testUpload.title);
        expect(stored[1].title).toBe(secondUpload.title);
    });

    it('should call parse on the first matching parser', async () => {
        const canParseSpy = vi.spyOn(parser, 'canParse');
        await useCase.execute(testUpload);
        expect(canParseSpy).toHaveBeenCalledWith(testUpload);
    });

    it('should throw if parse throws', async () => {
        vi.spyOn(parser, 'parse').mockRejectedValue(new Error('parse error'));

        await expect(
            useCase.execute(testUpload)
        ).rejects.toThrow('parse error');
    });

    it('should chunk material and store all chunks in the vector repo', async () => {
        await useCase.execute(testUpload);
        const chunks = await chunksVectorRepo.getAll();

        expect(chunks.length).toBeGreaterThan(0);

        for (const chunk of chunks) {
            expect(chunk).toHaveProperty('embedding');
            expect(chunk).toHaveProperty('summary');
            expect(Array.isArray(chunk.embedding)).toBe(true);
            expect(chunk.embedding.length).toBe(32); // per mock
            expect(typeof chunk.summary).toBe('string');
        }
    });

    it('should assign unique embeddings to each chunk', async () => {
        await useCase.execute(testUpload);

        const chunks = await chunksVectorRepo.getAll();
        // each chunk gets a deterministic vector per its index (per mock)
        const allEmbeddings = chunks.map(c => c.embedding.join(','));
        const uniqueEmbeddings = new Set(allEmbeddings);
        expect(uniqueEmbeddings.size).toBe(chunks.length);
    });

    it('should summarize each chunk correctly', async () => {
        await useCase.execute(testUpload);

        const chunks = await chunksVectorRepo.getAll();
        // MockSummarizer uses the chunk text as summary
        for (const chunk of chunks) {
            expect(chunk.summary).toBe(chunk.text);
        }
    });

    it('should store parent/child chunk hierarchy and metadata correctly', async () => {
        await useCase.execute(testUpload);

        const chunks = await chunksVectorRepo.getAll();
        for (const chunk of chunks) {
            expect(chunk).toHaveProperty('metadata');
            expect(chunk.metadata).toHaveProperty('level');
            expect(chunk.metadata).toHaveProperty('startOffset');
            expect(chunk.metadata).toHaveProperty('endOffset');
        }
    });
});
