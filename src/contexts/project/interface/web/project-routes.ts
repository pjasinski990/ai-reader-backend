import { Router } from 'express';
import { projectController } from '@/contexts/project/interface/controllers/project-controller';

export const projectRoutes = Router();

projectRoutes.get('/', async (req, res) => {
    const projects = await projectController.handleGetUserProjects(req.user!.userId);
    res.json(projects);
});

projectRoutes.post('/', (req, res) => {
    res.send('add project');
    // parse body, call controller
});
