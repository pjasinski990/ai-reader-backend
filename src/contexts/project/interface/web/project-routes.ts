import { Request, Router } from 'express';
import { projectController } from '@/contexts/project/interface/controllers/project-controller';
import { Project, ProjectSchema } from '@/contexts/project/entities/project';
import { ForbiddenError, ValidationError } from '@/shared/entities/http-errors';
import { asyncWrapper } from '@/shared/utils/async-wrapper';
import { AccessTokenPayload } from '@/contexts/auth/entities/access-token-payload';

export const projectRoutes = Router();

projectRoutes.get('/', async (req, res) => {
    const authenticatedUser = req.authToken!;
    const projects = await projectController.handleGetUserProjects(authenticatedUser.userId);
    res.json(projects);
});

projectRoutes.post(
    '/',
    asyncWrapper(async (req, res) => {
        const authenticatedUser = req.authToken!;
        const project = parseProject(req);
        validateAccess(authenticatedUser, project);

        await projectController.handleAddProject(project);
        res.status(200).json({ message: 'Project added!' });
    }),
);

function parseProject(req: Request): Project {
    const parseResult = ProjectSchema.safeParse(req.body);
    if (!parseResult.success) {
        throw new ValidationError('Invalid new project request', parseResult.error.flatten());
    }
    return parseResult.data;
}

function validateAccess(auth: AccessTokenPayload, project: Project) {
    if (auth.userId !== project.ownerId) {
        throw new ForbiddenError(`You must be the owner. Logged as: ${auth.userId}, specified: ${project.ownerId}`);
    }
}
