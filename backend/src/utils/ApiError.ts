export class ApiError extends Error {
    statusCode: number;
    isApiError: boolean;
    code? : string

    constructor(statusCode: number, message: string) {
        super(message);

        this.statusCode = statusCode;
        this.isApiError = true;

        Object.setPrototypeOf(this, ApiError.prototype);
    }

    static badRequest(msg = "Bad Request"): ApiError {
        return new ApiError(400, msg);
    }

    static unauthorized(msg = "Unauthorized"): ApiError {
        return new ApiError(401, msg);
    }

    static forbidden(msg = "Forbidden"): ApiError {
        return new ApiError(403, msg);
    }

    static notFound(msg = "Not Found"): ApiError {
        return new ApiError(404, msg);
    }

    static conflict(msg = "Conflict"): ApiError {
        return new ApiError(409, msg);
    }
}