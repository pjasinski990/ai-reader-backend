import { ProjectRepo } from '@/contexts/project/application/ports/out/project-repo';
import { UiProject } from '@/contexts/project/entities/ui-project';

export interface GetUserProjects {
    execute(
        repo: ProjectRepo,
        userId: string,
    ): Promise<UiProject[]>;
}
