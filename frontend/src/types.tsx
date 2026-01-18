import { z } from 'zod'

export type ChatMessage = {
    id: string
    type: 'assistant' | 'user' | 'status'
    text: string
    visible: boolean
}

const StreamChunkSchema = z.object({
    type: z.literal('text'),
    chunk: z.string(),
})

const StreamStatusSchema = z.object({
    type: z.literal('status'),
    status: z.string(),
})

export const StreamEventSchema = z.discriminatedUnion('type', [
    StreamChunkSchema,
    StreamStatusSchema,
])

export type StreamEvent = z.infer<typeof StreamEventSchema>
