import { useState } from 'react'
import { ChatMessage } from './types'
import { ChatDisplay, defaultChat } from './components/ChatDisplay'
import { ChatInput } from './components/ChatInput'
import { DarkModeToggle } from './components/DarkModeToggle'
import { UserTokenInput } from './components/UserTokenInput'

function App() {
    const [userToken, setUserToken] = useState<string | undefined>(undefined)
    const [chat, setChat] = useState<Array<ChatMessage>>(defaultChat)

    return (
        <>
            <div className="flex flex-row justify-center">
                <div className="flex h-screen max-w-screen-lg flex-col p-5">
                    <div className="mb-5 flex flex-row justify-between">
                        <div className="text-left text-2xl font-bold">
                            The WeatherBot
                        </div>
                        <div className="flex flex-row gap-4">
                            <DarkModeToggle />
                            <UserTokenInput
                                userToken={userToken}
                                setUserToken={setUserToken}
                            />
                        </div>
                    </div>
                    <ChatDisplay chat={chat} />
                    <ChatInput userToken={userToken} setChat={setChat} />
                </div>
            </div>
        </>
    )
}

export default App
