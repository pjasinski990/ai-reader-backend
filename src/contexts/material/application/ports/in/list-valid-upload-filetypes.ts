import { ParserManager } from '@/contexts/material/application/services/parser-manager';

export interface ListValidUploadFiletypes {
    execute(manager: ParserManager): string[];
}
