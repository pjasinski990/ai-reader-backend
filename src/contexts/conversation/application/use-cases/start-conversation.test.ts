import { afterEach, describe, expect, it } from 'vitest';
import { StartConversationUseCase } from './start-conversation';
import { InMemoryConversationRepo } from '@/contexts/conversation/infra/in-memory-conversation-repo';

describe('StartCourseConversationConcrete Use Case', () => {
    const mockConversationRepo = new InMemoryConversationRepo();
    const useCase = new StartConversationUseCase(mockConversationRepo);
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

    it('should link previous messages correctly', async () => {
        const created = await useCase.execute(projectId, 'course', 'I am a user and I want to learn something.');

        expect(created.messages.length).to.equal(2);
        expect(created.messages[0].previousId).to.equal(null);
        expect(created.messages[1].previousId).to.equal(created.messages[0].id);
    });
});
