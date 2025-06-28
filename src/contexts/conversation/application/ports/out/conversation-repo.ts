import { Conversation } from '@/contexts/conversation/entities/conversation';

export interface ConversationRepo {
    getByIds(ids: string[]): Promise<Conversation[]>;
}
