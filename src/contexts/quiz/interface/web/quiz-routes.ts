import { Router } from 'express';

export const quizRoutes = Router();

quizRoutes.get('/:id', (req, res) => {
    res.send('get quiz');
    // parse body, call controller
});

quizRoutes.post('/', (req, res) => {
    res.send('add conversation');
    // parse body, call controller
});
