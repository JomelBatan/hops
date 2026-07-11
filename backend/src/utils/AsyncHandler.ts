import type { NextFunction, Request, Response, RequestHandler } from "express";


export default function asyncHandler (
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
): RequestHandler{
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};