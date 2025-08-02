import { ProjectRepo } from '@/contexts/project/application/ports/out/project-repo';
import { Project } from '@/contexts/project/entities/project';

export interface GetUserProjects {
    execute(
        repo: ProjectRepo,
        userId: string,
    ): Promise<Project[]>;
}
