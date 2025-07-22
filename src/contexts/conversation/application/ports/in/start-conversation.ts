import { Conversation, Mode } from '@/contexts/conversation/entities/conversation';

export interface StartConversation {
    execute(
        projectId: string,
        conversationMode: Mode,
        initialUserPrompt: string,
    ): Promise<Conversation>;
}
