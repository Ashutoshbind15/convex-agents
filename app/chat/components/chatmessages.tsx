"use client"

import { api } from "@/convex/_generated/api";
import { toUIMessages, useThreadMessages } from "@convex-dev/agent/react";
import { useEffect, useRef } from "react";

function MessageBubble({ role, content }: { role: string; content: string }) {
    const isUser = role === "user" || role === "human"
    return (
        <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
            <div
                className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm ${isUser ? "bg-primary text-primary-foreground rounded-br-sm" : "bg-muted rounded-bl-sm"
                    }`}
            >
                {content}
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
                <MessageBubble key={message.key} role={message.role} content={message.content} />
            ))}
            <div ref={scrollRef} />
        </div>
    )
}

export default ChatMessages;