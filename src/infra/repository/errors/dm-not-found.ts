import type { UseCaseError } from '@/core/errors/use-case-error'

export class DMNotFoundError extends Error implements UseCaseError {
  constructor() {
    super('DM not found')
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}
