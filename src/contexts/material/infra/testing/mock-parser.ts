import { UploadsParser } from '@/contexts/material/application/ports/out/uploads-parser';
import { UserUpload } from '@/contexts/material/entities/user-upload';
import { ParsedContent } from '@/contexts/material/entities/parsed-content';

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
