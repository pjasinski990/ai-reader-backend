import { v4 as uuidv4 } from 'uuid';
import { Random } from '@/shared/infra/mocks/random';
import { Message, Role } from '@/shared/ports/out/llm-provider';

export class MockMessage {
    private id: string | null = null;
    private role: Role | null = null;
    private previousId: string | null = null;
    private content: string | null = null;

    withId(id: string) {
        this.id = id;
        return this;
    }
    withRole(role: Role) {
        this.role = role;
        return this;
    }
    withPreviousId(previousId: string | null) {
        this.previousId = previousId;
        return this;
    }
    withContent(content: string) {
        this.content = content;
        return this;
    }

    build(): Message {
        return {
            id: this.id ?? RandomMessage.id(),
            role: this.role ?? RandomMessage.role(),
            previousId: this.previousId,
            content: this.content ?? RandomMessage.content(),
        };
    }
}

export class RandomMessage {
    static id(): string {
        return uuidv4();
    }

    static role(): Role {
        return Random.pick([Role.ASSISTANT, Role.SYSTEM, Role.USER]);
    }

    static content(): string {
        return this.getCompositeResponse();
    }

    static generate(): Message {
        return {
            id: this.id(),
            role: this.role(),
            previousId: null,
            content: this.content(),
        };
    }

    static generateMany(n: number) {
        return Array.from({ length: n }, () => this.generate());
    }

    static generateSequence(n: number) {
        if (n <= 0) return [];
        const messages: Message[] = [];
        let previousId: string | null = null;
        for (let i = 0; i < n; i++) {
            const msg: Message = {...this.generate(), previousId};
            messages.push(msg);
            previousId = msg.id;
        }
        return messages;
    }

    private static getCompositeResponse(): string {
        const openers = [
            "Absolutely! Let's",
            'Mocking LLM responses can be tricky -',
            'When simulating LLMs, one common pitfall is',
            "For robust tests, it's useful to",
            'Interesting point! In a typical mock implementation,',
            'Good catch — sometimes, developers forget to',
            'Pro tip for test coverage:',
            'You might want to consider',
            'Quick tip:',
            'Fun fact about LLM mocking:',
        ];

        const middles = [
            'ensure deterministic outputs by seeding your random generator.',
            'return different results for repeated queries to test retry logic.',
            'simulate latency to mimic real-world conditions.',
            'include subtle errors or hallucinations in mock outputs.',
            'vary the response length to catch UI edge cases.',
            'track each request for later assertions.',
            'mimic streaming responses, not just static ones.',
            'assert that roles and IDs are handled as in production.',
            'test for interruption and resume in conversation history.',
        ];

        const closers = [
            'This makes your tests much closer to production reality.',
            'It helps uncover bugs that only appear with real LLM behavior.',
            'This approach saves time when debugging flaky tests.',
            "It's an easy win for catching silent failures.",
            'Highly recommended for CI pipelines.',
            "I've seen this catch lots of subtle issues.",
            'You can automate this pattern with a utility function.',
            'It’s always good to have some randomness for coverage.',
            "Don't forget to document your mock behavior for your team.",
        ];

        return [
            Random.pick(openers),
            Random.pick(middles),
            Random.pick(closers)
        ].join(' ');
    }
}
