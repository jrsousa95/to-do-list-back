export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BadRequestError";
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class ForbiddenError extends Error {
  redirect?: string;

  constructor(message?: string, redirect?: string) {
    super(message || "Não autorizado.");
    this.name = "ForbiddenError";
    this.redirect = redirect;
  }
}

export class UnauthorizedError extends Error {
  constructor(message?: string) {
    super(message || "Não autorizado.");
    this.name = "Unauthorized";
  }
}

export class ConflictError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "Conflict";
  }
}

export class PreconditionFailedError extends Error {
  constructor(message?: string) {
    super(message || "Não autorizado.");
    this.name = "PreconditionFailed";
  }
}
export class GoneError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "Gone";
  }
}

export class UploadError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UploadError";
  }
}
