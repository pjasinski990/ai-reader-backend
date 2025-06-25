import { Material } from '@/contexts/material/entities/material';

export interface MaterialRepo {
    upsert(material: Material): Promise<Material>;
    getAll(): Promise<Material[]>;
    getByIds(ids: string[]): Promise<Material[]>;
    clear(): Promise<void>;
}
