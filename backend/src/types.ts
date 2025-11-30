export type GetDataParams = {
    url: string
    headers?: Record<string, string>
    params?: Record<string, any>
}

export type Place = {
    name: string
    displayName: string
    latitude: number
    longitude: number
    error?: string
}

export type DailyWeatherData = {
    time: string
    temperature2mMax: number
    temperature2mMin: number
    sunrise: string
    sunset: string
    sunshineDuration: number
    precipitationProbabilityMax: number
    windSpeed10mMax: number
}

export type HourlyWeatherData = {
    time: Array<string>
    temperature2m: Array<number>
    relativeHumidity2m: Array<number>
    apparentTemperature: Array<number>
    precipitationProbability: Array<number>
    precipitation: Array<number>
    cloudCover: Array<number>
    visibility: Array<number>
}
