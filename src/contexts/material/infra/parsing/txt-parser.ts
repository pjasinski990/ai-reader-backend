import { UploadsParser } from '@/contexts/material/application/ports/out/uploads-parser';
import { UserUpload } from '@/contexts/material/entities/user-upload';
import { ParsedContent } from '@/contexts/material/entities/parsed-content';

export class TxtParser implements UploadsParser {
    private readonly validMimeTypes = ['text/plain', 'application/txt', 'text/markdown'];

    getValidMimeTypes(): string[] {
        return this.validMimeTypes;
    }

    canParse(file: UserUpload): boolean {
        return this.validMimeTypes.includes(file.mimeType);
    }

    async parse(file: UserUpload): Promise<ParsedContent> {
        try {
            const decoder = new TextDecoder('utf-8');
            const text = decoder.decode(file.buffer).trim();

            return {
                type: 'text',
                text: text,
                metadata: {
                    length: text.length,
                    lines: text.split(/\r?\n/).length,
                },
            };
        } catch (err) {
            throw new Error(`Failed to parse .txt file: ${(err as Error).message}`);
        }
    }
}
