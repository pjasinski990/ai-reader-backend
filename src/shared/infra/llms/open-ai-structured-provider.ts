import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat/completions/completions';
import { FunctionCallingArguments, ReturnSchema, StructuredLLMProvider } from '@/contexts/material/application/ports/out/structured-llm-provider';
import { Message, Role } from '@/shared/ports/out/llm-provider';

export class OpenAIStructuredProvider implements StructuredLLMProvider {
    client: OpenAI;
    
    constructor(private readonly apiKey: string) {
        this.client = new OpenAI({ apiKey: this.apiKey });
    }

    async structuredQuery<T>(conversation: Message[], returnSchema: ReturnSchema<T>, functionCallingArguments: FunctionCallingArguments): Promise<T> {
        const parameters = {
            type: 'object',
            properties: { result: returnSchema.schemaDefinition },
            required: ['result'],
        } as const;

        const completion = await this.client.chat.completions.create({
            model: 'gpt-4.1-mini',
            response_format: { type: 'json_object' },
            messages: [
                {
                    role: 'system',
                    content:
                    'You are a strict JSON-only API. ' +
                    'Return **only** JSON matching the function schema. ' +
                    'Do NOT quote entire objects or arrays.'
                },
                ...this.getSystemNote(conversation),
                ...this.getUserPrompt(conversation)
            ],
            tools: [
                {
                    type: 'function',
                    function: {
                        name: functionCallingArguments.functionName,
                        description: functionCallingArguments.functionDescription,
                        parameters,
                    },
                },
            ],
            tool_choice: { type: 'function', function: { name: functionCallingArguments.functionName } },
        });

        const msg = completion.choices[0].message;
        const call = msg.tool_calls?.[0];
        if (!call) {
            throw new Error(`Model replied without calling the ${functionCallingArguments.functionName} tool`);
        }
        const { result } = JSON.parse(call.function.arguments);

        if (returnSchema.validateSchema(result)) {
            return result;
        }
        throw new Error('Invalid schema returned from OpenAI Structured Provider');
    }

    private getSystemNote(conversation: Message[]) {
        return conversation.filter(msg => msg.role === Role.SYSTEM).map(this.messageToOpenAI);
    }

    private getUserPrompt(conversation: Message[]) {
        return conversation.filter(msg => msg.role === Role.USER).map(this.messageToOpenAI);
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
}
