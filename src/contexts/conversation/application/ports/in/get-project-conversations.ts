import { Conversation } from '@/contexts/conversation/entities/conversation';

export interface GetProjectConversations {
    execute(
        projectId: string,
    ): Promise<Conversation[]>;
}
