import { ConversationPreview } from '@/contexts/project/entities/conversation-preview';
import { ConversationPreviewRetriever } from '@/contexts/project/application/ports/out/conversation-preview-retriever';
import { GetConversations } from '@/contexts/conversation/application/ports/in/get-conversations';

export class InAppConversationPreviewRetriever implements ConversationPreviewRetriever {
    constructor(
        private readonly getConversations: GetConversations,
    ) {}

    async execute(ids: string[]): Promise<ConversationPreview[]> {
        const conversations = await this.getConversations.execute(ids);
        return conversations.map(c => {
            return {
                id: c.id,
                title: c.title,
            };
        });
    }
}
