import { ConvexError, v } from "convex/values";
import { internal } from "./_generated/api";
import { internalMutation, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const createConversation = mutation({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new ConvexError("Unauthorized");
        }
        await ctx.scheduler.runAfter(0, internal.actions.createNewThreadAction, { userId });
    }
})

export const addConversationToDb = internalMutation({
    // todo: [8-08-25] -> check for how intra-component/namespace
    // db communication works

    args: {
        threadId: v.string(),
        userId: v.id("users"),
    },
    handler: async (ctx, args) => {

        await ctx.db.insert("conversations", {
            threadId: args.threadId,
            userId: args.userId,
            conversationTitle: "New Conversation",
        })
    }
})

export const sendMessage = mutation({
    args: {
        threadId: v.string(),
        message: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new ConvexError("Unauthorized");
        }
        await ctx.scheduler.runAfter(0, internal.actions.generateReplyToPrompt, { threadId: args.threadId, prompt: args.message, userId });
    }
})