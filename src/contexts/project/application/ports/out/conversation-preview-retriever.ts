import { ConversationPreview } from '@/contexts/project/entities/conversation-preview';

export interface ConversationPreviewRetriever {
    execute(ids: string[]): Promise<ConversationPreview[]>;
}
