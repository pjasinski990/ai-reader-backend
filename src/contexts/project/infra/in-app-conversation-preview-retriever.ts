import { ConversationPreview } from '@/contexts/project/entities/conversation-preview';
import { ConversationPreviewRetriever } from '@/contexts/project/application/ports/out/conversation-preview-retriever';
import { GetProjectConversations } from '@/contexts/conversation/application/ports/in/get-project-conversations';

export class InAppConversationPreviewRetriever implements ConversationPreviewRetriever {
    constructor(
        private readonly getConversations: GetProjectConversations,
    ) {}

    async execute(projectId: string): Promise<ConversationPreview[]> {
        const conversations = await this.getConversations.execute(projectId);
        return conversations.map(c => {
            return {
                id: c.id,
                title: c.title,
            };
        });
    }
}
