import { ConversationRepo } from '@/contexts/conversation/application/ports/out/conversation-repo';
import { Conversation } from '@/contexts/conversation/entities/conversation';

export class InMemoryConversationRepo implements ConversationRepo {
    private conversations: Conversation[] = [];

    getByIds(ids: string[]): Promise<Conversation[]> {
        return Promise.resolve(this.conversations.filter(c => ids.includes(c.id)));
    }
}
