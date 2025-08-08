"use client"

import { api } from "@/convex/_generated/api";
import { toUIMessages, useThreadMessages } from "@convex-dev/agent/react";

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

    return (
        <div>
            {toUIMessages(messages.results ?? []).map((message) => (
                <div key={message.key}>{message.content}</div>
            ))}
        </div>
    )
}

export default ChatMessages;