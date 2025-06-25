export interface Message {
    id: string;
    role: Role
    previousId: string | null;
    content: string | string[];
}

export enum Role {
    SYSTEM = 'SYSTEM',
    ASSISTANT = 'ASSISTANT',
    USER = 'USER',
}
