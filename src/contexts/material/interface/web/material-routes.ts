import express, { Request, Router } from 'express';
import { z } from 'zod';
import { UserUpload } from '@/contexts/material/entities/user-upload';
import { materialController } from '@/contexts/material/interface/controllers/material-controller';
import { ValidationError } from '@/shared/entities/validation-error';
import { asyncWrapper } from '@/shared/utils/async-wrapper';
import { MissingResourceError } from '@/shared/entities/missing-resource-error';

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

materialRoutes.get(
    '/',
    asyncWrapper(async (req, res) => {
        console.log('Get all materials');
        const materials = await materialController.getAllMaterials();
        res.status(200).json(materials);
    }),
);

materialRoutes.get(
    '/:id',
    asyncWrapper(async (req, res) => {
        console.log('Get material');
        const materials = await materialController.getMaterialsByIds([req.params.id]);
        if (!materials[0]) {
            throw new MissingResourceError(`Material id: ${req.params.id} not found`);
        }
        res.status(200).json(materials[0]);
    }),
);

function parseUploadRequest(req: Request): UserUpload {
    const parseResult = PostMaterialSchema.safeParse(req.body);
    if (!parseResult.success) {
        throw new ValidationError('Invalid upload request', parseResult.error.flatten());
    }

    const { data } = parseResult.data;
    const buffer = Buffer.from(data, 'base64');
    return { name: parseResult.data.name, mimeType: parseResult.data.mimeType, data: buffer };
}
