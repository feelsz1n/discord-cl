import type { UseCaseError } from '@/core/errors/use-case-error'

export class UserNotFoundError extends Error implements UseCaseError {
  constructor() {
    super('User not found')
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}
