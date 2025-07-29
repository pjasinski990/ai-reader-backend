import pino, { Logger as Pino } from 'pino';
import { Logger } from '@/shared/ports/out/logger';

export class PinoLogger implements Logger {
    constructor(private readonly instance: Pino) {}

    static create(opts?: pino.LoggerOptions): PinoLogger {
        return new PinoLogger(pino(opts));
    }

    trace = (m: string, meta?: unknown) => this.instance.trace(meta, m);
    debug = (m: string, meta?: unknown) => this.instance.debug(meta, m);
    info  = (m: string, meta?: unknown) => this.instance.info(meta, m);
    warn  = (m: string, meta?: unknown) => this.instance.warn(meta, m);
    error = (m: string, meta?: unknown) => this.instance.error(meta, m);

    child = (bindings: Record<string, unknown>): Logger =>
        new PinoLogger(this.instance.child(bindings) as Pino);
}
