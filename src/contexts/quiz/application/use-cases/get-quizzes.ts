import { GetQuizzes } from '@/contexts/quiz/application/ports/in/get-quizzes';
import { Quiz } from '@/contexts/quiz/entities/quiz';
import { QuizRepo } from '@/contexts/quiz/application/ports/out/quiz-repo';

export class GetQuizzesUseCase implements GetQuizzes {
    constructor(private readonly quizRepo: QuizRepo) { }

    execute(ids: string[]): Promise<Quiz[]> {
        return this.quizRepo.getByIds(ids);
    }
}
