import { Conversation } from '@/contexts/conversation/entities/conversation';
import { AddMessageToConversation } from '@/contexts/conversation/application/ports/in/add-message-to-conversation';
import { AddMessageToConversationUseCase } from '@/contexts/conversation/application/use-cases/add-message-to-conversation';
import { Role } from '@/shared/entities/message';
import { StartConversation } from '@/contexts/conversation/application/ports/in/start-conversation';
import { StartConversationUseCase } from '@/contexts/conversation/application/use-cases/start-conversation';
import { MockLLMProvider } from '@/shared/infra/llms/mock-llm-provider';
import { InMemoryConversationRepo } from '@/contexts/conversation/infra/in-memory-conversation-repo';
import { GetProjectConversations } from '@/contexts/conversation/application/ports/in/get-project-conversations';
import {
    GetProjectConversationsUseCase
} from '@/contexts/conversation/application/use-cases/get-project-conversations';

export class ConversationController {
    constructor(
        private readonly getProjectConversations: GetProjectConversations,
        private readonly startNewConversation: StartConversation,
        private readonly addMessageToConversation: AddMessageToConversation
    ) { }

    getConversations(projectId: string): Promise<Conversation[]> {
        return this.getProjectConversations.execute(projectId);
    }

    startConversation(projectId: string, initialUserPrompt: string): Promise<Conversation> {
        return this.startNewConversation.execute(projectId, 'explain', initialUserPrompt);
    }

    async addUserMessage(conversation: Conversation, newMessage: string) {
        await this.addMessageToConversation.execute(conversation, newMessage, Role.USER);
    }

    // TODO
    // async handleUpdateUserMessage(conversation: Conversation, updatedMessageId: string, newMessageContent: string) {
    //     await this.forkConversation(conversation, updatedMessageId, newMessageContent);
    // }

    streamAssistantResponse = (conversation: Conversation): AsyncGenerator<string, void, unknown> => {
        // TODO move to use case
        return llmProvider.streamQuery(conversation.messages);
    };
}

const llmProvider = new MockLLMProvider();
const conversationRepo = new InMemoryConversationRepo();

export const conversationController = new ConversationController(
    new GetProjectConversationsUseCase(conversationRepo),
    new StartConversationUseCase(llmProvider, conversationRepo),
    new AddMessageToConversationUseCase(),
);
