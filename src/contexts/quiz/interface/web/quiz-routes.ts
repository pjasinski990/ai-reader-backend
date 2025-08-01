import { Router } from 'express';
import { quizController } from '../controllers/quiz-controller';
import { asyncWrapper } from '@/shared/utils/async-wrapper';
import { QuizCreationParamsSchema } from '../../application/ports/in/create-quiz-from-material';

export const quizRoutes = Router();

quizRoutes.get('/:projId', asyncWrapper(async (req, res) => {
    // Any clean way of validating that user has access to the requested project?
    // const authenticatedUser = req.authToken!;
    const projId = req.params.projId;
    const quizzes = await quizController.handleGetQuizzesFromProject(projId);
    res.json(quizzes);
}));

quizRoutes.get('/:quizId/questions', asyncWrapper(async (req, res) => {
    const quizId = req.params.quizId;
    const questions = await quizController.handleGettingQuizQuestions(quizId);
    res.json({ questions });
}));

quizRoutes.post('/', asyncWrapper(async (req, res) => {
    const validationResult = QuizCreationParamsSchema.safeParse(req.body);

    if (!validationResult.success) {
        return res.status(400).json({ errors: validationResult.error.errors });
    }
    const quizCreationParams = validationResult.data;
    const createdQuiz = await quizController.handleQuizCreation(quizCreationParams);
    res.status(201).send({ quiz: createdQuiz });
}));

quizRoutes.post('/questions/:questionId/validate-answer', asyncWrapper(async (req, res) => {
    const { questionId } = req.params;
    const answer = req.body;
    const result = await quizController.handleAnswerValidation(questionId, answer);
    res.json(result);
}));
