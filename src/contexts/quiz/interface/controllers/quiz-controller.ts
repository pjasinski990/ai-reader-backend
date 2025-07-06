import { Quiz } from '@/contexts/quiz/entities/quiz';
import { GetQuizzes } from '@/contexts/quiz/application/ports/in/get-quizzes';
import { CreateQuizFromMaterial, QuizCreationParams } from '@/contexts/quiz/application/ports/in/create-quiz-from-material';
import { QuizProvider } from '@/contexts/quiz/application/ports/out/quiz-provider';
import { MaterialRepo } from '@/contexts/material/application/ports/out/material-repo';
import { ContentExtractionStrategy } from '@/contexts/quiz/application/ports/out/content-extraction-strategy';
import { GetQuizzesUseCase } from '../../application/use-cases/get-quizzes';
import { CreateQuizFromMaterialUseCase } from '../../application/use-cases/create-quiz-from-material';
import { InMemoryQuizRepo } from '../../infra/in-memory-quiz-repo';
import { JsonMaterialRepo } from '@/contexts/material/infra/testing/json-materials-repo';
import { BasicContentExtractionStrategy } from '../../infra/content-extraction/basic-content-extraction-strategy';
import { OpenAIQuizProvider } from '../../infra/llms/openai-quiz-provider';
import { OpenAIStructuredProvider } from '@/shared/infra/llms/open-ai-structured-provider';

export class QuizController {
    constructor(
        private readonly getQuizzes: GetQuizzes,
        private readonly createQuizFromMaterial: CreateQuizFromMaterial,
        private readonly quizProvider: QuizProvider,
        private readonly materialRepo: MaterialRepo,
        private readonly contentExtractionStrategy: ContentExtractionStrategy
    ) { }

    async handleGetQuizzes(ids: string[]) : Promise<Quiz[]> {
        return this.getQuizzes.execute(ids);
    }

    async handleCreateQuizFromMaterial(projectTitle: string, materialIds: string[], params: QuizCreationParams): Promise<Quiz> {
        return this.createQuizFromMaterial.execute(
            projectTitle, 
            materialIds, 
            this.quizProvider, 
            this.materialRepo, 
            this.contentExtractionStrategy, 
            params
        );
    }
}

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) { throw new Error('OPENAI_API_KEY is required'); }

const quizRepo = new InMemoryQuizRepo();
const materialRepo = new JsonMaterialRepo();
const contentExtractionStrategy = new BasicContentExtractionStrategy();
const getQuizzesUseCase = new GetQuizzesUseCase(quizRepo);
const createQuizFromMaterialUseCase = new CreateQuizFromMaterialUseCase();
const structuredLLMProvider = new OpenAIStructuredProvider(apiKey);
const quizProvider = new OpenAIQuizProvider(structuredLLMProvider);

export const quizController = new QuizController(
    getQuizzesUseCase,
    createQuizFromMaterialUseCase,
    quizProvider,
    materialRepo,
    contentExtractionStrategy
);
