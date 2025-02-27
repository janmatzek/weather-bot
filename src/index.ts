import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import { findDates, findPlaces } from './inputProcessing'
import { isDailyWeatherData } from './utils'
import { getLogger } from './logging'
import {
    geocodeLocation,
    getTimezone,
    getWeatherData,
    generateDailyWeatherForecastMessage,
} from './weatherAndGeo'
import 'dotenv/config'

const logger = getLogger()
logger.info('Starting server...')
const app = express()

const frontendUrl = process.env.FRONTEND_URL

if (!frontendUrl) {
    throw new Error('FRONTEND_URL environment variable not set')
}

app.use(
    cors({
        origin: [frontendUrl, 'http://localhost:5173'],
        methods: 'GET,POST,PUT,DELETE,OPTIONS',
        allowedHeaders: 'Content-Type',
    })
)

const port = process.env.PORT || 3000

app.use(express.json())
app.get('/api/', async (req: Request, res: Response) => {
    logger.info(`Endpoint called: ${req.url}`)
    res.json({ app: 'WeatherBot backend' })
})
app.get('/api/health', async (req: Request, res: Response) => {
    logger.info(`Endpoint called: ${req.url}`)
    res.json({ status: 'healthy' })
})
app.post(
    '/api/forecast',
    async (req: Request, res: Response, next: NextFunction) => {
        logger.info(`Endpoint called: ${req.url}`)
        try {
            // TODO: Wrap this into a function and call it from here
            // TODO: Let Gemini parse the input instead of compromise
            const body = req.body
            const userInput = body.userInput
            if (!userInput) {
                throw new Error("Sorry, but I can't work with that 🤷")
            }

            const places = findPlaces(userInput)
            if (places.length === 0) {
                throw new Error(
                    'I am sorry, but I could not find any place in that 🔎🗺️'
                )
            }
            // TODO: handle multiple places
            const place = places[0]

            const dates = findDates(userInput)
            if (dates.length === 0) {
                throw new Error(
                    'I am sorry, but I could not find any date in there 🧐📅.'
                )
            }
            // TODO: handle multiple dates
            const date = dates[0]

            const geocodedLocation = await geocodeLocation(place)

            const timezone = await getTimezone(
                geocodedLocation.latitude,
                geocodedLocation.longitude
            )

            const weatherData = await getWeatherData(
                geocodedLocation.latitude,
                geocodedLocation.longitude,
                timezone,
                date,
                'daily'
            )

            if (isDailyWeatherData(weatherData)) {
                const weatherMessage =
                    await generateDailyWeatherForecastMessage(
                        weatherData,
                        geocodedLocation,
                        date
                    )

                res.json({ message: weatherMessage })
            } else {
                throw new Error('Hourly weather data not supported yet')
            }
        } catch (error) {
            logger.error(`Error in ${req.url} endpoint`, error)
            next(error)
        }
    }
)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack)
    res.status(500).json({ error: err.message })
})

app.listen(port, () => {
    logger.info(`🦊💻 Server running at http://localhost:${port}`)
})
