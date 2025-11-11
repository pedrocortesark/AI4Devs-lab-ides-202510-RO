import { DomainError } from './domainError';

export class ValidationError extends DomainError
{
    constructor(message: string, code: string = 'VALIDATION_ERROR')
    {
        super(message, code, 400);
    }
}
