import { v4 as uuidv4 } from 'uuid';
import { StartConversation } from '@/contexts/conversation/application/ports/in/start-conversation';
import { LLMProvider } from '@/shared/ports/out/llm-provider';
import { ConversationRepo } from '@/contexts/conversation/application/ports/out/conversation-repo';
import { Message, Role } from '@/shared/entities/message';
import { Conversation, Mode } from '@/contexts/conversation/entities/conversation';

export class StartConversationUseCase implements StartConversation {
    constructor(
        private readonly llmProvider: LLMProvider,
        private readonly conversationRepo: ConversationRepo,
    ) { }

    async execute(
        projectId: string,
        mode: Mode,
        initialUserPrompt: string,
    ) {
        const newConversation = generateConversation(projectId, mode, initialUserPrompt);
        const llmResponse = await this.llmProvider.query(newConversation.messages);
        const newMessage: Message = {
            id: uuidv4(),
            previousId: newConversation.messages.at(-1)!.id,
            role: Role.ASSISTANT,
            content: llmResponse,
        };
        newConversation.messages.push(newMessage);

        await this.conversationRepo.upsert(newConversation);
        return newConversation;
    }
}

function generateConversation(
    projectId: string,
    mode: Mode,
    initialUserPrompt: string,
): Conversation {
    const systemMessage = generateSystemMessage();
    const initialUserMessage = generateUserMessage(systemMessage.id, initialUserPrompt);
    const title = generateConversationTitle();
    return {
        id: uuidv4(),
        projectId,
        title,
        mode,
        messages: [systemMessage, initialUserMessage],
    };
}

function generateSystemMessage(): Message {
    return {
        id: uuidv4(),
        role: Role.SYSTEM,
        previousId: null,
        content: getSystemPrompt(),
    };
}

function generateUserMessage(previousId: string, userPrompt: string): Message {
    return {
        id: uuidv4(),
        role: Role.USER,
        previousId,
        content: userPrompt,
    };
}

function getSystemPrompt() {
    return  `You are a teacher responsible for explaining concepts to the user.
    Base your answers on the materials that will be included in the conversation. You can begin now.`;
}

function generateConversationTitle() {
    return 'New conversation';
}
