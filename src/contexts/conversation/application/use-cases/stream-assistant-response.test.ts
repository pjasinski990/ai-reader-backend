import { afterEach, describe, expect, it } from 'vitest';
import { InMemoryConversationRepo } from '@/contexts/conversation/infra/in-memory-conversation-repo';
import {
    StreamAssistantResponseUseCase
} from '@/contexts/conversation/application/use-cases/stream-assistant-response';
import { MockLLMProvider } from '@/shared/infra/llms/mock-llm-provider';
import { MockConversation } from '@/contexts/conversation/infra/testing/mock-conversation';
import { expectResultError, expectResultOk } from '@/shared/infra/testing/assertions';

describe('StreamAssistantResponse Use Case', () => {
    const mockConversationRepo = new InMemoryConversationRepo();
    const mockLLM = new MockLLMProvider();
    const useCase = new StreamAssistantResponseUseCase(mockConversationRepo, mockLLM);

    afterEach(() => {
        mockConversationRepo.clear();
    });

    it('should stream a response', async () => {
        const conversation = new MockConversation().build();
        await mockConversationRepo.upsert(conversation);

        const result = await useCase.execute(conversation.id);

        expectResultOk<AsyncGenerator<string, void, unknown>>(result);
        const generator = result.value;
        const firstChunk = await generator.next();
        expect(firstChunk.value).not.toBe(null);
    });

    it('should stream the message and end', async () => {
        const conversation = new MockConversation().build();
        await mockConversationRepo.upsert(conversation);

        const result = await useCase.execute(conversation.id);
        expectResultOk<AsyncGenerator<string, void, unknown>>(result);

        for await (const data of result.value) { void data; }
        const next = await result.value.next();
        expect(next.done).toBe(true);
    });

    it('should fail on missing conversation', async () => {
        const result = await useCase.execute('missing-conversation');

        expectResultError<string>(result);
        expect(result.error).to.equal('Conversation not found');
    });
});
