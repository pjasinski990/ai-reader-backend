import { GetConversations } from '@/contexts/conversation/application/ports/in/get-conversations';
import { ConversationRepo } from '@/contexts/conversation/application/ports/out/conversation-repo';
import { Conversation } from '@/contexts/conversation/entities/conversation';

export class GetConversationsUseCase implements GetConversations {
    constructor(
        private readonly conversationRepo: ConversationRepo,
    ) { }

    execute(ids: string[]): Promise<Conversation[]> {
        return this.conversationRepo.getByIds(ids);
    }
}
