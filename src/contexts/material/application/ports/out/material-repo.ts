import { Material } from '@/contexts/material/entities/material';

export interface MaterialRepo {
    upsert(material: Material): Promise<Material>;
    getAll(): Promise<Material[]>;
    clear(): Promise<void>;
}
