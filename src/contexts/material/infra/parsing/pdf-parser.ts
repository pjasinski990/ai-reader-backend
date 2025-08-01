import pdfParse from 'pdf-parse';
import { UploadsParser } from '@/contexts/material/application/ports/out/uploads-parser';
import { UserUpload } from '@/contexts/material/entities/user-upload';
import { ParsedContent } from '@/contexts/material/entities/parsed-content';

export class PdfParser implements UploadsParser {
    private readonly validMimeTypes = ['application/pdf'];

    getValidMimeTypes() {
        return this.validMimeTypes;
    }

    canParse(file: UserUpload) {
        return this.validMimeTypes.includes(file.mimeType);
    }

    async parse(file: UserUpload): Promise<ParsedContent> {
        const result = await pdfParse(file.buffer);
        const { text, numpages } = result;

        return {
            type: 'text',
            text: text.trim(),
            metadata: { pages: numpages },
        };
    }
}
