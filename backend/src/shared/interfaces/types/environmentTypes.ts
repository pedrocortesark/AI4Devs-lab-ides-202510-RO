export interface Environment
{
    PORT: number;
    NODE_ENV: 'development' | 'production' | 'test';
    DATABASE_URL: string;
    CORS_ORIGIN: string;
    LOG_LEVEL: string;
    LOG_REDACT_PII: boolean;
}
