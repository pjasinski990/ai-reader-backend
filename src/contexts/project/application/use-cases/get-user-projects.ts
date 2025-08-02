import { GetUserProjects } from '@/contexts/project/application/ports/in/get-user-projects';
import { ProjectRepo } from '@/contexts/project/application/ports/out/project-repo';
import { Project } from '@/contexts/project/entities/project';

export class GetUserProjectsUseCase implements GetUserProjects {
    async execute(
        repo: ProjectRepo,
        userId: string
    ): Promise<Project[]> {
        return await repo.getByOwnerId(userId);
    }
}
