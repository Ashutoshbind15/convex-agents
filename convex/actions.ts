import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import agent, { quizAgent } from "./agents";
// import { components, internal } from "./_generated/api";
import { internal } from "./_generated/api";
import z from "zod";
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

export const createQuizAction = internalAction({
    args: { userId: v.id("users"), title: v.string(), description: v.string(), topic: v.string() },
    handler: async (ctx, { userId, title, description, topic }) => {
        const { thread } = await quizAgent.createThread(ctx, { userId });

        await ctx.runMutation(internal.mutations.addQuizToDb, {
            threadId: thread.threadId,
            userId,
            title,
        })

        await thread.generateObject(
            {
                prompt: `Generate a quiz on the topic ${topic} with the title ${title} and description ${description}`,
                schema: z.object({
                    questions: z.array(z.object({
                        question: z.string(),
                        options: z.array(z.string()),
                        answer: z.string(),
                    }))
                }),

            },
        );
    }
})

export const chatWithQuizAction = internalAction({
    args: {
        threadId: v.string(),
        userId: v.id("users"),
        prompt: v.string(),
    },
    handler: async (ctx, { threadId, userId, prompt }) => {
        const { thread } = await quizAgent.continueThread(ctx, { threadId, userId });

        await thread.generateObject({
            prompt: `Generate quiz questions, given the conversation and the following follow up ${prompt}`,
            schema: z.object({
                questions: z.array(z.object({
                    question: z.string(),
                    options: z.array(z.string()),
                    answer: z.string(),
                }))
            })
        })
    }
})