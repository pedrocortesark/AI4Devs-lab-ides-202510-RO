import { Request, Response } from 'express';

export const notFoundHandler = (req: Request, res: Response) =>
{
    res.status(404).json({
        type: 'about:blank',
        title: 'Not Found',
        status: 404,
        detail: `Route ${req.method} ${req.path} not found`,
        instance: req.path,
    });
};
