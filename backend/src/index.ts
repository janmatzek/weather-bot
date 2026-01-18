import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import { getLogger } from './logging'
import {
    getTelegramConfig,
    handleDeterministicForecastRequest,
    handleForecastRequestWithLLM,
    handleTelegramWebhook,
} from './handlers'

const logger = getLogger()
logger.info('Starting server...')

/**
 * Sets up the Express application with middleware and routes.
 */
function appSetup(): express.Express {
    // Load environment variables
    const frontendUrl: string | undefined = process.env.FRONTEND_URL

    if (!frontendUrl) {
        logger.warn('FRONTEND_URL environment variable not set.')
    }

    const allowedOrigins = ['http://localhost:5173']
    if (frontendUrl) {
        allowedOrigins.push(frontendUrl)
    }

    // Check feature flag for Telegram integration
    const telegramEnabled = process.env.FF_TELEGRAM === 'true'

    const app = express()

    app.use(
        cors({
            origin: allowedOrigins,
            methods: 'GET,POST,OPTIONS',
            allowedHeaders: 'Content-Type, Authorization',
        })
    )

    app.use(express.json())

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        console.error(err.stack)
        res.status(500).json({ error: err.message })
    })

    // Set up routes
    app.get('/api/health', async (req: Request, res: Response) => {
        logger.info(`Endpoint called: ${req.url}`)
        res.json({ status: 'healthy' })
    })

    app.post('/api/forecast-llm', handleForecastRequestWithLLM)

    app.post('/api/forecast', handleDeterministicForecastRequest)

    if (telegramEnabled) {
        // Run this to validate env vars at startup
        getTelegramConfig()
        app.post('/api/telegram-webhook', handleTelegramWebhook)
        logger.info('Endpoint /api/telegram-webhook enabled')
    }

    const port = 3000
    app.listen(port, () => {
        logger.info(`🦊💻 Server running at http://localhost:${port}`)
    })

    return app
}

appSetup()
