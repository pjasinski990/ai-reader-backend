import { MaterialRepo } from '@/contexts/material/application/ports/out/material-repo';
import { ContentExtractionContext, ContentExtractionStrategy } from '@/shared/ports/out/content-extraction-strategy';

export class BasicContentExtractionStrategy implements ContentExtractionStrategy {
    constructor(
        private readonly materialRepo: MaterialRepo
    ) {}

    async extractContent(
        _context: ContentExtractionContext,
    ): Promise<string> {
        // TODO select only relevant for project
        const materials = await this.materialRepo.getAll();
        
        const content = materials
            .map(material => `Material: ${material.title}\n${material.content.type === 'text' ? material.content.text : ''}`)
            .join('\n\n');

        return content;
    }
} 
