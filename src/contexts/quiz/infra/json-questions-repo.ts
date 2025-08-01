import path from 'path';
import { promises as fs } from 'fs';
import { QuestionsRepo } from '../application/ports/out/questions-repo';
import { QuizQuestion } from '@/contexts/quiz/entities';

export class JsonQuestionsRepo implements QuestionsRepo {
    private readonly dbPath: string;

    constructor() {
        this.dbPath = path.resolve(process.cwd(), 'mockdb', 'questions.json');
    }
    async getById(id: string): Promise<QuizQuestion> {
        const questions = await this.readAll();
        const question = questions.find(q => q.id === id);
        if (!question) {
            throw new Error('Question not found');
        }
        return question;
    }

    async upsert(question: QuizQuestion): Promise<QuizQuestion> {
        const questions = await this.readAll();
        const questionIndex = questions.findIndex(q => q.id === question.id);
        if (questionIndex !== -1) {
            questions[questionIndex] = question;
        } else {
            questions.push(question);
        }
        await this.writeAll(questions);
        return question;
    }

    async getAll(quizId: string): Promise<QuizQuestion[]> {
        const questions = await this.readAll();
        return questions.filter(q => q.quizId === quizId);
    }

    private async ensureFileExists() {
        const dir = path.dirname(this.dbPath);
        await fs.mkdir(dir, { recursive: true });
        try {
            await fs.access(this.dbPath);
        } catch {
            await fs.writeFile(this.dbPath, '[]', 'utf-8');
        }
    }

    private async readAll(): Promise<QuizQuestion[]> {
        await this.ensureFileExists();
        const raw = await fs.readFile(this.dbPath, 'utf-8');
        try {
            return JSON.parse(raw) as QuizQuestion[];
        } catch {
            return [];
        }
    }

    private async writeAll(questions: QuizQuestion[]): Promise<void> {
        await this.ensureFileExists();
        await fs.writeFile(this.dbPath, JSON.stringify(questions, null, 2), 'utf-8');
    }
}
