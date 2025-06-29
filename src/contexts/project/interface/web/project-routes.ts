import { Request, Router } from 'express';
import { projectController } from '@/contexts/project/interface/controllers/project-controller';
import { Project, ProjectSchema } from '@/contexts/project/entities/project';
import { UnauthorizedError, ValidationError } from '@/shared/entities/http-errors';
import { asyncWrapper } from '@/shared/utils/async-wrapper';
import { JwtPayload } from '@/contexts/auth/entities/jwt-payload';

export const projectRoutes = Router();

projectRoutes.get('/', async (req, res) => {
    const authenticatedUser = req.user!;
    const projects = await projectController.handleGetUserProjects(authenticatedUser.userId);
    res.json(projects);
});

projectRoutes.post(
    '/',
    asyncWrapper(async (req, res) => {
        const authenticatedUser = req.user!;
        const project = parseProjectFrom(req);
        validateAccess(authenticatedUser, project);

        await projectController.handleAddProject(project);
        res.status(200).json({ message: 'Project added!' });
    }),
);

function parseProjectFrom(req: Request): Project {
    const parseResult = ProjectSchema.safeParse(req.body);
    if (!parseResult.success) {
        throw new ValidationError('Invalid new project request', parseResult.error.flatten());
    }
    return parseResult.data as Project;
}

function validateAccess(auth: JwtPayload, project: Project) {
    if (auth.userId !== project.ownerId) {
        throw new UnauthorizedError(`You must be the owner. Logged as: ${auth.userId}, specified: ${project.ownerId}`);
    }
}
