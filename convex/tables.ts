import { defineTable } from "convex/server";
import { v } from "convex/values";

export const conversationTable = defineTable({
    threadId: v.string(),
    userId: v.id("users"),
    conversationTitle: v.optional(v.string()),
}).index("by_user", ["userId"]);

export const quizTable = defineTable({
    userId: v.id("users"),
    threadId: v.string(),
    title: v.string(),
    questions: v.optional(v.array(v.object({
        question: v.string(),
        options: v.array(v.string()),
        answer: v.string(),
    }))),
})
    .index("by_user", ["userId"])
    .index("by_threadId", ["threadId"]);