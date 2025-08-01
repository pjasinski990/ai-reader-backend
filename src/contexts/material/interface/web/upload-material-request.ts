import { z } from 'zod';

export const UploadMaterialRequestSchema = z.object({
    projectId: z.string(),
    title: z.string(),
    mimeType: z.string(),
});
