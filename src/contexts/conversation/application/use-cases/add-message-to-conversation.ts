import { AddMessageToConversation } from '@/contexts/conversation/application/ports/in/add-message-to-conversation';
import { Conversation } from '@/contexts/conversation/entities/conversation';
import { ConversationMessage, Message } from '@/shared/entities/message';
import { ConversationRepo } from '@/contexts/conversation/application/ports/out/conversation-repo';
import { nok, ok, Result } from '@/shared/entities/result';

export class AddMessageToConversationUseCase implements AddMessageToConversation {
    constructor(
        private readonly conversationRepo: ConversationRepo
    ) { }

    async execute(
        message: ConversationMessage,
    ): Promise<Result<Conversation, string>> {
        const conversation = await this.conversationRepo.getById(message.conversationId);
        if (!conversation) {
            return nok('Conversation does not exist');
        }
        const updated = this.appendMessage(conversation, message);
        await this.conversationRepo.upsert(updated);
        return ok(updated);
    }

    private appendMessage(conversation: Conversation, message: ConversationMessage): Conversation {
        const previousMessage = this.lastMessage(conversation);
        const appendedMessage: ConversationMessage = { ...message, previousId: previousMessage?.id ?? null };
        return {...conversation, messages: [...conversation.messages, appendedMessage] };
    }

    private lastMessage(conversation: Conversation): Message | null {
        return (conversation.messages.length == 0) ? null : conversation.messages[conversation.messages.length - 1];
    }
}
