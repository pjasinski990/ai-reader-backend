import { QuizQuestionDTO, toQuizQuestionDTO } from '../../entities';
import { GetQuizQuestions } from '../ports/in/get-quiz-questions';
import { QuestionsRepo } from '../ports/out/questions-repo';

export class GetQuizQuestionsUseCase implements GetQuizQuestions {
    constructor(
        private readonly questionsRepo: QuestionsRepo
    ) {}

    async execute(quizId: string): Promise<QuizQuestionDTO[]> {
        const quizQuestions = await this.questionsRepo.getAllQuestionsFromQuiz(quizId);
        return quizQuestions.map(toQuizQuestionDTO);
    }
}
