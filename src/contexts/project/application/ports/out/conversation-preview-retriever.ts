import { ConversationPreview } from '@/contexts/project/entities/conversation-preview';

export interface ConversationPreviewRetriever {
    execute(projectId: string): Promise<ConversationPreview[]>;
}
