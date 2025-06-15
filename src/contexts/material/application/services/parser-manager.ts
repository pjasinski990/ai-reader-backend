import { ParsedContent } from '@/contexts/material/entities/pased-content';
import { UserUpload } from '@/contexts/material/entities/user-upload';
import { UploadsParser } from '@/contexts/material/application/ports/out/uploads-parser';

export class ParserManager {
    public parsers: UploadsParser[] = [];

    register(parser: UploadsParser) {
        this.parsers.push(parser);
    }

    async parse(file: UserUpload): Promise<ParsedContent> {
        const parser = this.parsers.find(p => p.canParse(file));
        if (!parser) throw new Error('Unsupported file type');
        return await parser.parse(file);
    }
}
