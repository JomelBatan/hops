import {verifyToken} from "../utils/jwt.js"
import {ApiError} from "../utils/ApiError.js"
import type { NextFunction, Request, Response } from "express";
import type { User } from "../type/index.js";

type WarpedUser = Omit<User, "password_hash"| "avatar_url"|"created_at">
export interface AuthRequest extends Request {
 user?: WarpedUser
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction){
    try {
        const header = req.headers.authorization || "";
        const token  = header.startsWith("Bearer ") ? header.slice(7) : null;
        if(!token) throw ApiError.unauthorized("Missing authentication token")

        const decoded = verifyToken(token);
        req.user = {id: decoded.id, email: decoded.email, name: decoded.name}
        next()
    } catch (error: unknown) {
    if (error instanceof Error && "isApiError" in error) {
        return next(error);
    }

    next(ApiError.unauthorized("Invalid or expired token"));
}
}