import { QuizRepo } from '@/contexts/quiz/application/ports/out/quiz-repo';
import { QuizDescription } from '@/contexts/quiz/entities';

export class InMemoryQuizRepo implements QuizRepo {
    private quizzes: QuizDescription[] = [];

    async upsert(quiz: QuizDescription): Promise<QuizDescription> {
        if (this.quizzes.find(q => q.id === quiz.id)) {
            this.quizzes = this.quizzes.map(q => q.id === quiz.id ? quiz : q);
        } else {
            this.quizzes.push(quiz);
        }
        return quiz;
    }

    async deleteById(quizId: string): Promise<void> {
        this.quizzes = this.quizzes.filter(q => q.id !== quizId);
    }

    async getAllForProject(projId: string): Promise<QuizDescription[]> {
        return this.quizzes.filter(q => q.projId === projId);
    }
}
