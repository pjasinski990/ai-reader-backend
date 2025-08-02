import express from 'express';
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
import { logger } from '@/shared/interface/controllers/logging-controller';
import { accessLogger } from '@/middleware/access-logs';

const app = express();
const port = process.env.PORT || 5000;

app.use(accessLogger);
app.use(express.json({ limit: '50mb'}));
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

app.use('/api/auth', authRoutes);

const auth = new BuildAuthMiddlewareUseCase().execute(extractAccessTokenFromCookie, verifyJwtAccessToken);
app.use(auth);
app.use('/api/material', materialRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/conversation', conversationRoutes);
app.use('/api/project', projectRoutes);

app.use(expressErrorHandler);

const server = app.listen(port, () => {
    logger.info(`Server is running at http://localhost:${port}`);
});

process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Shutting down...');
    server.close(() => {
        logger.info('Server closed.');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    logger.info('SIGINT received. Shutting down...');
    server.close(() => {
        logger.info('Server closed.');
        process.exit(0);
    });
});
