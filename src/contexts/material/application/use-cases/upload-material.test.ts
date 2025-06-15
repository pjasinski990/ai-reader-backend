import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ParserManager } from '@/shared/application/services/parser-manager';
import { MockParser } from '@/shared/infra/mocks/mock-parser';
import { UserUpload } from '@/shared/entities/user-upload';
import { UploadMaterialUseCase } from './upload-material';
import { MaterialRepo } from '../ports/out/material-repo';
import { InMemoryMaterialRepo } from '@/shared/infra/mocks/in-memory-material-repo';
import { EmbeddingProvider } from '@/shared/ports/out/embedding-provider';
import { TextChunker } from '../ports/out/text-chunker';
import { Summarizer } from '@/shared/ports/out/summarizer';
import { VectorRepo } from '@/shared/ports/out/vector-repo';
import { RecursiveTextChunker } from '@/shared/infra/chunking/recursive-text-chunker';
import { MockEmbeddingProvider } from '@/shared/infra/mocks/mock-embedding-provider';
import { MockSummarizer } from '@/shared/infra/mocks/mock-summarizer';
import { InMemoryVectorRepo } from '@/shared/infra/mocks/in-memory-vector-repo';

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
        name: 'test-file.pdf',
        mimeType: 'application/pdf',
        data: Buffer.from('some content'),
    };

    beforeEach(() => {
        useCase = new UploadMaterialUseCase();
        manager = new ParserManager();
        materialRepo = new InMemoryMaterialRepo();
        textChunker = new RecursiveTextChunker();
        embeddingProvider = new MockEmbeddingProvider();
        summarizer = new MockSummarizer();
        chunksVectorRepo = new InMemoryVectorRepo();
        parser = new MockParser(['application/pdf']);
        manager.register(parser);
    });

    afterEach(() => {
        materialRepo.clear();
    });

    it('should upload parsed material content to repo', async () => {
        const uploaded = await useCase.execute(
            manager,
            materialRepo,
            textChunker,
            embeddingProvider,
            summarizer,
            chunksVectorRepo,
            testUpload,
        );

        const stored = await materialRepo.getAll();
        expect(stored.length).toEqual(1);
        expect(stored[0]).toEqual(uploaded);
    });

    it('should throw when no parser can handle the file', async () => {
        const upload: UserUpload = {
            name: 'not-supported.txt',
            mimeType: 'text/plain',
            data: Buffer.from('irrelevant'),
        };
        await expect(useCase.execute(
            manager,
            materialRepo,
            textChunker,
            embeddingProvider,
            summarizer,
            chunksVectorRepo,
            upload,
        )).rejects.toThrow('Unsupported file type');
        const stored = await materialRepo.getAll();
        expect(stored.length).toBe(0);
    });

    it('should allow multiple materials to be uploaded', async () => {
        const secondUpload: UserUpload = {
            name: 'another.pdf',
            mimeType: 'application/pdf',
            data: Buffer.from('more'),
        };
        await useCase.execute(
            manager,
            materialRepo,
            textChunker,
            embeddingProvider,
            summarizer,
            chunksVectorRepo,
            testUpload
        );
        await useCase.execute(
            manager,
            materialRepo,
            textChunker,
            embeddingProvider,
            summarizer,
            chunksVectorRepo,
            secondUpload
        );

        const stored = await materialRepo.getAll();
        expect(stored.length).toBe(2);
        expect(stored[0].title).toBe(testUpload.name);
        expect(stored[1].title).toBe(secondUpload.name);
    });

    it('should expose all valid mime types from all registered parsers', () => {
        const anotherParser = new MockParser(['image/png', 'text/plain']);
        manager.register(anotherParser);

        const available = useCase.getAvailableMimeTypes(manager);
        expect(available).toEqual(expect.arrayContaining(['application/pdf', 'image/png', 'text/plain']));
    });

    it('should call parse on the first matching parser', async () => {
        const canParseSpy = vi.spyOn(parser, 'canParse');
        await useCase.execute(
            manager,
            materialRepo,
            textChunker,
            embeddingProvider,
            summarizer,
            chunksVectorRepo,
            testUpload
        );
        expect(canParseSpy).toHaveBeenCalledWith(testUpload);
    });

    it('should throw if parse throws', async () => {
        const throwingParser = new MockParser(['application/pdf']);
        vi.spyOn(throwingParser, 'parse').mockRejectedValue(new Error('parse error'));
        const throwingManager = new ParserManager();
        throwingManager.register(throwingParser);

        await expect(
            useCase.execute(
                throwingManager,
                materialRepo,
                textChunker,
                embeddingProvider,
                summarizer,
                chunksVectorRepo,
                testUpload
            )
        ).rejects.toThrow('parse error');
    });

    it('should return unique file extensions for all available mime types', () => {
        const anotherParser = new MockParser(['image/png', 'application/pdf', 'image/jpeg']);
        manager.register(anotherParser);

        const exts = useCase.getAvailableFileExtensions(manager);

        expect(exts).toEqual(expect.arrayContaining(['pdf', 'png']));
        expect(new Set(exts).size).toBe(exts.length);
    });

    it('should not return false or empty entries', () => {
        const unknownType = 'application/x-fake-type';
        const badParser = new MockParser([unknownType]);
        manager.register(badParser);

        const exts = useCase.getAvailableFileExtensions(manager);

        expect(exts).not.toContain(false);
        expect(exts).not.toContain('');
    });

    it('should return an empty array if there are no registered parsers', () => {
        const emptyManager = new ParserManager();

        const exts = useCase.getAvailableFileExtensions(emptyManager);

        expect(exts).toEqual([]);
    });

    it('should chunk material and store all chunks in the vector repo', async () => {
        await useCase.execute(
            manager,
            materialRepo,
            textChunker,
            embeddingProvider,
            summarizer,
            chunksVectorRepo,
            testUpload
        );
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
        await useCase.execute(
            manager,
            materialRepo,
            textChunker,
            embeddingProvider,
            summarizer,
            chunksVectorRepo,
            testUpload
        );
        const chunks = await chunksVectorRepo.getAll();
        // each chunk gets a deterministic vector per its index (per mock)
        const allEmbeddings = chunks.map(c => c.embedding.join(','));
        const uniqueEmbeddings = new Set(allEmbeddings);
        expect(uniqueEmbeddings.size).toBe(chunks.length);
    });

    it('should summarize each chunk correctly', async () => {
        await useCase.execute(
            manager,
            materialRepo,
            textChunker,
            embeddingProvider,
            summarizer,
            chunksVectorRepo,
            testUpload
        );
        const chunks = await chunksVectorRepo.getAll();
        // MockSummarizer uses the chunk text as summary
        for (const chunk of chunks) {
            expect(chunk.summary).toBe(chunk.text);
        }
    });

    it('should store parent/child chunk hierarchy and metadata correctly', async () => {
        await useCase.execute(
            manager,
            materialRepo,
            textChunker,
            embeddingProvider,
            summarizer,
            chunksVectorRepo,
            testUpload
        );
        const chunks = await chunksVectorRepo.getAll();
        for (const chunk of chunks) {
            expect(chunk).toHaveProperty('metadata');
            expect(chunk.metadata).toHaveProperty('level');
            expect(chunk.metadata).toHaveProperty('startOffset');
            expect(chunk.metadata).toHaveProperty('endOffset');
        }
    });

});
