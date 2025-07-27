import { Conversation, Mode } from '@/contexts/conversation/entities/conversation';
import { AddMessageToConversation } from '@/contexts/conversation/application/ports/in/add-message-to-conversation';
import {
    AddMessageToConversationUseCase
} from '@/contexts/conversation/application/use-cases/add-message-to-conversation';
import { Message } from '@/shared/entities/message';
import { StartConversation } from '@/contexts/conversation/application/ports/in/start-conversation';
import { StartConversationUseCase } from '@/contexts/conversation/application/use-cases/start-conversation';
import { InMemoryConversationRepo } from '@/contexts/conversation/infra/in-memory-conversation-repo';
import { GetProjectConversations } from '@/contexts/conversation/application/ports/in/get-project-conversations';
import {
    GetProjectConversationsUseCase
} from '@/contexts/conversation/application/use-cases/get-project-conversations';
import { OpenAIProvider } from '@/shared/infra/llms/open-ai-provider';
import { Result } from '@/shared/entities/result';
import { StreamAssistantResponse } from '@/contexts/conversation/application/ports/in/stream-assistant-response';
import {
    StreamAssistantResponseUseCase
} from '@/contexts/conversation/application/use-cases/stream-assistant-response';

export class ConversationController {
    constructor(
        private readonly getProjectConversations: GetProjectConversations,
        private readonly startConversation: StartConversation,
        private readonly addMessageToConversation: AddMessageToConversation,
        private readonly streamAssistantResponse: StreamAssistantResponse,
    ) { }

    getConversations(projectId: string): Promise<Conversation[]> {
        return this.getProjectConversations.execute(projectId);
    }

    handleStartConversation(projectId: string, mode: Mode, initialUserPrompt: string): Promise<Conversation> {
        return this.startConversation.execute(projectId, mode, initialUserPrompt);
    }

    async handleNewMessage(newMessage: Message): Promise<Result<Conversation, string>> {
        return this.addMessageToConversation.execute(newMessage);
    }

    async handleGetAssistantResponse(conversationId: string): Promise<Result<AsyncGenerator<string, void, unknown>, string>> {
        return this.streamAssistantResponse.execute(conversationId);
    };
}

// TODO we need a module for envs
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) { throw new Error('No OPENAI_API_KEY provided'); }
const llmProvider = new OpenAIProvider(apiKey);
const conversationRepo = new InMemoryConversationRepo();

export const conversationController = new ConversationController(
    new GetProjectConversationsUseCase(conversationRepo),
    new StartConversationUseCase(conversationRepo),
    new AddMessageToConversationUseCase(conversationRepo),
    new StreamAssistantResponseUseCase(conversationRepo, llmProvider),
);
