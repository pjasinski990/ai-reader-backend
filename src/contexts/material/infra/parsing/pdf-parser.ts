import { UploadsParser } from '@/shared/application/ports/out/uploads-parser';
import { UserUpload } from '@/shared/entities/user-upload';
import { ParsedContent } from '@/shared/entities/parsed-content';
import pdfParse from 'pdf-parse';

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
