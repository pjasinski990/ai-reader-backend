import { ManageProject } from '@/contexts/project/application/ports/in/manage-project';
import { Project } from '../../entities/project';
import { ProjectRepo } from '../ports/out/project-repo';

export class ManageProjectUseCase implements ManageProject {
    addProject(projectRepo: ProjectRepo, project: Project): Promise<void> {
        return projectRepo.upsert(project);
    }

    removeProject(projectRepo: ProjectRepo, projectId: string): Promise<void> {
        return projectRepo.remove(projectId);
    }

    editProject(projectRepo: ProjectRepo, project: Project): Promise<void> {
        return projectRepo.upsert(project);
    }
}
