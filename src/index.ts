import express from 'express';
import { accountRoutes } from '@/contexts/account/interface/web/account-routes';
import { authRoutes } from '@/contexts/auth/interface/web/auth-routes';
import { materialRoutes } from '@/contexts/material/interface/web/material-routes';
import { projectRoutes } from '@/contexts/project/interface/web/project-routes';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.use('/api/account', accountRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/material', materialRoutes);
app.use('/api/project', projectRoutes);

app.get('/', (_req, res) => {
    res.send('Hello world');
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
