import { httpRouter } from "convex/server";
import { auth } from "./auth";
import { chatWithQuizAndStreamBack } from "./httpactions";
import { httpAction } from "./_generated/server";

const http = httpRouter();

auth.addHttpRoutes(http);

http.route({
    path: "/quiz/streamchat",
    method: "POST",
    handler: chatWithQuizAndStreamBack
})

// Explicit OPTIONS route to satisfy browser CORS preflight for streaming endpoint
http.route({
    path: "/quiz/streamchat",
    method: "OPTIONS",
    handler: httpAction(async (ctx, req) => {
        const origin = req.headers.get("origin") ?? "http://localhost:3000";
        const requestHeaders = req.headers.get("Access-Control-Request-Headers") ?? "Content-Type";
        return new Response(null, {
            status: 204,
            headers: new Headers({
                "Access-Control-Allow-Origin": origin,
                "Access-Control-Allow-Methods": "POST, OPTIONS",
                "Access-Control-Allow-Headers": requestHeaders,
                "Access-Control-Max-Age": "86400",
                Vary: "Origin, Access-Control-Request-Headers",
            }),
        });
    }),
});

http.route({
    path: "/health",
    method: "GET",
    handler: httpAction(async (ctx, req) => {
        return new Response("OK", {
            status: 200,
            headers: new Headers({
                "Access-Control-Allow-Origin": "http://localhost:3000",
            })
        })
    })
})

http.route({
    path: "/health",
    method: "POST",
    handler: httpAction(async (ctx, req) => {

        const { msg } = await req.json()

        console.log(msg)

        return new Response(JSON.stringify({
            msg: "OK",
            res: msg
        }), {
            status: 200,
            headers: new Headers({
                "Access-Control-Allow-Origin": "http://localhost:3000",
                Vary: "Origin",
            })
        })
    })
})

export default http;
