import { QuizRepo } from '@/contexts/quiz/application/ports/out/quiz-repo';
import { Quiz } from '@/contexts/quiz/entities/quiz';

export class InMemoryQuizRepo implements QuizRepo {
    private quizzes: Quiz[] = [];

    upsert(quiz: Quiz): Promise<void> {
        this.quizzes.push(quiz);
        return Promise.resolve();
    }

    getByIds(ids: string[]): Promise<Quiz[]> {
        return Promise.resolve(this.quizzes.filter(q => ids.includes(q.id)));
    }
}
