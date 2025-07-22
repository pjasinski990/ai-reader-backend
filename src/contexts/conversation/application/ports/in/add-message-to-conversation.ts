import { Conversation } from '@/contexts/conversation/entities/conversation';
import { Role } from '@/shared/entities/message';

export interface AddMessageToConversation {
    execute(
        conversation: Conversation,
        message: string,
        role: Role,
        id?: string,
    ): Promise<Conversation>;
}
