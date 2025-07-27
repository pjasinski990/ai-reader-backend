import { StreamAssistantResponse } from '@/contexts/conversation/application/ports/in/stream-assistant-response';
import { ConversationRepo } from '@/contexts/conversation/application/ports/out/conversation-repo';
import { nok, ok, Result } from '@/shared/entities/result';
import { LLMProvider } from '@/shared/ports/out/llm-provider';

export class StreamAssistantResponseUseCase implements StreamAssistantResponse {
    constructor(
        private readonly conversationRepo: ConversationRepo,
        private readonly llmProvider: LLMProvider,
    ) { }

    async execute(conversationId: string): Promise<Result<AsyncGenerator<string, void, unknown>, string>> {
        const conversation = await this.conversationRepo.getById(conversationId);
        if (!conversation) {
            return nok('Conversation not found');
        }
        const generator = this.llmProvider.streamQuery(conversation.messages);
        return ok(generator);
    }
}
