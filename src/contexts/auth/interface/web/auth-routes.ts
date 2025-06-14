import { Router } from 'express';

export const authRoutes = Router();

authRoutes.post('/login', (req, res) => {
    res.send('login route');
    // parse body, call controller
});

authRoutes.post('/register', (req, res) => {
    res.send('register route');
    // parse body, call controller
});
