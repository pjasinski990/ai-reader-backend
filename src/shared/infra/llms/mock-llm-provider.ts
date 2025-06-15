import { LLMProvider, Message, Role } from '@/shared/ports/out/llm-provider';
import { MockMessage, RandomMessage } from '@/shared/infra/mocks/mock-message';
import { Random } from '@/shared/infra/mocks/random';

export class MockLLMProvider implements LLMProvider {
    async *streamQuery(conversation: Message[]): AsyncGenerator<string, void, unknown> {
        const lastMessage = conversation[conversation.length - 1];
        const newMessage = new MockMessage()
            .withRole(Role.ASSISTANT)
            .withPreviousId(lastMessage.id)
            .build();

        const content = Array.isArray(newMessage.content) ? newMessage.content.join(' ') : newMessage.content;
        const streamedChunks = this.chunkWords(content);
        for (const chunk of streamedChunks) {
            yield chunk;
            await new Promise(res => setTimeout(res, Random.int(400, 1000)));
        }
    }

    query(conversation: Message[]): Promise<string> {
        void conversation;
        return new Promise(
            resolve => setTimeout(
                ()=> resolve(RandomMessage.content()),
                1000
            )
        );
    }

    chunkWords(text: string, size = 4): string[] {
        const words = text.trim().split(/\s+/);
        const chunks: string[] = [];

        for (let i = 0; i < words.length; i += size) {
            chunks.push(words.slice(i, i + size).join(' ') + ' ');
        }
        return chunks;
    }
}
