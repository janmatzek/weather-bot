import { Request, Response, NextFunction } from 'express'
import { getLogger } from './logging'
import { runAgenticWorkflow } from './workflows/agentic'
import { runDeterministicWorkflow } from './workflows/deterministic'
import { TelegramConfig } from './types'
import { telegramUpdateSchema, frontendRequestSchema } from './validation'
import { sendTelegramMessage } from './utils'
import { OpenAIError } from 'openai'

const logger = getLogger()

export function getTelegramConfig(): TelegramConfig {
    const llmApiKey = process.env.LLM_API_KEY

    if (!llmApiKey) {
        throw new Error('Missing LLM_API_KEY environment variable.')
    }

    const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN

    if (!telegramBotToken) {
        throw new Error('Missing TELEGRAM_BOT_TOKEN environment variable.')
    }

    return {
        llmApiKey,
        telegramBotToken,
    }
}

export const handleTelegramWebhook = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    logger.info(`Telegram webhook update received.`)

    // Acknowledge receipt of the webhook to avoid retries
    res.sendStatus(202)

    try {
        const body = req.body
        const headers = req.headers

        if (!('X-Telegram-Bot-Api-Secret-Token' in headers)) {
            logger.error(
                `Missing Telegram secret token header: ${JSON.stringify(req.headers)}.` +
                    `Body: ${JSON.stringify(body)}`
            )
            return
        }

        if (
            headers['x-telegram-bot-api-secret-token'] !==
            process.env.TELEGRAM_BOT_API_SECRET_TOKEN
        ) {
            logger.error(
                `Invalid Telegram secret token: ${headers['x-telegram-bot-api-secret-token']}` +
                    `Body: ${JSON.stringify(body)}`
            )
            return
        }

        const telegramUpdate = telegramUpdateSchema.parse(body)

        const config = getTelegramConfig()

        const userInput = telegramUpdate.message.text
        const chatId = telegramUpdate.message.chat.id

        const result_chunks: string[] = []
        for await (const chunk of runAgenticWorkflow(
            userInput,
            config.llmApiKey
        )) {
            if (chunk.type === 'text') result_chunks.push(chunk.chunk)
        }

        const result = result_chunks.join('')

        await sendTelegramMessage(result, config.telegramBotToken, chatId)
    } catch (error) {
        logger.error('Error handling Telegram webhook', error)
        next(error)
    }
}

function getTokenFromHeaders(
    headers: Request['headers'],
    res: Response
): string | undefined {
    if (!headers.authorization) {
        res.status(401).json({ error: 'Missing Authorization header.' })
        return
    }

    const authHeader = headers.authorization

    if (!authHeader.startsWith('Bearer ')) {
        res.status(401).json({
            error: 'Invalid Authorization header format.',
        })
        return
    }

    const apiToken = authHeader.replace('Bearer ', '')

    if (apiToken === '') {
        res.status(401).json({ error: 'API token is required.' })
        return
    }

    return apiToken
}

export const handleForecastRequestWithLLM = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    logger.info(`Endpoint called: ${req.url}`)
    try {
        const headers = req.headers

        const apiToken = getTokenFromHeaders(headers, res)
        if (!apiToken) {
            return
        }

        const parsedRequest = frontendRequestSchema.safeParse(req.body)

        if (!parsedRequest.success) {
            res.status(400).json({ error: 'Invalid request format.' })
            return
        }

        const { userInput } = parsedRequest.data

        // Setup streaming headers
        res.setHeader('Content-Type', 'application/x-ndjson')
        res.setHeader('Cache-Control', 'no-cache')
        res.setHeader('Connection', 'keep-alive')
        res.setHeader('Transfer-Encoding', 'chunked')

        try {
            for await (const chunk of runAgenticWorkflow(userInput, apiToken)) {
                res.write(JSON.stringify(chunk) + '\n')
            }
            res.end()
        } catch (error) {
            logger.error('Error processing forecast request', error)

            if (error instanceof OpenAIError) {
                res.status(401).json({
                    error: `LLM API error: ${error.message}`,
                })
                return
            }

            res.status(500).json({ error: 'Internal server error.' })
        }
    } catch (error) {
        logger.error(`Error in ${req.url} endpoint`, error)
        next(error)
    }
}

export const handleDeterministicForecastRequest = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    logger.info(`Endpoint called: ${req.url}`)
    try {
        const parsedRequest = frontendRequestSchema.safeParse(req.body)
        if (!parsedRequest.success) {
            res.status(400).json({ error: 'Invalid request format.' })
            return
        }

        const { userInput } = parsedRequest.data

        try {
            const result = await runDeterministicWorkflow(userInput)
            res.write(JSON.stringify({ type: 'text', chunk: result }))
            res.end()
        } catch (error) {
            logger.error(
                'Error processing deterministic forecast request',
                error
            )
            res.status(500).json({ error: 'Internal server error.' })
        }
    } catch (error) {
        logger.error(`Error in ${req.url} endpoint`, error)
        next(error)
    }
}
