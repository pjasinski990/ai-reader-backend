import { QuizDescription } from '../../entities/quiz-description';
import { GetQuizzesFromProject } from '../ports/in/get-quizzes-from-project';
import { QuizRepo } from '../ports/out/quiz-repo';

export class GetQuizzesFromProjectUseCase implements GetQuizzesFromProject {
    constructor(
        private readonly quizRepo: QuizRepo
    ) {}

    async execute(projId: string): Promise<QuizDescription[]> {
        return await this.quizRepo.getAllForProject(projId);
    }
}
