import { UserUpload } from '@/shared/entities/user-upload';
import { ParsedContent } from '@/shared/entities/parsed-content';

export interface UploadsParser {
    canParse(file: UserUpload): boolean;
    parse(file: UserUpload): Promise<ParsedContent>;
    getValidMimeTypes(): string[];
}
