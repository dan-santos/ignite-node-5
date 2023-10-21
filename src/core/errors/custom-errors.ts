import { UseCaseError } from '@/core/errors/use-case-error';

export class ResourceNotFoundError extends Error implements UseCaseError {
  constructor() {
    super('Resource Not Found');
  }
}

export class ForbiddenError extends Error implements UseCaseError {
  constructor() {
    super('Forbidden');
  }
}

export class ConflictError extends Error implements UseCaseError {
  constructor() {
    super('Resource already exists');
  }
}

export class WrongCredentialsError extends Error implements UseCaseError {
  constructor() {
    super('Wrong Credentials');
  }
}

export class InvalidAttachmentTypeError extends Error implements UseCaseError {
  constructor() {
    super('File type is not valid');
  }
}