import { Message } from '@/shared/entities/message';

export interface Conversation {
    id: string;
    title: string;
    projectId: string;
    messages: Message[];
    mode: Mode;
}

export type Mode = 'course' | 'explain' | 'quiz' ;
