import { Conversation } from '@/contexts/conversation/entities/conversation';
import { Message } from '@/shared/entities/message';
import { Result } from '@/shared/entities/result';

export interface AddMessageToConversation {
    execute(
        newMessage: Message,
    ): Promise<Result<Conversation, string>>;
}
