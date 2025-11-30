import { useEffect, useRef } from 'react'
import { ChatMessage } from '../types'

export const ChatComponent = ({ chat }: { chat: Array<ChatMessage> }) => {
    const chatContainerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // Scroll to the bottom whenever chat updates
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop =
                chatContainerRef.current.scrollHeight
        }
    }, [chat])

    return (
        <>
            <div
                className="mb-10 mt-5 grow overflow-scroll"
                ref={chatContainerRef}
            >
                {chat.map((message, index) => (
                    <div
                        key={index}
                        className={`chat ${message.type === 'bot' ? 'chat-start' : 'chat-end'} text-left`}
                    >
                        <div
                            className={`chat-bubble ${message.type === 'bot' ? 'chat-bubble-secondary' : 'chat-bubble-primary'}`}
                        >
                            {message.message}
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}
