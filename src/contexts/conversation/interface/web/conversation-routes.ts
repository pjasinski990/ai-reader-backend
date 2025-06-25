import { Router } from 'express';

export const conversationRoutes = Router();

conversationRoutes.get('/:id', (req, res) => {
    res.send('get conversation');
    // parse body, call controller
});

conversationRoutes.post('/', (req, res) => {
    res.send('add conversation');
    // parse body, call controller
});
