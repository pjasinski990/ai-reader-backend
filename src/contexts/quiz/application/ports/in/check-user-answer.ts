import { Answer } from '@/contexts/quiz/entities';
import { QuestionValidationResult } from '../../services/quiz-question.service';

export interface CheckUserAnswer {
    execute(questionId: string, answer: Answer): Promise<QuestionValidationResult>;
}
