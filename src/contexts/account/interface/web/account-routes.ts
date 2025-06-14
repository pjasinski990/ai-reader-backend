import { Router } from 'express';

export const accountRoutes = Router();

accountRoutes.get('/:id', (req, res) => {
    res.send('get account details');
    // parse body, call controller
});

accountRoutes.put('/:id', (req, res) => {
    res.send('update account details');
    // parse body, call controller
});
