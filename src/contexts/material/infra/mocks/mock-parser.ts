import { UploadsParser } from '@/shared/application/ports/out/uploads-parser';
import { ParsedContent } from '@/shared/entities/parsed-content';
import { UserUpload } from '@/shared/entities/user-upload';

export class MockParser implements UploadsParser {
    constructor(private mimeTypes: string[]) { }

    getValidMimeTypes(): string[] {
        return this.mimeTypes;
    }

    canParse(file: UserUpload): boolean {
        return this.mimeTypes.includes(file.mimeType);
    }

    parse(file: UserUpload): Promise<ParsedContent> {
        return Promise.resolve({
            type: 'text',
            text: `parsed content of ${file.name}`,
            metadata: {
                parserMimeTypes: this.mimeTypes,
            }
        });
    }
}
