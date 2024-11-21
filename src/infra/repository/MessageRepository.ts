import { deleteRequest } from '@/core/api/base-api'
import type { IMessageRepository } from '@user/application/repository/IMessageRepository'
import { DiscordMessage } from '@user/enterprise/entities/DiscordMessage'
import {
  type Client,
  Collection,
  type DMChannel,
  type Message,
} from 'discord.js-selfbot-v13'
import {
  DMNotFoundError,
  FailedDeleteMessage,
  MessageNotFoundError,
} from './errors/'

export class MessageRepository implements IMessageRepository {
  private readonly messageCache = new Map<string, Collection<string, Message>>()
  private messages = new Collection<string, Message>()
  private lastMessageId: string | undefined = undefined

  constructor(private client: Client) {}

  async fetchMessages(userId: string): Promise<DiscordMessage[]> {
    if (this.messageCache.has(userId)) {
      return this.mapToDiscordMessages(this.messageCache.get(userId)!)
    }

    const dmChannel = await this.getDMChannel(userId)
    const discordMessages = await this.fetchAllMessages(dmChannel)

    this.messageCache.set(userId, discordMessages)
    return this.mapToDiscordMessages(discordMessages)
  }

  async deleteMessage(userId: string, messageId: string): Promise<number> {
    const userDMChannel = (await this.client.users.fetch(userId)).dmChannel
    if (!userDMChannel) throw new DMNotFoundError()

    const cachedMessages = this.messageCache.get(userId)
    const messageToDelete = cachedMessages?.get(messageId)
    if (
      !messageToDelete ||
      messageToDelete.author.id !== this.client.user?.id
    ) {
      throw new MessageNotFoundError()
    }

    const response = await deleteRequest(
      `https://discord.com/api/v9/channels/${userDMChannel.id}/messages/${messageToDelete.id}`
    )

    if (response.status === 404) throw new MessageNotFoundError()
    if (response.status !== 204) throw new FailedDeleteMessage()

    cachedMessages?.delete(messageId)
    return response.status
  }

  async deleteAttachment(url: string): Promise<void> {
    await deleteRequest(url)
  }

  private async getDMChannel(userId: string) {
    const user = await this.client.users.fetch(userId)
    return user.createDM()
  }

  private async fetchAllMessages(
    dmChannel: DMChannel
  ): Promise<Collection<string, Message>> {
    while (true) {
      const fetchedMessages = await dmChannel.messages.fetch({
        limit: 100,
        before: this.lastMessageId,
      })
      if (fetchedMessages.size === 0) break

      for (const message of fetchedMessages.values()) {
        if (message.author.id === this.client.user?.id) {
          this.messages.set(message.id, message)
        }
      }

      this.lastMessageId = fetchedMessages.last()?.id
    }
    return this.messages
  }

  private mapToDiscordMessages(
    messages: Collection<string, Message>
  ): DiscordMessage[] {
    return Array.from(messages.values()).map(
      ({ id, content, author, attachments }) =>
        new DiscordMessage(
          id,
          content,
          author.id,
          attachments.map(attachment => attachment.url)
        )
    )
  }
}
