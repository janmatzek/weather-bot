import React, { ChangeEvent, useState } from 'react'
import { getWeatherInfo } from '../utils/utils'
import { ChatMessage } from '../types'

export const ChatInput = ({
    userToken,
    setChat,
}: {
    userToken: string | undefined
    setChat: React.Dispatch<React.SetStateAction<Array<ChatMessage>>>
}) => {
    const [userInput, setUserInput] = useState('')

    function updateChatMessage(id: string, newText: string) {
        setChat((chat) =>
            chat.map((message) =>
                message.id === id
                    ? {
                          ...message,
                          text: newText,
                      }
                    : message
            )
        )
    }

    function resolveStatusMessage(status: string): string {
        switch (status) {
            case 'thinking':
                return 'Thinking...'
            case 'using_tool':
                return 'Fetchning the weather...'
            case 'generating_output':
                return 'Generating...'
            default:
                return status
        }
    }

    function hideMessage(id: string) {
        setChat((chat) =>
            chat.map((message) =>
                message.id === id
                    ? {
                          ...message,
                          visible: false,
                      }
                    : message
            )
        )
    }

    function showMessage(id: string) {
        setChat((chat) =>
            chat.map((message) =>
                message.id === id
                    ? {
                          ...message,
                          visible: true,
                      }
                    : message
            )
        )
    }

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) =>
        setUserInput(event.target.value)

    async function handleSendClick() {
        // Get the user input, store it in a variable and clear the input field
        const userMessageId = crypto.randomUUID()
        const message = userInput
        setUserInput('')

        // add a new bubble with user message to the chat component
        setChat((chat) => [
            ...chat,
            { id: userMessageId, type: 'user', text: message, visible: true },
        ])

        // Send the contents to the backend and await response
        const weather = getWeatherInfo(message, userToken)

        let accumulated = ''

        // Create new chat entries
        const statusMessageId = crypto.randomUUID()
        const botMessageId = crypto.randomUUID()
        setChat((chat) => [
            ...chat,
            { id: statusMessageId, type: 'status', text: '', visible: true },
            { id: botMessageId, type: 'assistant', text: '', visible: false },
        ])

        let textStreamStarted = false

        // append incoming chunks to the incomingMessage state
        for await (const chunk of weather) {
            if (chunk.type === 'text') {
                for (const char of chunk.chunk) {
                    // Handle stream start
                    if (!textStreamStarted) {
                        textStreamStarted = true
                        hideMessage(statusMessageId)
                        showMessage(botMessageId)
                    }

                    // Update incoming message state
                    accumulated += char

                    // Update the chat bubble in place
                    updateChatMessage(botMessageId, accumulated)
                    await new Promise((resolve) => setTimeout(resolve, 15))
                }
            }

            if (chunk.type === 'status') {
                const statusText = resolveStatusMessage(chunk.status)
                updateChatMessage(statusMessageId, statusText)
            }
        }
    }

    return (
        <>
            <form className="flex flex-row items-end justify-evenly rounded-xl bg-neutral p-5">
                <input
                    className="focus:box-shadow-none textarea textarea-ghost w-full resize-none border-none bg-inherit text-neutral-content focus:resize-none focus:text-neutral-content focus:outline-none"
                    placeholder="Ask me about the weather... :)"
                    value={userInput}
                    type="text"
                    onChange={handleInputChange}
                    autoFocus
                ></input>

                <button
                    className="btn rounded-full bg-base-100 text-xl"
                    onClick={handleSendClick}
                    disabled={userInput.trim() === ''}
                    type="submit"
                >
                    ⬆
                </button>
            </form>
        </>
    )
}
