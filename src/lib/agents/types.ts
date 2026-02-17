import type { ModelMessage } from "ai";
import type { GameState } from "@/types/GameState";

export interface AgentContext {
	messages: ModelMessage[];
	gameState?: GameState;
	systemPrompt?: string; // Optional override
	model?: string; // Optional model override
}

export interface AgentResponse {
	response: Response;
	metadata?: Record<string, any>;
}

export interface Agent {
	name: string;
	description: string;
	process(context: AgentContext): Promise<AgentResponse>;
}
