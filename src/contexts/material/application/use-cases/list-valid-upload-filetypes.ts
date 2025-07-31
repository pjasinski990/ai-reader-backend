import { ParserManager } from '@/contexts/material/application/services/parser-manager';
import { ListValidUploadFiletypes } from '@/contexts/material/application/ports/in/list-valid-upload-filetypes';
import { UploadsParser } from '@/contexts/material/application/ports/out/uploads-parser';

export class ListValidUploadFiletypesUseCase implements ListValidUploadFiletypes {
    execute(manager: ParserManager) {
        return manager.parsers.reduce(
            (acc: string[], parser: UploadsParser) => acc.concat(parser.getValidMimeTypes()), []
        );
    }
}
