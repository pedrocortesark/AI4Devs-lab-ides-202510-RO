export interface ApiResponse<T = any>
{
    success: boolean;
    data?: T;
    error?: {
        message: string;
        code: string;
    };
    meta?: {
        timestamp: string;
        [key: string]: any;
    };
}

export interface ProblemDetails
{
    type: string;
    title: string;
    status: number;
    detail: string;
    instance: string;
    code?: string;
}
