import type { IMessageRepository } from '../repository/IMessageRepository'

export class DeleteMessages {
  private readonly messageRepository: IMessageRepository
  quantity = 1

  constructor(messageRepository: IMessageRepository) {
    this.messageRepository = messageRepository
  }

  async execute(userId: string): Promise<void> {
    const messages = await this.messageRepository.fetchMessages(userId)

    console.log(`Found ${messages.length} messages from user with ID ${userId}`)

    for (const message of messages) {
      const randomTime = Math.floor(Math.random() * 6) + 1
      await new Promise(resolve => setTimeout(resolve, randomTime * 1000))

      const deleteResponse = await this.messageRepository.deleteMessage(
        userId,
        message.id
      )

      if (deleteResponse === 204) {
        console.log(
          `[${this.quantity}/${messages.length}] Deleted message with ID ${message.id} in ${randomTime}s`
        )
        this.quantity++
      }
    }

    console.log(
      `[INFO] Deleted ${this.quantity - 1} messages from user with ID ${userId}`
    )
    process.exit(0)
  }
}
