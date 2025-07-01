import { QuizRepo } from '@/contexts/quiz/application/ports/out/quiz-repo';
import { Quiz } from '@/contexts/quiz/entities/quiz';

export class InMemoryQuizRepo implements QuizRepo {
    private quizzes: Quiz[] = [];

    upsert(quiz: Quiz): Promise<Quiz> {
        if (this.quizzes.find(q => q.id === quiz.id)) {
            this.quizzes = this.quizzes.map(q => q.id === quiz.id ? quiz : q);
        } else {
            this.quizzes.push(quiz);
        }
        return Promise.resolve(quiz);
    }

    getByIds(ids: string[]): Promise<Quiz[]> {
        return Promise.resolve(this.quizzes.filter(q => ids.includes(q.id)));
    }
}
