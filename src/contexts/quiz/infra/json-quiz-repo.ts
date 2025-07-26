import { QuizRepo } from '../application/ports/out/quiz-repo';
import path from 'path';
import { promises as fs } from 'fs';
import { QuizDescription } from '../entities/quiz-description';

export class JsonQuizRepo implements QuizRepo {
    private readonly dbPath: string;

    constructor() {
        this.dbPath = path.resolve(process.cwd(), 'mockdb', 'quiz.json');
    }

    async upsert(quiz: QuizDescription): Promise<QuizDescription> {
        const quizzes = await this.readAll();
        const quizIndex = quizzes.findIndex(q => q.id === quiz.id);
        if (quizIndex !== -1) {
            quizzes[quizIndex] = quiz;
        } else {
            quizzes.push(quiz);
        }
        await this.writeAll(quizzes);
        return quiz;
    }
    
    async deleteById(quizId: string): Promise<void> {
        const quizzes = await this.readAll();
        const quizIndex = quizzes.findIndex(q => q.id === quizId);
        if (quizIndex !== -1) {
            quizzes.splice(quizIndex, 1);
        }
        await this.writeAll(quizzes);
    }

    async getAllForProject(projId: string): Promise<QuizDescription[]> {
        const quizzes = await this.readAll();
        return quizzes.filter(q => q.projId === projId);
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

    private async readAll(): Promise<QuizDescription[]> {
        await this.ensureFileExists();
        const raw = await fs.readFile(this.dbPath, 'utf-8');
        try {
            return JSON.parse(raw) as QuizDescription[];
        } catch {
            return [];
        }
    }

    private async writeAll(users: QuizDescription[]): Promise<void> {
        await this.ensureFileExists();
        await fs.writeFile(this.dbPath, JSON.stringify(users, null, 2), 'utf-8');
    }
}
