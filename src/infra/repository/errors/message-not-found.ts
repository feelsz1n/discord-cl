import type { UseCaseError } from '@/core/errors/use-case-error'

export class MessageNotFoundError extends Error implements UseCaseError {
  constructor() {
    super('Message not found')
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}
