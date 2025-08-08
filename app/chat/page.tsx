"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { api } from "@/convex/_generated/api"
import { Authenticated, Unauthenticated, useConvexAuth, useMutation, useQuery } from "convex/react"
import { useEffect, useState } from "react"
import ChatMessages from "./components/chatmessages"

export default function ChatPage() {
    const [input, setInput] = useState("")
    const [selectedChat, setSelectedChat] = useState<string | null>(null)

    const { isAuthenticated } = useConvexAuth();
    const chats = useQuery(api.queries.conversations, isAuthenticated ? {} : "skip")
    const createNewChat = useMutation(api.mutations.createConversation)
    const sendMessage = useMutation(api.mutations.sendMessage)

    useEffect(() => {

    }, [selectedChat])

    if (isAuthenticated && !chats) {
        return <div>Loading...</div>
    }

    return (
        <Authenticated>
            <div className="h-screen flex bg-blue-500">
                {/* Sidebar */}
                <aside className="w-72 max-w-xs h-full flex flex-col border-r bg-sidebar">
                    <div className="px-4 py-3 border-b">
                        <h2 className="text-sm font-semibold tracking-tight">Chats</h2>
                    </div>
                    <div className="overflow-y-auto flex-1 p-2 space-y-1">
                        {chats?.map((chat) => (
                            <button
                                key={chat._id}
                                className="w-full text-left px-3 py-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors text-sm truncate"
                                onClick={() => setSelectedChat(chat.threadId)}
                            >
                                {chat.conversationTitle}
                            </button>
                        ))}
                        {chats && chats.length === 0 && (
                            <div className="text-xs text-muted-foreground px-2 py-4">No conversations yet</div>
                        )}
                    </div>
                    <div className="p-2 border-t">
                        <Button className="w-full" size="lg" onClick={async () => {
                            await createNewChat()
                        }}>New Chat</Button>
                    </div>
                </aside>

                {/* Main panel */}
                <main className="flex-1 flex flex-col h-full">
                    {/* Messages area */}
                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="max-w-3xl mx-auto space-y-3">
                            {/* Messages will render here */}
                            {!selectedChat && <div className="text-sm text-muted-foreground">Select a chat to get started.</div>}
                            {selectedChat && <ChatMessages threadId={selectedChat} />}
                        </div>
                    </div>

                    {/* Composer */}
                    <div className="border-t bg-card">
                        <form
                            className="max-w-3xl mx-auto p-3 flex items-center gap-2"
                            onSubmit={(e) => {
                                e.preventDefault();
                                console.log(input);
                            }}
                        >
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1"
                            />
                            <Button
                                type="submit"
                                onClick={async () => {
                                    console.log(input)
                                    await sendMessage({
                                        threadId: selectedChat!,
                                        message: input
                                    })
                                    setInput("")
                                }}
                                disabled={!input || !selectedChat}
                            >
                                Send
                            </Button>
                        </form>
                    </div>
                </main>
            </div>
        </Authenticated>
    )
}