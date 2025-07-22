import { ProjectRepo } from '@/contexts/project/application/ports/out/project-repo';
import { Project } from '@/contexts/project/entities/project';
import { GetUserProjects } from '@/contexts/project/application/ports/in/get-user-projects';
import { ManageProject } from '@/contexts/project/application/ports/in/manage-project';
import { InMemoryProjectRepo } from '@/contexts/project/infra/in-memory-project-repo';
import { GetUserProjectsUseCase } from '@/contexts/project/application/use-cases/get-user-projects';
import { ManageProjectUseCase } from '@/contexts/project/application/use-cases/manage-project';
import { InAppMaterialPreviewRetriever } from '@/contexts/project/infra/in-app-material-preview-retriever';
import { InAppQuizPreviewRetriever } from '@/contexts/project/infra/in-app-quiz-preview-retriever';
import { GetQuizzesUseCase } from '@/contexts/quiz/application/use-cases/get-quizzes';
import { InMemoryQuizRepo } from '@/contexts/quiz/infra/in-memory-quiz-repo';
import { GetMaterialsUseCase } from '@/contexts/material/application/use-cases/get-materials';
import { JsonMaterialRepo } from '@/contexts/material/infra/testing/json-materials-repo';
import { InAppConversationPreviewRetriever } from '@/contexts/project/infra/in-app-conversation-preview-retriever';
import { GetProjectConversationsUseCase } from '@/contexts/conversation/application/use-cases/get-project-conversations';
import { InMemoryConversationRepo } from '@/contexts/conversation/infra/in-memory-conversation-repo';

export class ProjectController {
    constructor(
        private readonly projectRepo: ProjectRepo,
        private readonly getUserProjects: GetUserProjects,
        private readonly manageProject: ManageProject,
    ) { }

    handleGetUserProjects(userId: string) {
        return this.getUserProjects.execute(this.projectRepo, userId);
    }

    handleAddProject(project: Project) {
        return this.manageProject.addProject(this.projectRepo, project);
    }

    handleDeleteProject(projectId: string) {
        return this.manageProject.removeProject(this.projectRepo, projectId);
    }
}

// TODO I don't like that we breach the boundaries between contexts here
export const projectController = new ProjectController(
    new InMemoryProjectRepo(),
    new GetUserProjectsUseCase(
        new InAppConversationPreviewRetriever(new GetProjectConversationsUseCase(new InMemoryConversationRepo())),
        new InAppMaterialPreviewRetriever(new GetMaterialsUseCase(new JsonMaterialRepo())),
        new InAppQuizPreviewRetriever(new GetQuizzesUseCase(new InMemoryQuizRepo()))
    ),
    new ManageProjectUseCase(),
);
