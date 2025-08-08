import { components } from "./_generated/api";
import { Agent } from "@convex-dev/agent";
import { openai } from "@ai-sdk/openai";

const agent = new Agent(components.agent, {
    name: "My Agent",
    chat: openai.chat("gpt-5-nano"),
});

export default agent;