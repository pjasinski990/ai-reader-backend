import { QuizQuestion } from '../../entities';
import { GetQuizQuestions } from '../ports/in/get-quiz-questions';
import { QuestionsRepo } from '../ports/out/questions-repo';

export class GetQuizQuestionsUseCase implements GetQuizQuestions {
    constructor(
        private readonly questionsRepo: QuestionsRepo
    ) {}

    // TODO map to some other type that will be used on the UI
    async execute(quizId: string): Promise<QuizQuestion[]> {
        return await this.questionsRepo.getAllQuestionsFromQuiz(quizId);
    }
}
