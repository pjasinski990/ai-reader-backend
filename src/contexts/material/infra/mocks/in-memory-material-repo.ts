import { MaterialRepo } from '@/contexts/material/application/ports/out/material-repo';
import { Material } from '@/contexts/material/entities/material';

export class InMemoryMaterialRepo implements MaterialRepo {
    materials: Material[] = [];

    upsert(material: Material): Promise<Material> {
        if (this.materials.find(s => s.id === material.id)) {
            this.materials = this.materials.map(s => s.id === material.id ? material : s);
        } else {
            this.materials.push(material);
        }
        return Promise.resolve(material);
    }

    getAll(): Promise<Material[]> {
        return Promise.resolve(this.materials);
    }

    clear(): Promise<void> {
        this.materials = [];
        return Promise.resolve();
    }
}
