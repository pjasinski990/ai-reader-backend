import { afterEach, describe, expect, it } from 'vitest';
import { StartConversationUseCase } from './start-conversation';
import { MockLLMProvider } from '@/shared/infra/llms/mock-llm-provider';
import { InMemoryConversationRepo } from '@/contexts/conversation/infra/in-memory-conversation-repo';
import { Role } from '@/shared/entities/message';

describe('StartCourseConversationConcrete Use Case', () => {
    const mockLLMProvider = new MockLLMProvider();
    const mockConversationRepo = new InMemoryConversationRepo();
    const useCase = new StartConversationUseCase(mockLLMProvider, mockConversationRepo);
    const projectId = 'some-project-id';

    afterEach(() => {
        mockConversationRepo.clear();
    });

    it('should generate a new conversation', async () => {
        const created = await useCase.execute(projectId, 'course', 'I am a user and I want to learn something.');

        const conversations = await mockConversationRepo.getAll();
        expect(conversations.length).to.equal(1);
        expect(conversations[0]).to.equal(created);
        expect(conversations[0].projectId).to.equal(projectId);
    });

    it('should respond to initial user message', async () => {
        const created = await useCase.execute(projectId, 'course', 'I am a user and I want to learn something.');

        expect(created.messages.length).to.equal(3);
        expect(created.messages[0].role).to.equal(Role.SYSTEM);
        expect(created.messages[1].role).to.equal(Role.USER);
        expect(created.messages[2].role).to.equal(Role.ASSISTANT);
    });

    it('should link previous messages correctly', async () => {
        const created = await useCase.execute(projectId, 'course', 'I am a user and I want to learn something.');

        expect(created.messages.length).to.equal(3);
        expect(created.messages[0].previousId).to.equal(null);
        expect(created.messages[1].previousId).to.equal(created.messages[0].id);
        expect(created.messages[2].previousId).to.equal(created.messages[1].id);
    });
});
