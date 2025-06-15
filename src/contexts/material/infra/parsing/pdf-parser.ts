import pdfParse from 'pdf-parse';
import { UploadsParser } from '@/contexts/material/application/ports/out/uploads-parser';
import { UserUpload } from '@/contexts/material/entities/user-upload';
import { ParsedContent } from '@/contexts/material/entities/pased-content';

export class PdfParser implements UploadsParser {
    private readonly validMimeTypes = ['application/pdf'];

    getValidMimeTypes() {
        return this.validMimeTypes;
    }

    canParse(file: UserUpload)      {
        return this.validMimeTypes.includes(file.mimeType);
    }

    async parse(file: UserUpload): Promise<ParsedContent> {
        const { text, numpages } = await pdfParse(file.data);

        return {
            type: 'text',
            text: text.trim(),
            metadata: { pages: numpages },
        };
    }
}
