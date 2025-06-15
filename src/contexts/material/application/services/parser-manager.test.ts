import { ParserManager } from '@/contexts/material/application/services/parser-manager';
import { UserUpload } from '@/contexts/material/entities/user-upload';
import { MockParser } from '@/contexts/material/infra/mocks/mock-parser';
import { beforeEach, describe, expect, it, vi } from 'vitest';

describe('parser manager service', () => {
    let service: ParserManager;
    const testUpload: UserUpload = {
        name: 'test-file.pdf',
        mimeType: 'application/pdf',
        data: Buffer.from('some content'),
    };

    beforeEach(() => {
        service = new ParserManager();
    });

    it('should call first matching parser', async () => {
        const nonMatchingParser = new MockParser(['image/png', 'image/jpeg']);
        const matchingParser = new MockParser(['application/pdf']);
        service.register(nonMatchingParser);
        service.register(matchingParser);

        const result = await service.parse(testUpload);

        expect(result.metadata?.parserMimeTypes).toBeDefined();
        expect(result.metadata!.parserMimeTypes).toEqual(matchingParser.getValidMimeTypes());
    });

    it('should throw if no parser matches file type', async () => {
        const nonMatchingParser = new MockParser(['jpg', 'png']);
        service.register(nonMatchingParser);

        await expect(service.parse(testUpload)).rejects.toThrow('Unsupported file type');
    });

    it('should allow registering multiple parsers', () => {
        const parserA = new MockParser(['a']);
        const parserB = new MockParser(['b']);
        service.register(parserA);
        service.register(parserB);

        expect(service.parsers.length).toBe(2);
        expect(service.parsers).toContain(parserA);
        expect(service.parsers).toContain(parserB);
    });

    it('should prioritize the first matching parser if multiple canParse', async () => {
        const firstParser = new MockParser(['application/pdf']);
        const secondParser = new MockParser(['application/pdf']);
        vi.spyOn(firstParser, 'canParse').mockReturnValue(true);
        vi.spyOn(secondParser, 'canParse').mockReturnValue(true);
        const parseSpy1 = vi.spyOn(firstParser, 'parse');
        const parseSpy2 = vi.spyOn(secondParser, 'parse');

        service.register(firstParser);
        service.register(secondParser);

        await service.parse(testUpload);

        expect(parseSpy1).toHaveBeenCalled();
        expect(parseSpy2).not.toHaveBeenCalled(); // Only the first is used
    });

    it('should propagate errors from parser.parse', async () => {
        const errorParser = new MockParser(['application/pdf']);
        vi.spyOn(errorParser, 'canParse').mockReturnValue(true);
        vi.spyOn(errorParser, 'parse').mockRejectedValue(new Error('Parse fail!'));

        service.register(errorParser);

        await expect(service.parse(testUpload)).rejects.toThrow('Parse fail!');
    });

    it('should call canParse on every registered parser in order until one returns true', async () => {
        const parserA = new MockParser(['bad/type']);
        const parserB = new MockParser(['application/pdf']);
        const canParseSpyA = vi.spyOn(parserA, 'canParse');
        const canParseSpyB = vi.spyOn(parserB, 'canParse');

        service.register(parserA);
        service.register(parserB);

        await service.parse(testUpload);

        expect(canParseSpyA).toHaveBeenCalledWith(testUpload);
        expect(canParseSpyB).toHaveBeenCalledWith(testUpload);
        expect(canParseSpyA).toHaveBeenCalledBefore(canParseSpyB);
    });

    it('should throw if no parsers are registered', async () => {
        await expect(service.parse(testUpload)).rejects.toThrow('Unsupported file type');
    });
});
