import './App.css'
import { ChangeEvent, useState } from 'react'
import { getWeatherInfo } from './utils/utils'
import { ChatMessage } from './types'
import { ChatComponent } from './components/ChatComponent'
import { DarkModeToggle } from './components/DarkModeToggle'

function App() {
    const [userInput, setUserInput] = useState('')
    const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) =>
        setUserInput(event.target.value)

    const defaultMessage: ChatMessage = {
        type: 'bot',
        message:
            'Hi! I am the weather bot. You can ask me about the weather on any city and I will fetch a forecast for you. Try it out!',
    }

    const [chat, setChat] = useState<Array<ChatMessage>>([defaultMessage])

    async function handleSendClick() {
        // get the user input, store it in a variable and clear the input field
        const message = userInput
        setUserInput('')

        // add a new bubble with user message to the chat component
        setChat((chat) => [...chat, { type: 'user', message }])

        // send the contents to weatherBot and await response
        const weather = await getWeatherInfo(message)

        // add a new bubble with response from weatherBot to the chat component
        setChat((chat) => [...chat, { type: 'bot', message: weather }])
    }
    async function handleKeyDown(
        event: React.KeyboardEvent<HTMLTextAreaElement>
    ) {
        if (event.key === 'Enter') {
            event.preventDefault()
            handleSendClick()
        }
    }
    return (
        <>
            <div className="flex flex-row justify-center">
                <div className="flex h-screen max-w-screen-lg flex-col p-5">
                    <div className="mb-5 flex flex-row justify-between">
                        <div className="text-left text-2xl font-bold">
                            The WeatherBot
                        </div>
                        <DarkModeToggle />
                    </div>
                    <ChatComponent chat={chat} />

                    <div className="flex flex-row items-end justify-evenly rounded-xl bg-neutral p-5">
                        {/* the input component */}
                        <textarea
                            className="focus:box-shadow-none textarea textarea-ghost w-full resize-none border-none bg-inherit text-neutral-content focus:resize-none focus:text-neutral-content focus:outline-none"
                            placeholder={
                                chat.length == 1
                                    ? 'Ask me about the weather...'
                                    : ''
                            }
                            value={userInput}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                        ></textarea>

                        <button
                            className="btn rounded-full bg-base-100 text-xl"
                            onClick={handleSendClick}
                        >
                            ⬆
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default App
