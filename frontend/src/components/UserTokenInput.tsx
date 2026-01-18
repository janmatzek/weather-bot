import React from 'react'
import { useState, useRef, useEffect } from 'react'

export const UserTokenInput = ({
    userToken,
    setUserToken,
}: {
    userToken: string | undefined
    setUserToken: React.Dispatch<React.SetStateAction<string | undefined>>
}) => {
    const [modalOpen, setModalOpen] = useState(false)
    const [modalInput, setModalInput] = useState<string>('')

    const dialogRef = useRef<HTMLDialogElement | null>(null)

    useEffect(() => {
        const dialog = dialogRef.current
        if (!dialog) return

        if (modalOpen && !dialog.open) {
            setModalInput(userToken ?? '')
            dialog.showModal()
        }

        if (!modalOpen && dialog.open) {
            dialog.close()
            setModalInput('')
        }
    }, [modalOpen])

    function handleSaveClick() {
        setUserToken(modalInput)
        setModalOpen(false)
    }
    return (
        <>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="swap-on h-10 w-10 fill-current transition-transform duration-150 ease-out active:rotate-12 active:scale-95"
                viewBox="0 0 16 16"
                onClick={() => setModalOpen(true)}
                cursor="pointer"
            >
                <path d="M0 8a4 4 0 0 1 7.465-2H14a.5.5 0 0 1 .354.146l1.5 1.5a.5.5 0 0 1 0 .708l-1.5 1.5a.5.5 0 0 1-.708 0L13 9.207l-.646.647a.5.5 0 0 1-.708 0L11 9.207l-.646.647a.5.5 0 0 1-.708 0L9 9.207l-.646.647A.5.5 0 0 1 8 10h-.535A4 4 0 0 1 0 8m4-3a3 3 0 1 0 2.712 4.285A.5.5 0 0 1 7.163 9h.63l.853-.854a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708 0l.646.647.793-.793-1-1h-6.63a.5.5 0 0 1-.451-.285A3 3 0 0 0 4 5" />
                <path d="M4 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
            </svg>
            <dialog
                ref={dialogRef}
                className="modal"
                onClose={() => setModalOpen(false)}
            >
                <div className="modal-box">
                    <h3 className="text-lg font-bold">
                        Set your OpenAI API key!
                    </h3>
                    <p className="py-4">
                        You can set your OpenAI API key here to enable LLM
                        powered weather forecasts.
                        <br />
                        <br />
                        Your key will never be stored on our server and will
                        only be used to fetch OpenAI requests.
                    </p>
                    {/* TODO: save with enter key press */}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            handleSaveClick()
                        }}
                    >
                        <input
                            type="password"
                            placeholder="sk-..."
                            className="input input-bordered w-full max-w-xs"
                            value={modalInput ?? userToken}
                            onChange={(e) => setModalInput(e.target.value)}
                            autoFocus
                        />

                        <div className="modal-action">
                            <button className="btn" type="submit">
                                Save
                            </button>
                            <button
                                className="btn"
                                type="reset"
                                onClick={() => setModalOpen(false)}
                            >
                                Close
                            </button>
                        </div>
                    </form>
                </div>

                {/* backdrop */}
                <form method="dialog" className="modal-backdrop">
                    <button aria-label="close" />
                </form>
            </dialog>
        </>
    )
}
