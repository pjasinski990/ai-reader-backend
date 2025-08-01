import { Request, Router } from 'express';
import { UserUpload } from '@/contexts/material/entities/user-upload';
import { materialController } from '@/contexts/material/interface/controllers/material-controller';
import { asyncWrapper } from '@/shared/utils/async-wrapper';
import { ValidationError } from '@/shared/entities/http-errors';
import { UploadMaterialRequestSchema } from '@/contexts/material/interface/web/upload-material-request';
import multer from 'multer';

export const materialRoutes = Router();

const upload = multer();
materialRoutes.post(
    '/',
    upload.single('file'),
    asyncWrapper(async (req, res) => {
        const upload = parseUploadRequest(req);  // see next step
        const preview = await materialController.handleUploadMaterial(upload);

        res.status(200).json({ ...preview });
    }),
);

materialRoutes.get(
    '/project/:projectId',
    asyncWrapper(async (req, res) => {
        const projectId = req.params.projectId;
        if (!projectId) {
            throw new ValidationError('projectId is required');
        }
        const materials = await materialController.handleListMaterials(projectId);
        res.status(200).json(materials);
    }),
);

materialRoutes.get(
    '/filetypes',
    asyncWrapper(async (req, res) => {
        const validMimes = materialController.handleListValidUploadFiletypes();
        res.status(200).json(validMimes);
    }),
);

function parseUploadRequest(req: Request): UserUpload {
    console.log(req.body);
    const rawData = {
        projectId: req.body.projectId,
        title: req.body.title,
        mimeType: req.body.mimeType,
    };
    console.log(rawData);

    const parseResult = UploadMaterialRequestSchema.safeParse(rawData);
    if (!parseResult.success) {
        throw new ValidationError('Invalid upload request', parseResult.error.flatten());
    }

    if (!req.file) {
        throw new ValidationError('Missing uploaded file');
    }

    return {
        projectId: parseResult.data.projectId,
        title: parseResult.data.title,
        mimeType: parseResult.data.mimeType,
        buffer: req.file.buffer,
    };
}
