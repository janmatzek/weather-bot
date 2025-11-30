import axios from 'axios'
import { GetDataParams } from './types'
import { DailyWeatherData, HourlyWeatherData } from './types'
/**
 *
 * @param GetDataParams - object containing URL, headers and params
 * @returns Returns data object from the response.
 */
export async function requestDataViaAxiosGet({
    url,
    headers,
    params,
}: GetDataParams): Promise<Record<string, any>> {
    try {
        const response = await axios.get(url, {
            params,
            headers,
            timeout: 5 * 1000,
        })
        return response.data
    } catch (error) {
        if (axios.isAxiosError(error)) {
            throw new Error(
                `Error fetching data: ${error.message}, ${error.response?.data}`
            )
        } else {
            throw new Error(
                `An error occurred while fetching data from ${url}: ${error}`
            )
        }
    }
}

export function isDailyWeatherData(
    data: DailyWeatherData | HourlyWeatherData
): data is DailyWeatherData {
    return (data as DailyWeatherData).temperature2mMax !== undefined
}
