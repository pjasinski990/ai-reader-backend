import { Summarizer } from '@/shared/ports/out/summarizer';
import { Summarizable, Summarized } from '@/shared/entities/chunk';
import { LLMProvider, Message, Role } from '@/shared/application/ports/out/llm-provider';
import { v4 as uuidv4 } from 'uuid';

export class LLMSummarizer implements Summarizer {
    constructor(private readonly llm: LLMProvider) { }

    summarize<T extends Summarizable>(chunks: T[], summaryWords: number = 80): Promise<(T & Summarized)[]> {
        return Promise.all(chunks.map(chunk => {
            return this.summarizeOne(chunk, summaryWords);
        })
        );
    }

    async summarizeOne<T extends Summarizable>(chunk: T, summaryWords: number = 80): Promise<T & Summarized> {
        const summary = await this.llm.query([this.getLLMMessage(chunk.text, summaryWords)]);
        return {...chunk, summary};
    }

    private getLLMMessage(toSummarize: string, summaryWords: number): Message {
        return {
            id: uuidv4(),
            previousId: null,
            role: Role.SYSTEM,
            content: this.getSummarizePrompt(toSummarize, summaryWords),
        };
    }

    private getSummarizePrompt(toSummarize: string, summaryWordLength: number) {
        return `Summarize the following text in about ${summaryWordLength} words. 
        Make sure to include all important concepts from the source. 
        Output only the summary, nothing else. 
        The text to summarize is: \n\n${toSummarize}`;
    }
}
