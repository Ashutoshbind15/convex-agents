import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import agent from "./agents";
// import { components, internal } from "./_generated/api";
import { internal } from "./_generated/api";
// import { listMessages } from "@convex-dev/agent";

export const createNewThreadAction = internalAction({
    args: { userId: v.id("users") },
    handler: async (ctx, { userId }) => {
        const { thread } = await agent.createThread(ctx, { userId });

        await ctx.runMutation(internal.mutations.addConversationToDb, {
            threadId: thread.threadId,
            userId,
        })
    },
})

export const generateReplyToPrompt = internalAction({
    args: { prompt: v.string(), threadId: v.string(), userId: v.id("users") },
    handler: async (ctx, { prompt, threadId, userId }) => {

        // todo: [8-08-25]
        // check for the thread authorization

        // await authorizeThreadAccess(ctx, threadId);
        const result = await agent.streamText(ctx, { threadId, userId }, { prompt }, { saveStreamDeltas: true });

        await result.consumeStream();

        // todo: [8-08-25]
        // i want to check if its the first message, if so, i want to update the title

        // const messages = await listMessages(ctx, components.agent, {
        //     threadId,
        //     paginationOpts: {
        //         cursor: null,
        //         numItems: 10
        //     },
        //     excludeToolMessages: true,
        // })

        // console.log("messages", messages)
    },
});