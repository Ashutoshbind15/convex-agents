"use client"

import { api } from "@/convex/_generated/api";
import { toUIMessages, UIMessage, useSmoothText, useThreadMessages } from "@convex-dev/agent/react";
import { useEffect, useRef } from "react";

function MessageBubble({ message }: { message: UIMessage }) {
    const isUser = message.role === "user" || message.role === "data"
    const [visibleText] = useSmoothText(message.content, {
        startStreaming: message.status === "streaming"
    })
    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
            <div
                className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm ${isUser ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-muted rounded-bl-sm"
                    }`}
            >
                {visibleText}
            </div>
        </div>
    )
}

const ChatMessages = ({ threadId }: { threadId: string }) => {

    const messages = useThreadMessages(
        api.queries.messages,
        {
            threadId
        },
        {
            initialNumItems: 10,
            stream: true
        }
    )

    const scrollRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth", block: "end" })
        }
    }, [messages.results?.length])

    return (
        <div className="space-y-3">
            {toUIMessages(messages.results ?? []).map((message) => (
                <MessageBubble message={message} />
            ))}
            <div ref={scrollRef} />
        </div>
    )
}

export default ChatMessages;