import { ProjectRepo } from '@/contexts/project/application/ports/out/project-repo';
import { Project } from '@/contexts/project/entities/project';

export class ProjectController {
    constructor(
        private readonly projectRepo: ProjectRepo,
    ) { }

    getUserProjects(userId: string) {

    }

    addProject(project: Project) {

    }

    deleteProject(projectId: string) {}
}
