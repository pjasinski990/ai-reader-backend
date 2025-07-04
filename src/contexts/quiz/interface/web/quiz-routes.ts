import { Router } from 'express';
import { quizController } from '../controllers/quiz-controller';
import { asyncWrapper } from '@/shared/utils/async-wrapper';

export const quizRoutes = Router();

quizRoutes.get('/:id', asyncWrapper(async (req, res) => {
    const ids = [req.params.id];
    const quizzes = await quizController.handleGetQuizzes(ids);
    res.json(quizzes);
}));

quizRoutes.post('/create', asyncWrapper(async (req, res) => {
    const { projectTitle, materialIds, params } = req.body;
    const quiz = await quizController.handleCreateQuizFromMaterial(projectTitle, materialIds, params);
    res.json(quiz);
}));
