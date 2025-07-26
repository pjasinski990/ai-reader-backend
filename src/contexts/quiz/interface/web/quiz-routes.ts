import { Router } from 'express';
import { quizController } from '../controllers/quiz-controller';
import { asyncWrapper } from '@/shared/utils/async-wrapper';

export const quizRoutes = Router();

quizRoutes.get('/:projId', asyncWrapper(async (req, res) => {
    // Any clean way of validating that user has access to the requested project?
    // const authenticatedUser = req.authToken!;
    const projId = req.params.projId;
    const quizzes = await quizController.handleGetQuizzesFromProject(projId);
    res.json(quizzes);
}));

// quizRoutes.post('/create', asyncWrapper(async (req, res) => {
//     const { projectTitle, materialIds, params } = req.body;
//     const quiz = await quizController.handleCreateQuizFromMaterial(projectTitle, materialIds, params);
//     res.json(quiz);
// }));
