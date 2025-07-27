import { CreateQuizFromMaterial, QuizCreationParams } from '@/contexts/quiz/application/ports/in/create-quiz-from-material';
import { CreateQuizFromMaterialUseCase } from '@/contexts/quiz/application/use-cases/create-quiz-from-material';
import { OpenAIQuizProvider } from '@/contexts/quiz/infra/llms/openai-quiz-provider';
import { OpenAIStructuredProvider } from '@/shared/infra/llms/open-ai-structured-provider';
import { GetQuizzesFromProject } from '@/contexts/quiz/application/ports/in/get-quizzes-from-project';
import { JsonQuizRepo } from '@/contexts/quiz/infra/json-quiz-repo';
import { JsonQuestionsRepo } from '@/contexts/quiz/infra/json-questions-repo';
import { BasicContentExtractionStrategy } from '@/shared/infra/content-extraction/basic-content-extraction-strategy';
import { QuestionServices, QuestionValidationResult } from '@/contexts/quiz/application/services/quiz-question.service';
import { CheckUserAnswerUseCase } from '@/contexts/quiz/application/use-cases/check-user-answer';
import { CheckUserAnswer } from '@/contexts/quiz/application/ports/in/check-user-answer';
import { GetQuizQuestions } from '@/contexts/quiz/application/ports/in/get-quiz-questions';
import { Answer, QuizDescription } from '@/contexts/quiz/entities';
import { GetQuizzesFromProjectUseCase } from '@/contexts/quiz/application/use-cases/get-quizzes-from-project';
import { GetQuizQuestionsUseCase } from '@/contexts/quiz/application/use-cases/get-quiz-questions';
import { JsonMaterialRepo } from '@/contexts/material/infra/testing/json-materials-repo';
import { QuizQuestionDTO } from '../../entities/quiz-question-dto';

export class QuizController {
    constructor(
        private readonly createQuizFromMaterial: CreateQuizFromMaterial,
        private readonly getQuizzesFromProject: GetQuizzesFromProject,
        private readonly checkUserAnswer: CheckUserAnswer,
        private readonly getQuizQuestions: GetQuizQuestions
    ) { }

    async handleGetQuizzesFromProject(projId: string): Promise<QuizDescription[]> {
        return await this.getQuizzesFromProject.execute(projId);
    }

    async handleQuizCreation(params: QuizCreationParams): Promise<QuizDescription> {
        return await this.createQuizFromMaterial.execute(params);
    }

    async handleAnswerValidation(questionId: string, answer: Answer): Promise<QuestionValidationResult> {
        return await this.checkUserAnswer.execute(questionId, answer);
    }

    async handleGettingQuizQuestions(quizId: string): Promise<QuizQuestionDTO[]> {
        return await this.getQuizQuestions.execute(quizId);
    }
}

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) { throw new Error('OPENAI_API_KEY is required'); }

const quizRepo = new JsonQuizRepo();
const questionsRepo = new JsonQuestionsRepo();
const materialRepo = new JsonMaterialRepo();
const contentExtractionStrategy = new BasicContentExtractionStrategy(materialRepo);

const getQuizzesFromProject = new GetQuizzesFromProjectUseCase(quizRepo);
const structuredLLMProvider = new OpenAIStructuredProvider(apiKey);
const quizProvider = new OpenAIQuizProvider(structuredLLMProvider);
const questionServices = new QuestionServices(structuredLLMProvider, contentExtractionStrategy);

const createQuizFromMaterialUseCase = new CreateQuizFromMaterialUseCase(
    quizProvider,
    contentExtractionStrategy,
    quizRepo,
    questionsRepo
);
const checkUserAnswerUseCase = new CheckUserAnswerUseCase(
    questionsRepo,
    questionServices
);

const getQuizQuestionsUseCase = new GetQuizQuestionsUseCase(questionsRepo);

export const quizController = new QuizController(
    createQuizFromMaterialUseCase,
    getQuizzesFromProject,
    checkUserAnswerUseCase,
    getQuizQuestionsUseCase
);
