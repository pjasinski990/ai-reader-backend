import { beforeEach, describe, expect, it } from 'vitest';
import { ParserManager } from '@/contexts/material/application/services/parser-manager';
import { MockParser } from '@/contexts/material/infra/testing/mock-parser';
import { ListValidUploadFiletypes } from '@/contexts/material/application/ports/in/list-valid-upload-filetypes';
import { ListValidUploadFiletypesUseCase } from '@/contexts/material/application/use-cases/list-valid-upload-filetypes';

describe('list valid upload filetypes use case', () => {
    let useCase: ListValidUploadFiletypes;
    let manager: ParserManager;
    let parser: MockParser;

    beforeEach(() => {
        manager = new ParserManager();
        parser = new MockParser(['application/pdf']);
        manager.register(parser);
        useCase = new ListValidUploadFiletypesUseCase();
    });

    it('should expose mime types from all registered parsers', () => {
        const anotherParser = new MockParser(['image/png', 'text/plain']);
        manager.register(anotherParser);

        const available = useCase.execute(manager);

        expect(available).toEqual(expect.arrayContaining(['application/pdf', 'image/png', 'text/plain']));
    });

    it('should return an empty array if there are no registered parsers', () => {
        manager.parsers = [];

        const exts = useCase.execute(manager);

        expect(exts).toEqual([]);
    });
});
