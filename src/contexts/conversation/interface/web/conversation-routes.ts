import { Request, Response, Router } from 'express';
import { conversationController } from '@/contexts/conversation/interface/controllers/conversation-controller';
import { asyncWrapper } from '@/shared/utils/async-wrapper';
import { ValidationError } from '@/shared/entities/http-errors';
import { logger } from '@/shared/interface/controllers/logging-controller';
import {
    NewConversationRequest,
    NewConversationRequestSchema
} from '@/contexts/conversation/interface/web/new-conversation-request';
import {
    StreamConversationRequest,
    StreamConversationRequestSchema
} from '@/contexts/conversation/interface/web/stream-conversation-request';
import { NewMessageRequest, NewMessageRequestSchema } from '@/contexts/conversation/interface/web/new-message-request';

export const conversationRoutes = Router();

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
        const conversation = await conversationController.handleStartConversation(data.projectId, data.mode, data.initialPrompt);
        res.status(200).json(conversation);
    })
);

conversationRoutes.post(
    '/message',
    asyncWrapper(async (req, res) => {
        const data = parseNewMessageRequest(req);
        const result = await conversationController.handleNewMessage(data.message);
        if (!result.ok) {
            throw new ValidationError(result.error);
        }
        res.status(200).json(result.value);
    })
);


conversationRoutes.post(
    '/stream',
    asyncWrapper(async (req, res) => {
        const data = parseStreamConversationRequest(req);
        const result = await conversationController.handleGetAssistantResponse(data.conversationId);
        if (!result.ok) {
            throw new ValidationError(result.error);
        }
        const generator = result.value;
        await streamResponse(req, res, generator);
    })
);

function parseNewConversationRequest(req: Request): NewConversationRequest {
    const parseResult = NewConversationRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
        const message = 'Invalid new conversation request';
        const data = parseResult.error.flatten();
        logger.error(message, data);
        throw new ValidationError(message, data);
    }
    return parseResult.data;
}

function parseStreamConversationRequest(req: Request): StreamConversationRequest {
    const parseResult = StreamConversationRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
        const message = 'Invalid stream conversation request';
        const data = parseResult.error.flatten();
        logger.error(message, data);
        throw new ValidationError(message, data);
    }
    return parseResult.data;
}

function parseNewMessageRequest(req: Request): NewMessageRequest {
    const parseResult = NewMessageRequestSchema.safeParse(req.body);
    if (!parseResult.success) {
        const message = 'Invalid new message request';
        const data = parseResult.error.flatten();
        logger.error(message, data);
        throw new ValidationError(message, data);
    }
    return parseResult.data;
}

async function streamResponse(req: Request, res: Response, generator: AsyncGenerator<string, void, unknown>) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.flushHeaders();

    let clientClosed = false;
    req.on('close', () => {
        clientClosed = true;
        if (generator.return) void generator.return();
    });

    try {
        for await (const chunk of generator) {
            if (clientClosed) break;
            res.write(JSON.stringify({chunk: chunk}) + '\n');
        }
    } catch (err) {
        logger.error('Stream error:', err);
        if (!clientClosed) {
            res.write(
                JSON.stringify({ error: 'stream_error', detail: 'Generator failed' }) +
                '\n'
            );
        }
    } finally {
        if (!clientClosed) res.end();
    }
}
