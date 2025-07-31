import { Material } from '@/contexts/material/entities/material';
import { UserUpload } from '@/contexts/material/entities/user-upload';

export interface UploadMaterial {
    execute(upload: UserUpload): Promise<Material>;
}
