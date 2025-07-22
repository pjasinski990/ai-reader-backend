import { Conversation } from '@/contexts/conversation/entities/conversation';

export interface ConversationRepo {
    upsert(conversation: Conversation): Promise<Conversation>;
    getAll(): Promise<Conversation[]>;
    getByIds(ids: string[]): Promise<Conversation[]>;
    getByProjectId(projectId: string): Promise<Conversation[]>;
    clear(): Promise<void>;
}
