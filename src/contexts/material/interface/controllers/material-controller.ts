import { ParserManager } from '@/contexts/material/application/services/parser-manager';
import { MaterialRepo } from '@/contexts/material/application/ports/out/material-repo';
import { TextChunker } from '@/contexts/material/application/ports/out/text-chunker';
import { UploadMaterial } from '@/contexts/material/application/ports/in/upload-material';
import { Material } from '@/contexts/material/entities/material';
import { EmbeddingProvider } from '@/contexts/material/application/ports/out/embedding-provider';
import { Summarizer } from '@/contexts/material/application/ports/out/summarizer';
import { VectorRepo } from '@/contexts/material/application/ports/out/vector-repo';
import { UserUpload } from '@/contexts/material/entities/user-upload';
import { TxtParser } from '@/contexts/material/infra/parsing/txt-parser';
import { PdfParser } from '@/contexts/material/infra/parsing/pdf-parser';
import { RecursiveTextChunker } from '@/contexts/material/infra/chunking/recursive-text-chunker';
import { JsonMaterialRepo } from '@/contexts/material/infra/mocks/json-materials-repo';
import { OpenAIEmbeddingProvider } from '@/contexts/material/infra/embedding/openai-embedding-provider';
import { OpenAIProvider } from '@/shared/infra/llms/open-ai-provider';
import { JsonVectorRepo } from '@/contexts/material/infra/vector-repo/json-vector-repo';
import { LLMSummarizer } from '@/contexts/material/infra/summarizing/llm-summarizer';
import { UploadMaterialUseCase } from '@/contexts/material/application/use-cases/upload-material';

export class UploadsController {
    constructor(
        private readonly parserManager: ParserManager,
        private readonly materialRepo: MaterialRepo,
        private readonly textChunker: TextChunker,
        private readonly embeddingProvider: EmbeddingProvider,
        private readonly summarizer: Summarizer,
        private readonly chunksVectorRepo: VectorRepo,
        private readonly uploadMaterialUseCase: UploadMaterial,
    ) { }

    async uploadMaterial(file: File): Promise<Material> {
        const buffer = Buffer.from(await file.arrayBuffer());
        const upload: UserUpload = {
            name: file.name,
            mimeType: file.type,
            data: buffer,
        };
        return await this.uploadMaterialUseCase.execute(
            this.parserManager,
            this.materialRepo,
            this.textChunker,
            this.embeddingProvider,
            this.summarizer,
            this.chunksVectorRepo,
            upload
        );
    }

    getValidUploadExtensions = () => {
        return this.uploadMaterialUseCase.getAvailableFileExtensions(this.parserManager);
    };

    async getMaterialsByIds(materialIds: string[]): Promise<Material[]> {
        const allMaterials = await this.materialRepo.getAll();
        return allMaterials.filter(material => materialIds.includes(material.id));
    }
}

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) { throw new Error('OPENAI_API_KEY is required'); }

const parserManager: ParserManager = new ParserManager();
parserManager.register(new PdfParser());
parserManager.register(new TxtParser());

export const uploadsController = new UploadsController(
    parserManager,
    new JsonMaterialRepo(),
    new RecursiveTextChunker(),
    new OpenAIEmbeddingProvider(apiKey),
    new LLMSummarizer(new OpenAIProvider(apiKey)),
    new JsonVectorRepo(),
    new UploadMaterialUseCase(),
);

