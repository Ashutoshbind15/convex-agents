import { ConvexError, v } from "convex/values";
import { query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { listMessages, vStreamArgs } from "@convex-dev/agent";
import { components } from "./_generated/api";
import { paginationOptsValidator } from "convex/server";
import agent from "./agents";

export const conversations = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new ConvexError("Unauthorized");
        }

        return await ctx.db.query("conversations").withIndex("by_user", (q) => q.eq("userId", userId)).collect();
    }
})

export const messages = query({
    args: {
        threadId: v.string(),
        paginationOpts: paginationOptsValidator,
        streamArgs: vStreamArgs
    },
    handler: async (ctx, { threadId, paginationOpts, streamArgs }) => {

        const userId = await getAuthUserId(ctx);
        if (!userId) {
            throw new ConvexError("Unauthorized");
        }

        const streams = await agent.syncStreams(ctx, { threadId, streamArgs, includeStatuses: ["streaming", "aborted"] });

        const paginated = await listMessages(ctx, components.agent, {
            threadId,
            paginationOpts,
        })

        return { ...paginated, streams };

    }
})