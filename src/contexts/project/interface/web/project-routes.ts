import { Router } from 'express';
import { projectController } from '@/contexts/project/interface/controllers/project-controller';
import { Project, ProjectSchema } from '@/contexts/project/entities/project';
import { ValidationError } from '@/shared/entities/http-errors';
import { asyncWrapper } from '@/shared/utils/async-wrapper';

export const projectRoutes = Router();

projectRoutes.get('/', async (req, res) => {
    const projects = await projectController.handleGetUserProjects(req.user!.userId);
    res.json(projects);
});

projectRoutes.post(
    '/',
    asyncWrapper(async (req, res) => {
        const parseResult = ProjectSchema.safeParse(req.body);
        if (!parseResult.success) {
            throw new ValidationError('Invalid new project request', parseResult.error.flatten());
        }
        const project = parseResult.data as Project;
        await projectController.handleAddProject(project);
        res.status(200).json({ message: 'Project added!' });
    }),
);
