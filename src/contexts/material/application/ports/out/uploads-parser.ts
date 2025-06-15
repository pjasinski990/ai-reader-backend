import { UserUpload } from '@/contexts/material/entities/user-upload';
import { ParsedContent } from '@/contexts/material/entities/pased-content';

export interface UploadsParser {
    canParse(file: UserUpload): boolean;
    parse(file: UserUpload): Promise<ParsedContent>;
    getValidMimeTypes(): string[];
}
