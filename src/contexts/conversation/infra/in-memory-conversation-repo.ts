import { ConversationRepo } from '@/contexts/conversation/application/ports/out/conversation-repo';
import { Conversation } from '@/contexts/conversation/entities/conversation';

export class InMemoryConversationRepo implements ConversationRepo {
    private conversations: Conversation[] = [];

    async upsert(conversation: Conversation): Promise<Conversation> {
        const idx = this.conversations.findIndex(c => c.id === conversation.id);
        if (idx !== -1) {
            this.conversations[idx] = conversation;
        } else {
            this.conversations.push(conversation);
        }
        return conversation;
    }

    async getByProjectId(projectId: string): Promise<Conversation[]> {
        return this.conversations.filter(c => c.projectId === projectId);
    }

    async getAll(): Promise<Conversation[]> {
        return this.conversations;
    }

    async getByIds(ids: string[]): Promise<Conversation[]> {
        return this.conversations.filter(c => ids.includes(c.id));
    }

    async clear() {
        this.conversations = [];
    }
}
