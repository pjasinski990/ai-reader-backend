import { ConversationMessage } from '@/shared/entities/message';

export interface Conversation {
    id: string;
    projectId: string;
    title: string;
    messages: ConversationMessage[];
    mode: Mode;
}

export type Mode = 'course' | 'explain' | 'quiz';
