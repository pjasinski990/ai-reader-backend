import { Conversation } from '@/contexts/conversation/entities/conversation';

export interface GetConversations {
    execute(
        ids: string[]
    ): Promise<Conversation[]>;
}
