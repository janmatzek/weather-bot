import { FunctionTool } from 'openai/resources/responses/responses'

export const tools: FunctionTool[] = [
    {
        name: 'getForecast',
        description: '',
        type: 'function',
        parameters: {
            type: 'object',
            properties: {
                place: {
                    type: 'string',
                    description:
                        'The name of the location to get the weather forecast for.',
                },
                startDate: {
                    type: 'string',
                    description:
                        'The start date of the weather forecast in YYYY-MM-DD format.',
                },
                endDate: {
                    type: 'string',
                    description:
                        'The end date of the weather forecast in YYYY-MM-DD format.',
                },
            },
            additionalProperties: false,
            required: ['place', 'startDate', 'endDate'],
        },
        strict: true,
    },
]
