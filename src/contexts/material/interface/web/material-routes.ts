import { Router } from 'express';

export const materialRoutes = Router();

materialRoutes.post('/', () => {
    console.log('upload material')
});

materialRoutes.get('/:id', () => {
    console.log('get material')
});
