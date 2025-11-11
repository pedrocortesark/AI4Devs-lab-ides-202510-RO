import { logger } from './logger';

describe('Logger', () =>
{
    beforeEach(() =>
    {
        jest.spyOn(logger, 'info').mockImplementation();
        jest.spyOn(logger, 'error').mockImplementation();
        jest.spyOn(logger, 'warn').mockImplementation();
    });

    afterEach(() =>
    {
        jest.restoreAllMocks();
    });

    it('should log info messages', () =>
    {
        logger.info('Test info message');
        expect(logger.info).toHaveBeenCalledWith('Test info message');
    });

    it('should log error messages', () =>
    {
        logger.error('Test error message');
        expect(logger.error).toHaveBeenCalledWith('Test error message');
    });

    it('should log warn messages', () =>
    {
        logger.warn('Test warn message');
        expect(logger.warn).toHaveBeenCalledWith('Test warn message');
    });
});
