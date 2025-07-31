import { LearningRoadmap } from '@/contexts/project/entities/learning-roadmap';
import { ConversationPreview } from '@/contexts/project/entities/conversation-preview';
import { QuizPreview } from '@/contexts/project/entities/quiz-preview';

export interface UiProject {
    id: string;
    title: string;
    roadmap: LearningRoadmap;
    conversations: ConversationPreview[];
    quizzes: QuizPreview[];
}
