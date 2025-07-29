import { beforeEach, describe, expect, it } from 'vitest';
import { AddMessageToConversationUseCase } from '@/contexts/conversation/application/use-cases/add-message-to-conversation';
import { Role } from '@/shared/entities/message';
import { Conversation } from '@/contexts/conversation/entities/conversation';
import { MockConversation } from '@/contexts/conversation/infra/testing/mock-conversation';
import { InMemoryConversationRepo } from '@/contexts/conversation/infra/in-memory-conversation-repo';
import { ConversationRepo } from '@/contexts/conversation/application/ports/out/conversation-repo';
import { MockMessage } from '@/shared/infra/testing/mock-message';
import { expectResultOk } from '@/shared/infra/testing/assertions';

describe('add user message to chat use case', () => {
    let conversationRepo: ConversationRepo;
    let useCase: AddMessageToConversationUseCase;

    beforeEach(() => {
        conversationRepo = new InMemoryConversationRepo();
        useCase = new AddMessageToConversationUseCase(conversationRepo);
    });

    for (const role of [Role.USER, Role.ASSISTANT]) {
        it(`should return conversation with added ${role} message`, async () => {
            const ogConv: Conversation = new MockConversation().build();
            const newMessage = new MockMessage().withRole(role).build();
            const newConvMessage = { ...newMessage, conversationId: ogConv.id };
            await conversationRepo.upsert(ogConv);

            const newConv = await useCase.execute(newConvMessage);

            expectResultOk<Conversation>(newConv);

            const messages = newConv.value.messages;
            const addedMessage = messages.at(-1);
            expect(messages.length).to.equal(ogConv.messages.length + 1);
            expect(addedMessage).toBeDefined();
            expect(addedMessage!.content).to.equal(newMessage.content);
            expect(addedMessage!.role).to.equal(role);
            expect(addedMessage!.previousId).to.equal(ogConv.messages.at(-1)?.id);
        });
    }
});
