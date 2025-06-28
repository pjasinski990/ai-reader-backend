import { QuizQuestion } from '@/contexts/quiz/entities/quiz-question';

export interface Quiz {
    id: string;
    name: string;
    questions: QuizQuestion[];
    completed: boolean;
}
