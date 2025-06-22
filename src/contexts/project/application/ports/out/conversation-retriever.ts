import { ConversationPreview } from '@/contexts/project/entities/conversation-preview';

export interface ConversationRetriever {
    execute(ids: string[]): Promise<ConversationPreview[]>
}
