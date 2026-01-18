import { Request, Response, NextFunction } from 'express'
import { findDates, findPlaces } from '../nlp/inputProcessing'
import { isDailyWeatherData } from '../utils'
import {
    geocodeLocation,
    getTimezone,
    getWeatherData,
    generateDailyWeatherForecastMessage,
} from '../weather/weatherAndGeo'
import 'dotenv/config'

/*
    A deterministic workflow to process user input and return weather forecast.
    Cannot process more than one place or date at a time.
*/
export async function runDeterministicWorkflow(
    userInput: string
): Promise<string> {
    // TODO: Wrap this into a function and call it from here
    // TODO: Let Gemini parse the input instead of compromise
    if (!userInput) {
        return "Sorry, but I can't work with that 🤷"
    }

    const places = findPlaces(userInput)
    if (places.length === 0) {
        return 'I am sorry, but I could not find any place in that 🔎🗺️'
    }

    if (places.length > 1) {
        return `I found multiple places in your input: ${places.join(', ')}. Please provide only one place at a time. 🧐📍`
    }

    const place = places[0]

    const dates = findDates(userInput)
    if (dates.length === 0) {
        return 'I am sorry, but I could not find any date in there 🧐📅.'
    }

    if (dates.length > 1) {
        return `I found multiple dates in your input: ${dates.join(', ')}. Please provide only one date at a time. 🧐📅`
    }

    const date = dates[0]

    const geocodedLocation = await geocodeLocation(place)

    const timezone = getTimezone(
        geocodedLocation.latitude,
        geocodedLocation.longitude
    )

    const weatherData = await getWeatherData(
        geocodedLocation.latitude,
        geocodedLocation.longitude,
        timezone,
        date,
        date,
        'daily'
    )

    if (isDailyWeatherData(weatherData)) {
        const weatherMessage = await generateDailyWeatherForecastMessage(
            weatherData,
            geocodedLocation,
            date
        )

        return weatherMessage
    } else {
        throw new Error('Hourly weather data not supported yet')
    }
}
