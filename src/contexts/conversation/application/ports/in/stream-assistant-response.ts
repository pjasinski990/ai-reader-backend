import { Result } from '@/shared/entities/result';

export interface StreamAssistantResponse {
    execute(
        conversationId: string
    ): Promise<Result<AsyncGenerator<string, void, unknown>, string>>;
}
