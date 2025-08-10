import { httpAction } from "./_generated/server";
import { quizAgent } from "./agents";
import { z } from "zod";

export const chatWithQuizAndStreamBack = httpAction(async (ctx, req) => {

    const headers = req.headers;
    console.log(headers);

    const { threadId, message } = await req.json();

    // todo: pass the auth header from the client, and check it in here, as we use jwts

    // const userId = await getAuthUserId(ctx);
    // if (!userId) {
    //     throw new ConvexError("Unauthorized");
    // }

    // todo: add a streamStart mutation, for resumables in the future, as httpActions won't retry by default

    const { thread } = await quizAgent.continueThread(ctx, { threadId });

    const stream = await thread.streamObject({
        prompt: `Generate quiz questions, given the conversation and the following follow up ${message}`,
        schema: z.object({
            questions: z.array(z.object({
                question: z.string(),
                options: z.array(z.string()),
                answer: z.string(),
            }))
        })
    })

    return stream.toTextStreamResponse({
        headers: new Headers({
            "Access-Control-Allow-Origin": "http://localhost:3000",
        })
    })

})