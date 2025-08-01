import { CreateQuizFromMaterial, QuizCreationParams, QuizDifficulty } from '../ports/in/create-quiz-from-material';
import { QuizProvider } from '../ports/out/quiz-provider';
import { v4 as uuidv4 } from 'uuid';
import { QuizRepo } from '../ports/out/quiz-repo';
import { ContentExtractionStrategy } from '@/shared/ports/out/content-extraction-strategy';
import { GeneratedQuizQuestion, QuestionType, QuizDescription, toQuizQuestion } from '../../entities';
import { QuestionsRepo } from '../ports/out/questions-repo';

export class CreateQuizFromMaterialUseCase implements CreateQuizFromMaterial {
    constructor(
        private readonly quizProvider: QuizProvider,
        private readonly contentExtractionStrategy: ContentExtractionStrategy,
        private readonly quizRepo: QuizRepo,
        private readonly questionsRepo: QuestionsRepo
    ) {}
    
    async execute(
        params: QuizCreationParams
    ): Promise<QuizDescription> {
        const newQuiz: QuizDescription = {
            id: uuidv4(),
            projId: params.projId,
            userId: params.userId,
            name: `${this.formatDifficultyLevel(params.difficulty)} Quiz ${new Date().toLocaleDateString()}`,
            completed: 'NEW'
        };

        const content = await this.contentExtractionStrategy.extractContent({projId: params.projId});
        const generatedQuestions = await this.generateQuestionsFromContent(content, params);
        const quizQuestions = generatedQuestions.map(q => toQuizQuestion(q, newQuiz.id));
        
        await this.quizRepo.upsert(newQuiz);
        quizQuestions.forEach(async (q) => await this.questionsRepo.upsert(q));
        return newQuiz;
    }

    private async generateQuestionsFromContent(content: string, params: QuizCreationParams) {
        const questions: GeneratedQuizQuestion[] = [];

        const { multipleChoiceCount, openEndedCount } = this.calculateQuestionDistribution(params);

        if (params.includeMultipleChoice && multipleChoiceCount > 0) {
            const mcsQuestions = await this.generateQuestionsForGivenType(content, params.difficulty, multipleChoiceCount, 'multiple_choice');
            questions.push(...mcsQuestions);
        }

        if (params.includeOpenEnded && openEndedCount > 0) {
            const oeQuestions = await this.generateQuestionsForGivenType(content, params.difficulty, multipleChoiceCount, 'open_ended');
            questions.push(...oeQuestions);
        }

        const shuffledQuestions = this.shuffleQuestions(questions);
        return shuffledQuestions;
    }

    private async generateQuestionsForGivenType(content: string, difficulty: QuizDifficulty, numberOfQuestions: number, questionType: QuestionType) {
        const questions = await this.quizProvider.generateQuestionsFromContent(
            content,
            { 
                difficulty,
                numberOfQuestions,
                questionType
            }
        );
        return questions;
    }

    private calculateQuestionDistribution(params: QuizCreationParams): { multipleChoiceCount: number; openEndedCount: number } {
        const { numberOfQuestions, includeMultipleChoice, includeOpenEnded } = params;

        if (includeMultipleChoice && includeOpenEnded) {
            const openEndedCount = Math.floor(numberOfQuestions * 0.3);
            const multipleChoiceCount = numberOfQuestions - openEndedCount;
            return { multipleChoiceCount, openEndedCount };
        }
        
        if (includeMultipleChoice && !includeOpenEnded) {
            return { multipleChoiceCount: numberOfQuestions, openEndedCount: 0 };
        }
        
        if (!includeMultipleChoice && includeOpenEnded) {
            return { multipleChoiceCount: 0, openEndedCount: numberOfQuestions };
        }
        
        return { multipleChoiceCount: numberOfQuestions, openEndedCount: 0 };
    }

    private shuffleQuestions(questions: GeneratedQuizQuestion[]): GeneratedQuizQuestion[] {
        const shuffled = [...questions];
        
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        
        return shuffled;
    }

    private formatDifficultyLevel(difficulty: QuizDifficulty): string {
        return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    }
}
