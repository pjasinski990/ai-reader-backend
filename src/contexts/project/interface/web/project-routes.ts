import { Router } from 'express';

export const projectRoutes = Router();

projectRoutes.get('/:id', (req, res) => {
    res.send('get project');
    // parse body, call controller
});

projectRoutes.post('/:id', (req, res) => {
    res.send('set project');
    // parse body, call controller
});

export default projectRoutes;
