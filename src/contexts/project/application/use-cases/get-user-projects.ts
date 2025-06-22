import { GetUserProjects } from '@/contexts/project/application/ports/in/get-user-projects';
import { ProjectRepo } from '@/contexts/project/application/ports/out/project-repo';
import { UiProject } from '@/contexts/project/entities/ui-project';
import { Project } from '@/contexts/project/entities/project';
import { MaterialRetriever } from '@/contexts/project/application/ports/out/material-retriever';
import { QuizRetriever } from '@/contexts/project/application/ports/out/quiz-retriever';
import { ConversationRetriever } from '@/contexts/project/application/ports/out/conversation-retriever';

export class GetUserProjectsUseCase implements GetUserProjects {
    constructor(
        private readonly conversationRetriever: ConversationRetriever,
        private readonly materialRetriever: MaterialRetriever,
        private readonly quizRetriever: QuizRetriever,
    ) {}

    async execute(
        repo: ProjectRepo,
        userId: string
    ): Promise<UiProject[]> {
        const projects = await repo.getByOwnerId(userId);
        return Promise.all(projects.map(p => this.enrichWithPreviews(p)));
    }

    async enrichWithPreviews(
        project: Project,
    ): Promise<UiProject> {
        const materials = await this.materialRetriever.execute(project.materialIds);
        const quizzes = await  this.quizRetriever.execute(project.quizIds);
        const conversations = await this.conversationRetriever.execute(project.conversationIds);
        return {
            id: project.id,
            title: project.title,
            roadmap: project.roadmap,
            conversations,
            materials,
            quizzes,
        };
    }
}
