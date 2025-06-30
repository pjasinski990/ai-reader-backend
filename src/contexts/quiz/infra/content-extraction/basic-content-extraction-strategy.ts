import { ContentExtractionStrategy, ContentExtractionContext } from '../../application/ports/out/content-extraction-strategy';
import { MaterialRepo } from '@/contexts/material/application/ports/out/material-repo';

export class BasicContentExtractionStrategy implements ContentExtractionStrategy {
    async extractContent(
        context: ContentExtractionContext,
        materialRepo: MaterialRepo
    ): Promise<string> {
        const materials = await materialRepo.getByIds(context.materialIds);
        
        const content = materials
            .map(material => `Material: ${material.title}\n${material.content.type === 'text' ? material.content.text : ''}`)
            .join('\n\n');

        return this.enhanceWithOptions(content, context);
    }

    private enhanceWithOptions(content: string, context: ContentExtractionContext): string {
        const extractionPrompt = context.options?.extractionPrompt as string;
        const topicFocus = context.options?.topicFocus as string[];

        let result = content;
        if (extractionPrompt) result = `Extraction Focus: ${extractionPrompt}\n\n${result}`;
        if (topicFocus?.length) result = `Topics to emphasize: ${topicFocus.join(', ')}\n\n${result}`;
        
        return result;
    }
} 