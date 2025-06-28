import { Quiz } from '@/contexts/quiz/entities/quiz';
import { GetQuizzes } from '@/contexts/quiz/application/ports/in/get-quizzes';

export class QuizController {
    constructor(
        private readonly getQuizzes: GetQuizzes,
    ) { }

    async handleGetQuizzes(ids: string[]) : Promise<Quiz[]> {
        return this.getQuizzes.execute(ids);
    }
}
