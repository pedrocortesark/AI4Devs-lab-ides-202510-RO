import winston from 'winston';

const redactPII = winston.format((info) =>
{
    const piiFields = ['email', 'phone', 'password', 'token', 'ssn'];
    const redacted = { ...info };

    const redactObject = (obj: any) =>
    {
        for (const key in obj)
        {
            if (typeof obj[key] === 'object' && obj[key] !== null)
            {
                redactObject(obj[key]);
            } else if (piiFields.some((field) => key.toLowerCase().includes(field)))
            {
                obj[key] = '[REDACTED]';
            }
        }
    };

    if (process.env.LOG_REDACT_PII === 'true')
    {
        redactObject(redacted);
    }

    return redacted;
});

export const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        redactPII(),
        winston.format.printf(({ timestamp, level, message, stack, ...meta }) =>
        {
            let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
            if (Object.keys(meta).length > 0)
            {
                log += ` ${JSON.stringify(meta)}`;
            }
            if (stack)
            {
                log += `\n${stack}`;
            }
            return log;
        })
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
        }),
    ],
});

// Add file transport in production
if (process.env.NODE_ENV === 'production')
{
    logger.add(
        new winston.transports.File({
            filename: 'logs/error.log',
            level: 'error',
        })
    );
    logger.add(
        new winston.transports.File({
            filename: 'logs/combined.log',
        })
    );
}
