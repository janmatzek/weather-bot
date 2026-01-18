import { geocodeLocation, getTimezone, getWeatherData } from './weatherAndGeo'
import { ForecastParams, WeatherData } from '../types'

// TODO: support daily vs. hourly weather data based on user input
// TODO: validate long term forecasts

export async function getForecast(
    params: ForecastParams
): Promise<WeatherData> {
    if (!params.place || !params.startDate || !params.endDate) {
        throw new Error(
            `Missing required parameters: place, startDate, endDate. Received: ${JSON.stringify(params)}`
        )
    }

    // 1. Geocode the location to get latitude and longitude
    const geocodedLocation = await geocodeLocation(params.place)

    // 2. Get the timezone for the location
    const timezone = getTimezone(
        geocodedLocation.latitude,
        geocodedLocation.longitude
    )

    // 3. Fetch the weather data for the specified date range
    const weatherData = await getWeatherData(
        geocodedLocation.latitude,
        geocodedLocation.longitude,
        timezone,
        params.startDate,
        params.endDate,
        'daily'
    )

    return weatherData
}
