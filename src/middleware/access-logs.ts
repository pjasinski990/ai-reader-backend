import { NextFunction, Request, Response } from 'express';
import { v4 as uuid } from 'uuid';
import { Middleware } from '@/contexts/auth/entities/middleware';
import { Logger } from '@/shared/ports/out/logger';
import { logger } from '@/shared/interface/controllers/logging-controller';

export const accessLogger: Middleware = (req: Request, res: Response, next: NextFunction): void => {
    const requestId = (req.headers['x-request-id'] as string) ?? uuid();
    const log = logger.child({ requestId });
    const start = process.hrtime.bigint();
    res.locals.requestId = requestId;

    logStart(log, req);

    res.on('finish', () => {
        logFinish(log, start, res);
    });
    next();
};

function logStart(log: Logger, req: Request): void {
    log.info('request:start', {
        method: req.method,
        url: req.originalUrl,
        ip: req.ip,
        ua: req.get('user-agent'),
    });
}

function logFinish(log: Logger, startTimestamp: bigint, res: Response): void {
    const durationMs = Number(process.hrtime.bigint() - startTimestamp) / 1e6;

    const lvl = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn'  : 'info';

    log[lvl]('request:end', {
        statusCode: res.statusCode,
        durationMs,
        bytesSent: res.getHeader('content-length') ?? 0,
    });
}
