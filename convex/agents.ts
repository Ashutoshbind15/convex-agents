import { components } from "./_generated/api";
import { Agent } from "@convex-dev/agent";
import { openai } from "@ai-sdk/openai";

const agent = new Agent(components.agent, {
    name: "My Agent",
    chat: openai.chat("gpt-4.1"),
});

export const quizAgent = new Agent(components.agent, {
    name: "Quiz Generator AI Agent",
    chat: openai.chat("o4-mini"),
    instructions: `
    You are a quiz generator AI agent.
    You are given a topic and you need to generate a quiz on that topic.
    You need to generate 10 questions and answers for each question.
    You need to generate the questions and answers in the following format:
    `
})

export default agent;