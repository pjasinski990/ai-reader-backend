import { LLMProvider, Message, Role } from '@/shared/ports/out/llm-provider';
import { OpenAI } from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions/completions';
import { LLMHttpError } from '@/shared/entities/llm-http-error';
import { LLMQueryError } from '@/shared/entities/llm-query-error';

export class OpenAIProvider implements LLMProvider {
    client: OpenAI;

    constructor(private readonly apiKey: string) {
        this.client = new OpenAI({ apiKey: this.apiKey });
    }

    query = async (conversation: Message[]): Promise<string> => {
        try {
            return await this.generateCompletion(conversation);
        } catch (error) {
            this.handleCompletionError(error);
        }
    };

    streamQuery = (conversation: Message[]): AsyncGenerator<string, void, unknown> => {
        try {
            return this.generateStreamingCompletion(conversation);
        } catch (error) {
            this.handleCompletionError(error);
        }
    };

    private generateCompletion = async (conversation: Message[]): Promise<string> => {
        const completion = await this.client.chat.completions.create({
            model: 'gpt-4.1',
            messages: conversation.map(this.messageToOpenAI),
        });
        const completionString = completion.choices[0]?.message?.content;
        if (!completionString || completionString === '') {
            throw new LLMQueryError('Did not receive response from OpenAI');
        }
        return completionString;
    };

    private async *generateStreamingCompletion(conversation: Message[], batchSize = 20) {
        const stream = await this.client.chat.completions.create({
            model: 'gpt-4.1',
            messages: conversation.map(this.messageToOpenAI),
            stream: true,
        });

        let buffer = '';
        let tokenCount = 0;

        for await (const part of stream) {
            const content = part.choices?.[0]?.delta?.content;
            if (content) {
                buffer += content;
                tokenCount += 1;
                if (tokenCount >= batchSize) {
                    yield buffer;
                    buffer = '';
                    tokenCount = 0;
                }
            }
        }

        if (buffer.length > 0) {
            yield buffer;
        }
    }

    private messageToOpenAI(message: Message): ChatCompletionMessageParam {
        if (Array.isArray(message.content)) {
            throw Error('Message should not be chunked in this context');
        }
        switch (message.role) {
            case Role.SYSTEM:
                return {
                    role: 'system',
                    content: message.content,
                };
            case Role.ASSISTANT:
                return {
                    role: 'assistant',
                    content: message.content,
                };
            case Role.USER:
                return {
                    role: 'user',
                    content: message.content,
                };
            default:
                throw new Error('Should not be here');
        }
    }

    private handleCompletionError(error: unknown): never {
        if (error instanceof OpenAI.APIError) {
            throw new LLMHttpError(
                `Error generating OpenAI completion: ${error.message}`,
                error.status,
            );
        } else if (error instanceof Error) {
            throw new LLMQueryError(`Error generating OpenAI completion: ${error.message}`);
        } else {
            throw new LLMQueryError(`Unexpected error generating OpenAI completion: ${String(error)}`);
        }
    }
}
