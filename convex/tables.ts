import { defineTable } from "convex/server";
import { v } from "convex/values";

export const conversationTable = defineTable({
    threadId: v.string(),
    userId: v.id("users"),
    conversationTitle: v.optional(v.string()),
}).index("by_user", ["userId"]);
