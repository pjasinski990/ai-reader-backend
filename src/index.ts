import express from 'express';
import { accountRoutes } from '@/contexts/account/interface/web/account-routes';
import { authRoutes } from '@/contexts/auth/interface/web/auth-routes';
import { projectRoutes } from '@/contexts/project/interface/web/project-routes';
import { materialRoutes } from '@/contexts/material/interface/web/material-routes';
import { expressErrorHandler } from '@/middleware/express-error-handler';
import { quizRoutes } from '@/contexts/quiz/interface/web/quiz-routes';
import { conversationRoutes } from '@/contexts/conversation/interface/web/conversation-routes';
import { BuildAuthMiddlewareUseCase } from '@/contexts/auth/application/use-cases/build-auth-middleware';
import cors from 'cors';
import { extractAccessTokenFromCookie, verifyJwtAccessToken } from '@/contexts/auth/application/services/access-token-strategies';
import cookieParser from 'cookie-parser';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

app.use('/api/auth', authRoutes);

const auth = new BuildAuthMiddlewareUseCase().execute(extractAccessTokenFromCookie, verifyJwtAccessToken);
app.use(auth);
app.use('/api/account', accountRoutes);
app.use('/api/material', materialRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/conversation', conversationRoutes);
app.use('/api/project', projectRoutes);

app.use(expressErrorHandler);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
