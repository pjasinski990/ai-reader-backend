import { ParserManager } from '@/contexts/material/application/services/parser-manager';
import { UploadMaterial } from '@/contexts/material/application/ports/in/upload-material';
import { Material, MaterialPreview } from '@/contexts/material/entities/material';
import { UserUpload } from '@/contexts/material/entities/user-upload';
import { TxtParser } from '@/contexts/material/infra/parsing/txt-parser';
import { PdfParser } from '@/contexts/material/infra/parsing/pdf-parser';
import { RecursiveTextChunker } from '@/contexts/material/infra/chunking/recursive-text-chunker';
import { JsonMaterialRepo } from '@/contexts/material/infra/testing/json-materials-repo';
import { JsonVectorRepo } from '@/contexts/material/infra/vector-repo/json-vector-repo';
import { UploadMaterialUseCase } from '@/contexts/material/application/use-cases/upload-material';
import { ListMaterials } from '@/contexts/material/application/ports/in/list-materials';
import { ListMaterialsUseCase } from '@/contexts/material/application/use-cases/list-materials';
import { OpenAIEmbeddingProvider } from '@/contexts/material/infra/embedding/openai-embedding-provider';
import { LLMSummarizer } from '@/contexts/material/infra/summarizing/llm-summarizer';
import { OpenAIProvider } from '@/shared/infra/llms/open-ai-provider';
import { ListValidUploadFiletypes } from '@/contexts/material/application/ports/in/list-valid-upload-filetypes';
import { ListValidUploadFiletypesUseCase } from '@/contexts/material/application/use-cases/list-valid-upload-filetypes';
import { MockEmbeddingProvider } from '@/contexts/material/infra/testing/mock-embedding-provider';
import { MockSummarizer } from '@/contexts/material/infra/testing/mock-summarizer';

export class MaterialController {
    constructor(
        private readonly parserManager: ParserManager,
        private readonly uploadMaterial: UploadMaterial,
        private readonly listMaterials: ListMaterials,
        private readonly listValidUploadFiletypes: ListValidUploadFiletypes
    ) { }

    async handleUploadMaterial(upload: UserUpload): Promise<MaterialPreview> {
        const uploaded = await this.uploadMaterial.execute(upload);
        return toMaterialPreview(uploaded);
    }

    async handleListMaterials(projectId: string): Promise<MaterialPreview[]> {
        return this.listMaterials.execute(projectId);
    }

    handleListValidUploadFiletypes = () => {
        return this.listValidUploadFiletypes.execute(this.parserManager);
    };
}

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) { throw new Error('OPENAI_API_KEY is required'); }

const parserManager: ParserManager = new ParserManager();
parserManager.register(new PdfParser());
parserManager.register(new TxtParser());

const embeddingProvider = new OpenAIEmbeddingProvider(apiKey);
const summarizer = new LLMSummarizer(new OpenAIProvider(apiKey));

// const embeddingProvider = new MockEmbeddingProvider();
// const summarizer = new MockSummarizer();
const materialRepo = new JsonMaterialRepo();
const textChunker = new RecursiveTextChunker();
const chunksVectorRepo = new JsonVectorRepo();

export const materialController = new MaterialController(
    parserManager,
    new UploadMaterialUseCase(
        parserManager,
        materialRepo,
        textChunker,
        embeddingProvider,
        summarizer,
        chunksVectorRepo,
    ),
    new ListMaterialsUseCase(
        materialRepo
    ),
    new ListValidUploadFiletypesUseCase(),
);

function toMaterialPreview(material: Material): MaterialPreview {
    return {
        id: material.id,
        projectId: material.projectId,
        title: material.title,
        type: material.content.type,
        metadata: material.content.metadata ?? {},
    };
}
