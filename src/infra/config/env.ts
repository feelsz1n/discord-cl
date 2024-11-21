import { z } from 'zod'

export const envSchema = z.object({
  DISCORD_BOT_TOKEN: z.string(),
  BASE_URL: z.string().url(),
})

export type Env = z.infer<typeof envSchema>

export const env = envSchema.parse(process.env)
