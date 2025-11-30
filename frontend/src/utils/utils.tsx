import axios from 'axios'

const weatherBotUrl = '/api/forecast'

export async function getWeatherInfo(input: string) {
    try {
        const response = await axios.post(
            weatherBotUrl,
            {
                userInput: input,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )
        return response.data.message
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.log(error.response?.data.error)
            console.log(error)
            if (error.response?.data.error === '') {
                return "I'm sorry, there's an error on my server. I couldn't get the weather for you 😢 Maybe try again later? 👉👈🥺"
            } else {
                return error.response?.data.error
            }
        }
    }
}
