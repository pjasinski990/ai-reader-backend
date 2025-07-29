import { Logger } from '@/shared/ports/out/logger';

export class ConsoleLogger implements Logger {
    constructor(private readonly bindings: Record<string, unknown> = {}) {}

    private fmt(level: string, msg: string, meta?: unknown) {
        const ctx = Object.entries(this.bindings)
            .map(([k, v]) => `${k}=${v}`)
            .join(' ');
        const prefix = ctx ? `[${level}] ${ctx} —` : `[${level}]`;
        console.log(prefix, msg, meta ?? '');
    }

    trace = (m: string, meta?: unknown) => this.fmt('trace', m, meta);
    debug = (m: string, meta?: unknown) => this.fmt('debug', m, meta);
    info  = (m: string, meta?: unknown) => this.fmt('info', m, meta);
    warn  = (m: string, meta?: unknown) => this.fmt('warn', m, meta);
    error = (m: string, meta?: unknown) => this.fmt('error', m, meta);

    child = (extra: Record<string, unknown>): Logger =>
        new ConsoleLogger({ ...this.bindings, ...extra });
}
