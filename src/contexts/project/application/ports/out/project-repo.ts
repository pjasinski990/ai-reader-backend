import { Project } from '@/contexts/project/entities/project';

export interface ProjectRepo {
    upsert(project: Project): Promise<void>;
    clear(): Promise<void>;
    getById(id: string): Promise<Project | null>;
    remove(id: string): Promise<void>;
    getAll(): Promise<Project[]>;
    getByOwnerId(userId: string): Promise<Project[]>;
}
