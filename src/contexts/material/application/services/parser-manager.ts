import { ParsedContent } from '@/contexts/material/entities/parsed-content';
import { UserUpload } from '@/contexts/material/entities/user-upload';
import { UploadsParser } from '@/contexts/material/application/ports/out/uploads-parser';
import { UnsupportedFileTypeError } from '@/contexts/material/entities/unsupported-file-type-error';

export class ParserManager {
    public parsers: UploadsParser[] = [];

    register(parser: UploadsParser) {
        this.parsers.push(parser);
    }

    async parse(file: UserUpload): Promise<ParsedContent> {
        const parser = this.parsers.find(p => p.canParse(file));
        if (!parser) throw new UnsupportedFileTypeError(`Unsupported file type: ${file.mimeType}`);
        return await parser.parse(file);
    }
}
