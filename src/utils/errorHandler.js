export class AppError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.isOperational = true;
      
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  export function handleAsyncError(fn) {
    return (req, res, next) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }