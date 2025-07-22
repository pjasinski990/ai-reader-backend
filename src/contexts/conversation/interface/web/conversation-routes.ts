import { Router, Request } from 'express';
import { conversationController } from '@/contexts/conversation/interface/controllers/conversation-controller';
import { asyncWrapper } from '@/shared/utils/async-wrapper';
import { ValidationError } from '@/shared/entities/http-errors';
import { z } from 'zod';

export const conversationRoutes = Router();

const NewConversationRequestSchema = z.object({
    projectId: z.string(),
    userPrompt: z.string(),
});
type NewConversationRequest = z.infer<typeof NewConversationRequestSchema>;

conversationRoutes.get(
    '/search',
    asyncWrapper(async (req, res) => {
        const projectId = req.query.projectId;
        if (typeof projectId !== 'string') {
            throw new ValidationError('No projectId in querystring or projectId is invalid');
        }

        const result = await conversationController.getConversations(projectId);
        res.status(200).json(result);
    })
);

conversationRoutes.post(
    '/new',
    asyncWrapper(async (req, res) => {
        const data = parseNewConversationRequest(req);
        const conversation = await conversationController.startConversation(data.projectId, data.userPrompt);
        res.status(200).json(conversation);
    })
);

function parseNewConversationRequest(req: Request): NewConversationRequest {
    const parseResult = NewConversationRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
        throw new ValidationError('Invalid new conversation request', parseResult.error.flatten());
    }
    return parseResult.data;
}
