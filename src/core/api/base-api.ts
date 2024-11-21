import { env } from '@/infra/config/env'

export async function deleteRequest(url: string): Promise<Response> {
  return fetch(url, {
    method: 'DELETE',
    headers: { Authorization: env.DISCORD_BOT_TOKEN },
  })
}

export async function getRequest(url: string): Promise<Response> {
  return fetch(url, {
    headers: { Authorization: env.DISCORD_BOT_TOKEN },
  })
}
