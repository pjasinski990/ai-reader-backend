import express from 'express';
import { accountRoutes } from '@/contexts/account/interface/web/account-routes';
import { authRoutes } from '@/contexts/auth/interface/web/auth-routes';
import { projectRoutes } from '@/contexts/project/interface/web/project-routes';
import { materialRoutes } from '@/contexts/material/interface/web/material-routes';
import { expressErrorHandler } from '@/middleware/express-error-handler';
import { expressJwtAuth } from '@/middleware/express-jwt-auth';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use('/api/auth', authRoutes);

app.use(expressJwtAuth);
app.use('/api/account', accountRoutes);
app.use('/api/material', materialRoutes);
app.use('/api/project', projectRoutes);

app.use(expressErrorHandler);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
