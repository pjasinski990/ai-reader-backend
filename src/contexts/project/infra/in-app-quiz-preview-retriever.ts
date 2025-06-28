import { GetQuizzes } from '@/contexts/quiz/application/ports/in/get-quizzes';
import { QuizPreviewRetriever } from '@/contexts/project/application/ports/out/quiz-preview-retriever';

export class InAppQuizPreviewRetriever implements QuizPreviewRetriever {
    constructor(private readonly getQuizzes: GetQuizzes) { }

    async execute(ids: string[]) {
        const quizzes = await this.getQuizzes.execute(ids);
        return quizzes.map(q => {
            return {
                id: q.id,
                name: q.name,
                numberOfQuestions: q.questions.length,
                completed: q.completed,
            };
        });
    }
}
