export class ApiError extends Error {
  statusCode: number;
  code: string | undefined;

  constructor(statusCode: number, message: string, code?: string) {
    super(message);

    this.name = "ApiError";
    this.statusCode = statusCode;
    this.code = code;

    Object.setPrototypeOf(this, new.target.prototype);

    // Better stack traces
    Error.captureStackTrace?.(this, this.constructor);
  }

  static badRequest(msg = "Bad Request") {
    return new ApiError(400, msg);
  }

  static unauthorized(msg = "Unauthorized") {
    return new ApiError(401, msg);
  }

  static forbidden(msg = "Forbidden") {
    return new ApiError(403, msg);
  }

  static notFound(msg = "Not Found") {
    return new ApiError(404, msg);
  }

  static conflict(msg = "Conflict") {
    return new ApiError(409, msg);
  }

  static internal(msg = "Internal Server Error") {
    return new ApiError(500, msg);
  }
}
