import type { UseCaseError } from '@/core/errors/use-case-error'

export class UserNotFriend extends Error implements UseCaseError {
  constructor() {
    super('User not friend')
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}
