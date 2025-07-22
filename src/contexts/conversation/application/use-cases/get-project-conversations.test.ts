import { afterEach, describe, it, expect } from 'vitest';
import { InMemoryConversationRepo } from '@/contexts/conversation/infra/in-memory-conversation-repo';
import {
    GetProjectConversationsUseCase
} from '@/contexts/conversation/application/use-cases/get-project-conversations';
import { MockConversation } from '@/contexts/conversation/infra/testing/mock-conversation';

describe('get-project-conversations use case', () => {
    const mockConversationRepo = new InMemoryConversationRepo();
    const useCase = new GetProjectConversationsUseCase(mockConversationRepo);
    const projectId = 'some-project-id';

    afterEach(() => {
        mockConversationRepo.clear();
    });

    it('should retrieve all conversations for a given projectId', async () => {
        const conversations = Array.from({ length: 10 }, () => new MockConversation().withProjectId(projectId).build());
        const otherConversations = Array.from({ length: 10 }, () => new MockConversation().withProjectId('other-project-id').build());
        const promises = conversations.concat(otherConversations).map(c => mockConversationRepo.upsert(c));
        await Promise.all(promises);

        const result = await useCase.execute(projectId);

        expect(result).to.deep.equal(conversations);
    });

    it('should return empty list for no results', async () => {
        const conversations = Array.from({ length: 10 }, () => new MockConversation().build());
        const promises = conversations.map(c => mockConversationRepo.upsert(c));
        await Promise.all(promises);

        const result = await useCase.execute('some-other-project');

        expect(result).to.deep.equal([]);
    });
});
