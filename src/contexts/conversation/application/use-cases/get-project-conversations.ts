import { GetProjectConversations } from '@/contexts/conversation/application/ports/in/get-project-conversations';
import { ConversationRepo } from '@/contexts/conversation/application/ports/out/conversation-repo';
import { Conversation } from '@/contexts/conversation/entities/conversation';

export class GetProjectConversationsUseCase implements GetProjectConversations {
    constructor(
        private readonly conversationRepo: ConversationRepo,
    ) { }

    execute(projectId: string): Promise<Conversation[]> {
        return this.conversationRepo.getByProjectId(projectId);
    }
}
