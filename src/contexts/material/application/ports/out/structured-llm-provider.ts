import { Message } from '@/shared/ports/out/llm-provider';

export type ValidateSchemaFn<T> = (value: unknown) => value is T; 

export interface ReturnSchema<T> {
    schemaDefinition: Record<string, unknown>;
    validateSchema: ValidateSchemaFn<T>;
}

export interface StructuredLLMProvider {
    structuredQuery<T>(conversation: Message[], returnSchema: ReturnSchema<T>, functionCallingArguments: FunctionCallingArguments): Promise<T>;
}

export interface FunctionCallingArguments {
    functionName: string;
    functionDescription: string;
}
