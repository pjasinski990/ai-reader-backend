import { Message } from '@/shared/entities/message';

export interface LLMProvider {
    query(conversation: Message[]): Promise<string>;
    streamQuery: (conversation: Message[]) => AsyncGenerator<string, void, unknown>;
}
