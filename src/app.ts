import { env } from '@/infra/config/env'
import { MessageRepository } from '@/infra/repository/MessageRepository'
import { DeleteMessages } from '@user/application/use-case/DeleteMessages'
import { Client } from 'discord.js-selfbot-v13'
import prompts from 'prompts'

class ClClient extends Client {
  constructor() {
    super({ restTimeOffset: 0 })
  }
}

const client = new ClClient()
const messageRepository = new MessageRepository(client)
const deleteMessagesUseCase = new DeleteMessages(messageRepository)

try {
  client.login(env.DISCORD_BOT_TOKEN)

  client.on('ready', async () => {
    console.clear()
    console.log(`Bot is ready as ${client.user?.tag}`)

    const { userId } = await prompts({
      type: 'text',
      name: 'userId',
      message: 'Enter the user ID to delete messages from:',
    })

    await deleteMessagesUseCase.execute(userId)
  })
} catch (error) {
  console.error('An error occurred:', error)
}
