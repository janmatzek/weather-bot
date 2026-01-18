import { OpenAI } from 'openai'
import { ResponseInputItem } from 'openai/resources/responses/responses'
import { tools } from '../aiAssets/tools'
import { getInstructions } from '../aiAssets/prompts'
import { getForecast } from '../weather/forecast'
import { getLogger } from '../logging'
import { StreamEvent } from '../types'

const logger = getLogger()

async function executeToolCall(
    toolName: string,
    stringifiedArgs: string
): Promise<string> {
    let tool: Function
    const toolArgs = JSON.parse(stringifiedArgs)

    if (toolName == 'getForecast') {
        tool = getForecast
    } else {
        return `Tool ${toolName} not recognized.`
    }

    try {
        const result = await tool(toolArgs)
        const stringifiedResult = JSON.stringify(result)
        return stringifiedResult
    } catch (error) {
        logger.error(`Error executing tool ${toolName}: ${error}`)
        return `Error executing tool.`
    }
}

export async function* runAgenticWorkflow(
    userInput: string,
    apiKey: string
): AsyncGenerator<StreamEvent> {
    const client = new OpenAI({ apiKey: apiKey })
    let context: ResponseInputItem[] = []

    const instructions = getInstructions()

    context.push({ role: 'user', content: userInput })

    yield { type: 'status', status: 'thinking' }

    const response = await client.responses.create({
        instructions: instructions,
        model: 'gpt-4o-mini',
        input: context,
        max_output_tokens: 500,
        tools: tools,
    })

    context.push(...response.output)

    for (const item of response.output) {
        if (item.type == 'function_call') {
            yield { type: 'status', status: 'using_tool' }
            console.log(
                `Executing tool call: ${item.name} with args: ${item.arguments}`
            )
            const toolResult = await executeToolCall(item.name, item.arguments)
            console.log(`Tool ${item.name} executed with result: ${toolResult}`)
            context.push({
                type: 'function_call_output',
                call_id: item.call_id,
                output: toolResult,
            })
        }
    }

    yield { type: 'status', status: 'generating_output' }
    const finalResponse = await client.responses.create({
        instructions: instructions,
        model: 'gpt-4o-mini',
        input: context,
        max_output_tokens: 500,
        stream: true,
    })

    for await (const chunk of finalResponse) {
        if (chunk.type === 'response.output_text.delta') {
            yield { type: 'text', chunk: chunk.delta }
        }
    }
}
