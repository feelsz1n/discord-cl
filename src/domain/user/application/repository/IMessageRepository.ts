import type { DiscordMessage } from '@user/enterprise/entities/DiscordMessage'

export interface IMessageRepository {
  fetchMessages(userId: string): Promise<DiscordMessage[]>
  deleteMessage(userId: string, messageId: string): Promise<number>
  deleteAttachment(url: string): Promise<void>
}
