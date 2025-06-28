import { Message } from '@/shared/ports/out/llm-provider';

export interface Conversation {
    id: string;
    title: string;
    messages: Message[];
    mode: Mode;
}

export type Mode = 'course' | 'explain' | 'quiz' ;
