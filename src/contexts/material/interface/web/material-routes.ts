import { Router } from 'express';

export const materialRoutes = Router();

materialRoutes.get('/:id', (req, res) => {
    res.send('get material');
    // parse body, call controller
});

materialRoutes.post('/:id', (req, res) => {
    res.send('set material');
    // parse body, call controller
});

export default materialRoutes;
