export interface Logger {
    trace(msg: string, meta?: unknown): void;
    debug(msg: string, meta?: unknown): void;
    info (msg: string, meta?: unknown): void;
    warn (msg: string, meta?: unknown): void;
    error(msg: string, meta?: unknown): void;

    child(bindings: Record<string, unknown>): Logger;
}
