import { v4 as uuidv4 } from 'uuid';
import { Message } from '@/shared/entities/message';
import { Conversation, Mode } from '@/contexts/conversation/entities/conversation';
import { Random } from '@/shared/infra/testing/random';
import { RandomMessage } from '@/shared/infra/testing/mock-message';

export class MockConversation {
    private id: string | null = null;
    private projectId: string | null = null;
    private title: string | null = null;
    private mode: Mode | null = null;
    private messages: Message[] | null = null;

    withId(id: string) {
        this.id = id;
        return this;
    }
    withProjectId(projectId: string) {
        this.projectId = projectId;
        return this;
    }
    withTitle(title: string) {
        this.title = title;
        return this;
    }
    withMessages(messages: Message[]) {
        this.messages = messages;
        return this;
    }
    withMode(mode: Mode) {
        this.mode = mode;
        return this;
    }

    build(): Conversation {
        return {
            id: this.id ?? RandomConversation.id(),
            projectId: this.projectId ?? RandomConversation.id(),
            title: this.title ?? RandomConversation.title(),
            messages: this.messages ?? RandomConversation.messages(),
            mode: this.mode ?? RandomConversation.mode(),
        };
    }
}

export class RandomConversation {
    static title(): string {
        const adjective = Random.pick(['Cool', 'Fun', 'Awesome', 'Informative']);
        const topic = Random.pick(['computers', 'birds', 'colors', 'unbearable heaviness of great amounts of wasted cycles']);
        return [adjective, 'conversation about', topic].join(' ');
    }

    static id(): string {
        return uuidv4();
    }

    static messages(): Message[] {
        const count = Random.int();
        return RandomMessage.generateSequence(count);
    }

    static mode(): Mode {
        return Random.pick(['course', 'explain', 'quiz']);
    }
}
