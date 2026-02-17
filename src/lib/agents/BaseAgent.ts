import { groq } from "@ai-sdk/groq";
import { streamText } from "ai";
import type { Agent, AgentContext, AgentResponse } from "./types";

export abstract class BaseAgent implements Agent {
	abstract name: string;
	abstract description: string;
	protected defaultModel = "llama-3.3-70b-versatile";

	async process(context: AgentContext): Promise<AgentResponse> {
		const { messages, systemPrompt, model } = context;

		try {
			console.log(`[${this.name}] Processing request...`);

			const result = await streamText({
				model: groq(model || this.defaultModel),
				system: systemPrompt || this.getSystemPrompt(context),
				messages,
			});

			return {
				response: result.toTextStreamResponse(),
			};
		} catch (error) {
			console.error(`[${this.name}] Error processing request:`, error);
			throw error;
		}
	}

	protected abstract getSystemPrompt(context: AgentContext): string;
}
