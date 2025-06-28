import { Project } from '@/contexts/project/entities/project';
import { ProjectRepo } from '@/contexts/project/application/ports/out/project-repo';

export interface ManageProject {
    addProject(
        projectRepo: ProjectRepo,
        project: Project
    ): Promise<void>;

    removeProject(
        projectRepo: ProjectRepo,
        projectId: string
    ): Promise<void>;

    editProject(
        projectRepo: ProjectRepo,
        project: Project
    ): Promise<void>;
}
