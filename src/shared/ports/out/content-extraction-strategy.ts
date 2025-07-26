export interface ContentExtractionContext {
    projId: string;
    query?: Record<string, unknown>;
}

export interface ContentExtractionStrategy {
    extractContent(
        context: ContentExtractionContext,
    ): Promise<string>;
}
