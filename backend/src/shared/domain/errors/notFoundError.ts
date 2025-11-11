import { DomainError } from './domainError';

export class NotFoundError extends DomainError
{
    constructor(message: string, code: string = 'NOT_FOUND')
    {
        super(message, code, 404);
    }
}
