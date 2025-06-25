export type ContentType = 'text' | 'image' | 'audio' | 'video';

export interface MaterialPreview {
    id: string;
    title: string;
    type: ContentType;
}
