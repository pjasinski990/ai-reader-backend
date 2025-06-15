import express, { NextFunction, Request, Response } from 'express';
import { accountRoutes } from '@/contexts/account/interface/web/account-routes';
import { authRoutes } from '@/contexts/auth/interface/web/auth-routes';
import { projectRoutes } from '@/contexts/project/interface/web/project-routes';
import { materialRoutes } from '@/contexts/material/interface/web/material-routes';
import { ValidationError } from '@/shared/entities/validation-error';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.use('/api/account', accountRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/material', materialRoutes);
app.use('/api/project', projectRoutes);

app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
    void req;
    void _next;

    if (err instanceof ValidationError) {
        res.status(err.status).json({
            error: err.message,
            details: err.details
        });
        return;
    }

    console.error(err);
    res.status(500).json({
        error: err instanceof Error ? err.message : 'Internal server error',
    });
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
