import { v4 as uuidv4 } from 'uuid';
import { Summarizer } from '@/contexts/material/application/ports/out/summarizer';
import { LLMProvider } from '@/shared/ports/out/llm-provider';
import { Message, Role } from '@/shared/entities/message';
import { Summarizable, Summarized } from '@/contexts/material/entities/chunk';

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
