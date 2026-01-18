import axios from 'axios'
import { GetDataParams } from './types'
import { DailyWeatherData, HourlyWeatherData } from './types'

/**
 *
 * @param GetDataParams - object containing URL, headers and params
 * @returns Returns data object from the response.
 */
export async function axiosGet({
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
            console.log(url)
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

export async function sendTelegramMessage(
    message: string,
    botToken: string,
    chatId: Number
) {
    const url = `https://api.telegram.org/bot${botToken}/sendMessage`
    const data = {
        chat_id: chatId,
        text: message,
    }

    const response = await axios.post(url, data)

    if (response.status !== 200) {
        throw new Error(
            `Failed to send message to Telegram chat ${chatId}: ${response.statusText}`
        )
    }
}

export function isDailyWeatherData(
    data: DailyWeatherData | HourlyWeatherData
): data is DailyWeatherData {
    return (data as DailyWeatherData).temperature2mMax !== undefined
}
