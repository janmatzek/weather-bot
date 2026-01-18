import { useEffect, useRef } from 'react'
import { ChatMessage } from '../types'

const defaultMessage: ChatMessage = {
    id: 'welcome-message',
    type: 'assistant',
    text:
        'Hi! I am the WeatherBot 🌤️ ' +
        'You can ask me about the weather on any ' +
        'city and I will fetch a forecast for you. Try it out! 🤩',
    visible: true,
}
const defaultTokenMessage: ChatMessage = {
    id: 'token-info-message',
    type: 'assistant',
    text: 'You can also provide an OpenAI API token to enjoy LLM powered forecasts! 🦾🤖',
    visible: true,
}

export const defaultChat: Array<ChatMessage> = [
    defaultMessage,
    defaultTokenMessage,
]

export const ChatDisplay = ({ chat }: { chat: Array<ChatMessage> }) => {
    const chatContainerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // Scroll to the bottom whenever chat updates
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop =
                chatContainerRef.current.scrollHeight
        }
    }, [chat])

    const getChatClass = (type: ChatMessage['type']): string => {
        switch (type) {
            case 'assistant':
                return 'chat chat-start text-left'
            case 'user':
                return 'chat chat-end text-left'
            case 'status':
                return 'chat chat-start text-left'
        }
    }

    const getBubbleClass = (type: ChatMessage['type']): string => {
        switch (type) {
            case 'assistant':
                return 'chat-bubble whitespace-pre-wrap chat-bubble-secondary'
            case 'user':
                return 'chat-bubble whitespace-pre-wrap chat-bubble-primary'
            case 'status':
                return 'whitespace-pre-wrap'
        }
    }

    return (
        <>
            <div
                className="mb-10 mt-5 grow overflow-scroll"
                ref={chatContainerRef}
            >
                {chat
                    .filter((entry) => entry.visible)
                    .map((message, index) => (
                        <div
                            key={index}
                            id={message.id}
                            className={getChatClass(message.type)}
                        >
                            <div className={getBubbleClass(message.type)}>
                                {message.text}
                            </div>
                        </div>
                    ))}
            </div>
        </>
    )
}
