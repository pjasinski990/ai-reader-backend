import express, { Request, Router } from 'express';
import { z } from 'zod';
import { UserUpload } from '@/contexts/material/entities/user-upload';
import { materialController } from '@/contexts/material/interface/controllers/material-controller';
import { ValidationError } from '@/shared/entities/validation-error';
import { asyncWrapper } from '@/shared/utils/async-wrapper';

export const materialRoutes = Router();

export const PostMaterialSchema = z.object({
    name: z.string(),
    mimeType: z.string(),
    data: z.string().min(1, 'Must be base64-encoded file data'),
});

materialRoutes.post(
    '/',
    express.json({ limit: '20mb' }),
    asyncWrapper(async (req, res) => {
        const upload = parseUploadRequest(req);
        await materialController.uploadMaterial(upload);
        res.status(200).json({ message: 'Upload received' });
    }),
);

materialRoutes.get('/:id', () => {
    console.log('get material');
});

function parseUploadRequest(req: Request): UserUpload {
    const parseResult = PostMaterialSchema.safeParse(req.body);
    if (!parseResult.success) {
        throw new ValidationError('Invalid upload request', parseResult.error.flatten());
    }

    const { data } = parseResult.data;
    const buffer = Buffer.from(data, 'base64');
    return { name: parseResult.data.name, mimeType: parseResult.data.mimeType, data: buffer };
}
