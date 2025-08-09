import { components } from "./_generated/api";
import { Agent } from "@convex-dev/agent";
import { openai } from "@ai-sdk/openai";

const agent = new Agent(components.agent, {
    name: "My Agent",
    chat: openai.chat("gpt-4.1"),
});

export default agent;