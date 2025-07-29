export interface Message {
    id: string;
    previousId: string | null;
    role: Role
    content: string | string[];
}

export interface ConversationMessage extends Message {
    conversationId: string;
}

export enum Role {
    SYSTEM = 'SYSTEM',
    ASSISTANT = 'ASSISTANT',
    USER = 'USER',
}
