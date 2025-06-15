import { ParserManager } from '@/contexts/material/application/services/parser-manager';
import { MaterialRepo } from '@/contexts/material/application/ports/out/material-repo';
import { TextChunker } from '@/contexts/material/application/ports/out/text-chunker';
import { Material } from '@/contexts/material/entities/material';
import { Summarizer } from '@/contexts/material/application/ports/out/summarizer';
import { VectorRepo } from '@/contexts/material/application/ports/out/vector-repo';
import { UserUpload } from '@/contexts/material/entities/user-upload';
import { EmbeddingProvider } from '@/contexts/material/application/ports/out/embedding-provider';

export interface UploadMaterial {
    execute(
        manager: ParserManager,
        materialRepo: MaterialRepo,
        textChunker: TextChunker,
        embeddingProvider: EmbeddingProvider,
        summarizer: Summarizer,
        chunksVectorRepo: VectorRepo,
        upload: UserUpload,
    ): Promise<Material>;

    getAvailableMimeTypes(
        parsers: ParserManager
    ): string[];

    getAvailableFileExtensions(
        parsers: ParserManager
    ): string[];
}
