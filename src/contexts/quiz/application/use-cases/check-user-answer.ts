import { Answer, CheckedAnswer, QuizQuestion } from '@/contexts/quiz/entities';
import { CheckUserAnswer } from '../ports/in/check-user-answer';
import { QuestionsRepo } from '../ports/out/questions-repo';
import { QuestionServices, QuestionValidationResult } from '../services/quiz-question.service';

export class CheckUserAnswerUseCase implements CheckUserAnswer {
    constructor(
        private readonly questionsRepo: QuestionsRepo,
        private readonly questionServices: QuestionServices
    ) {}

    async execute(questionId: string, answer: Answer): Promise<QuestionValidationResult> {
        const question = await this.questionsRepo.getById(questionId);
        const questionWithUserAnswer = await this.saveUserAnswer(question, answer);

        const validationResult = await this.questionServices.validate(question, answer);
        
        await this.saveCheckedQuestion(questionWithUserAnswer, answer, validationResult);
        return validationResult;
    }

    private async saveUserAnswer(question: QuizQuestion, answer: Answer): Promise<QuizQuestion> {
        const newQuestion: QuizQuestion = {
            ...question,
            userAnswer: {
                'state': 'NOT_CHECKED',
                answer
            }
        };
        return this.questionsRepo.upsertQuestion(newQuestion);
    }

    private async saveCheckedQuestion(question: QuizQuestion, answer: Answer, validationResult: QuestionValidationResult): Promise<void> {
        const answerState: CheckedAnswer = {
            state: 'CHECKED',
            answer,
            isCorrect: validationResult.ok,
            comment: !validationResult.ok ? validationResult.error : undefined
        };
        await this.questionsRepo.upsertQuestion({
            ...question,
            userAnswer: answerState
        });
    }
}
