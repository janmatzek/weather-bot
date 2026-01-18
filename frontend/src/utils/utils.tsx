import { StreamEvent, StreamEventSchema } from '../types'
const deterministicForecastEndpoint = `/api/forecast`
const aiForecastEndpoint = `/api/forecast-llm`

function parseStreamChunk(data: string): StreamEvent | null {
    try {
        const parsedJson = JSON.parse(data.trim())

        const parsedEvent = StreamEventSchema.safeParse(parsedJson)
        if (!parsedEvent.success) {
            console.log('Stream chunk did not match schema:', parsedJson)
            return null
        }

        return parsedEvent.data
    } catch (error) {
        console.log('Error parsing stream chunk:', error)
        return null
    }
}

export async function* getWeatherInfo(
    input: string,
    token: string | undefined
): AsyncGenerator<StreamEvent> {
    let url: string
    let headers: Record<string, string>

    if (token) {
        url = aiForecastEndpoint
        headers = {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    } else {
        url = deterministicForecastEndpoint
        headers = {
            'Content-Type': 'application/json',
        }
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                userInput: input,
            }),
        })

        if (!response.ok) {
            if (response.status >= 400 && response.status < 500) {
                yield {
                    type: 'text',
                    chunk:
                        'There was an error with your request 😢' +
                        '\nMaybe check your token and try later? 👉👈🥺',
                }
                return
            }
            if (response.status >= 500) {
                yield {
                    type: 'text',
                    chunk:
                        `I'm sorry, there's an error on my server 😢` +
                        `\nMaybe try again later? 👉👈🥺`,
                }
                return
            }
        }

        if (response.ok && response.body) {
            const reader = response.body.getReader()

            const decoder = new TextDecoder()

            let buffer = ''

            while (true) {
                const { value, done } = await reader.read()
                if (done) break

                buffer += decoder.decode(value, { stream: true })

                const lines = buffer.split('\n')

                buffer = lines.pop() || ''

                for (const line of lines) {
                    if (line.trim() === '') {
                        continue
                    }
                    const parsed = parseStreamChunk(line)
                    if (parsed) {
                        yield parsed
                    }
                }
            }

            if (buffer.trim()) {
                const parsed = parseStreamChunk(buffer)
                if (parsed) {
                    yield parsed
                }
            }
        }
    } catch (error) {
        console.log(error)

        yield {
            type: 'text',
            chunk:
                "I'm sorry, I couldn't get the weather for you 😢 " +
                'Something unexpected and terrible must have happened.' +
                '\nMaybe try again later? 👉👈🥺',
        }
    }
    return
}
