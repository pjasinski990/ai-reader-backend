import { ProjectRepo } from '@/contexts/project/application/ports/out/project-repo';
import { Project } from '@/contexts/project/entities/project';
import { GetUserProjects } from '@/contexts/project/application/ports/in/get-user-projects';
import { ManageProject } from '@/contexts/project/application/ports/in/manage-project';
import { GetUserProjectsUseCase } from '@/contexts/project/application/use-cases/get-user-projects';
import { ManageProjectUseCase } from '@/contexts/project/application/use-cases/manage-project';
import { JsonProjectRepo } from '@/contexts/project/infra/json-project-repo';

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

export const projectController = new ProjectController(
    new JsonProjectRepo(),
    new GetUserProjectsUseCase(),
    new ManageProjectUseCase(),
);
