class APIError extends Error {
  constructor(message, status = 500, code = null) {
    super(message);
    this.status = status;
    this.code = code;
    this.success = false;
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = APIError;
