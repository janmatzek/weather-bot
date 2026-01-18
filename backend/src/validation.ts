import z from 'zod'

export const frontendRequestSchema = z.object({
    userInput: z.string(),
})

const telegramChatSchema = z.object({
    id: z.number(),
})

const telegramMessageSchema = z.object({
    message_id: z.number(),
    chat: telegramChatSchema,
    text: z.string(),
})

export const telegramUpdateSchema = z.object({
    update_id: z.number(),
    message: telegramMessageSchema,
})
