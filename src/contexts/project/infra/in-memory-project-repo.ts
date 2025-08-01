import { ProjectRepo } from '@/contexts/project/application/ports/out/project-repo';
import { Project } from '@/contexts/project/entities/project';

export class InMemoryProjectRepo implements ProjectRepo {
    private projects: Project[] = [];

    async upsert(project: Project): Promise<void> {
        const target = this.projects.find((c) => project.id === c.id);
        if (!target) {
            this.projects.push(project);
        } else {
            this.projects = this.projects.map((c) => c.id === target.id ? project : c);
        }
    }

    async getById(id: string): Promise<Project | null> {
        const project = this.projects.find(m => m.id === id);
        return project ?? null;
    }

    async remove(id: string): Promise<void> {
        this.projects = this.projects.filter((c) => c.id !== id);
    }

    async clear(): Promise<void> {
        this.projects = [];
    }

    async getAll(): Promise<Project[]> {
        return this.projects;
    }

    async getByOwnerId(userId: string): Promise<Project[]> {
        return this.projects.filter(p => p.ownerId === userId);
    }
}
