import { MaterialRepo } from '@/contexts/material/application/ports/out/material-repo';
import { Material } from '@/contexts/material/entities/material';

export class InMemoryMaterialRepo implements MaterialRepo {
    materials: Material[] = [];

    async upsert(material: Material): Promise<Material> {
        if (this.materials.find(s => s.id === material.id)) {
            this.materials = this.materials.map(s => s.id === material.id ? material : s);
        } else {
            this.materials.push(material);
        }
        return Promise.resolve(material);
    }

    async getAll(): Promise<Material[]> {
        return Promise.resolve(this.materials);
    }

    async clear(): Promise<void> {
        this.materials = [];
    }

    getByIds(ids: string[]): Promise<Material[]> {
        const res = this.materials.filter(m => ids.includes(m.id));
        return Promise.resolve(res);
    }

    async getByProjectId(projectId: string): Promise<Material[]> {
        return this.materials.filter(m => m.id === projectId);
    }
}
