import type { UseCaseError } from '@/core/errors/use-case-error'

export class FailedDeleteMessage extends Error implements UseCaseError {
  constructor() {
    super('Failed to delete message')
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}
