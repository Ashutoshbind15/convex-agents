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

// client facing mutation, to create a quiz
export const createQuiz = mutation({
    args: {
        title: v.string(),
        description: v.string(),
        topic: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new ConvexError("Unauthorized");
        }

        await ctx.scheduler.runAfter(0, internal.actions.createQuizAction, { userId, title: args.title, description: args.description, topic: args.topic });
    }
})

export const addQuizToDb = internalMutation({
    args: {
        threadId: v.string(),
        userId: v.id("users"),
        title: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("quizzes", {
            userId: args.userId,
            threadId: args.threadId,
            title: args.title
        })
    }
})

export const chatWithQuiz = mutation({
    args: {
        threadId: v.string(),
        message: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new ConvexError("Unauthorized");
        }

        // todo: [10-08-25] -> authorization check, ie ref the threadId to the quiz, and check if the user is the owner of the quiz

        await ctx.scheduler.runAfter(0, internal.actions.chatWithQuizAction, { threadId: args.threadId, prompt: args.message, userId });
    }
})

// to be called on save quiz button click
export const addQuizQuestionToDb = internalMutation({
    args: {
        threadId: v.string(),
        userId: v.id("users"),
        questions: v.array(
            v.object({
                question: v.string(),
                options: v.array(v.string()),
                answer: v.string(),
            })
        ),
    },
    handler: async (ctx, args) => {
        const quiz = await ctx.db
            .query("quizzes")
            .withIndex("by_threadId", (q) => q.eq("threadId", args.threadId))
            .unique();

        if (!quiz) {
            throw new Error("Quiz not found for given threadId");
        }

        if (quiz.userId !== args.userId) {
            throw new Error("Unauthorized to modify this quiz");
        }

        const existingQuestions = quiz.questions ?? [];
        const updatedQuestions = [...existingQuestions, ...args.questions];

        await ctx.db.patch(quiz._id, { questions: updatedQuestions });
    }
})