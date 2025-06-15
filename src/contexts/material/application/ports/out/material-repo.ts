import { Material } from '@/shared/entities/material';

export interface MaterialRepo {
    upsert(material: Material): Promise<Material>;
    getAll(): Promise<Material[]>;
    clear(): Promise<void>;
}
