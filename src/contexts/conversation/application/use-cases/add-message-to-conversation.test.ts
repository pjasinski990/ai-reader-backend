import { beforeEach, describe, expect, it } from 'vitest';
import { AddMessageToConversationUseCase } from '@/contexts/conversation/application/use-cases/add-message-to-conversation';
import { Role } from '@/shared/entities/message';
import { Conversation } from '@/contexts/conversation/entities/conversation';
import { MockConversation } from '@/contexts/conversation/infra/testing/mock-conversation';

describe('add user message to chat use case', () => {
    let useCase: AddMessageToConversationUseCase;

    beforeEach(() => {
        useCase = new AddMessageToConversationUseCase();
    });

    for (const role of [Role.USER, Role.ASSISTANT]) {
        it(`should return conversation with added ${role} message`, async () => {
            const ogConv: Conversation = new MockConversation().build();
            const newMessage = 'i\'ve seen things you people wouldn\'t believe';

            const newConv = await useCase.execute(ogConv, newMessage, role);

            const addedMessage = newConv.messages.at(-1);
            expect(newConv.messages.length).to.equal(ogConv.messages.length + 1);
            expect(addedMessage).toBeDefined();
            expect(addedMessage!.content).to.equal(newMessage);
            expect(addedMessage!.role).to.equal(role);
            expect(addedMessage!.previousId).to.equal(ogConv.messages.at(-1)?.id);
        });
    }
});
