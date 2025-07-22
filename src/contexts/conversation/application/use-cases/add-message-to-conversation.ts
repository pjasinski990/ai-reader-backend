import { v4 as uuidv4 } from 'uuid';
import { AddMessageToConversation } from '@/contexts/conversation/application/ports/in/add-message-to-conversation';
import { Conversation } from '@/contexts/conversation/entities/conversation';
import { Message, Role } from '@/shared/entities/message';

export class AddMessageToConversationUseCase implements AddMessageToConversation {
    async execute(
        conversation: Conversation,
        message: string,
        role: Role,
        id?: string,
    ): Promise<Conversation> {
        const newMessage = {
            id: id ?? uuidv4(),
            role: role,
            content: message,
            previousId: null,
        };
        return this.appendMessage(conversation, newMessage);
    }

    private appendMessage(conversation: Conversation, message: Message): Conversation {
        const previousMessage = this.lastMessage(conversation);
        const appendedMessage: Message = { ...message, previousId: previousMessage?.id ?? null };
        return {...conversation, messages: [...conversation.messages, appendedMessage] };
    }

    private lastMessage(conversation: Conversation): Message | null {
        return (conversation.messages.length == 0) ? null : conversation.messages[conversation.messages.length - 1];
    }
}
