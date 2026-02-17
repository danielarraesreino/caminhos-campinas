import { GameMasterAgent } from "./GameMasterAgent";
import { NarrativeAgent } from "./NarrativeAgent";
import type { Agent, AgentContext, AgentResponse } from "./types";

export class AgentOrchestrator {
	private static instance: AgentOrchestrator;
	private agents: Map<string, Agent>;

	private constructor() {
		this.agents = new Map();
		this.registerAgent(new NarrativeAgent());
		this.registerAgent(new GameMasterAgent());
	}

	public static getInstance(): AgentOrchestrator {
		if (!AgentOrchestrator.instance) {
			AgentOrchestrator.instance = new AgentOrchestrator();
		}
		return AgentOrchestrator.instance;
	}

	public registerAgent(agent: Agent) {
		this.agents.set(agent.name, agent);
	}

	public getAgent(name: string): Agent | undefined {
		return this.agents.get(name);
	}

	/**
	 * Routes the request to the appropriate agent.
	 * Logic can be expanded to analyze message content, but for now relies on explicit 'mode' or default.
	 */
	public async route(
		context: AgentContext,
		mode?: string,
	): Promise<AgentResponse> {
		let targetAgentArg = "NarrativeAgent"; // Default

		if (mode === "mechanics" || mode === "system") {
			targetAgentArg = "GameMasterAgent";
		}

		const agent = this.agents.get(targetAgentArg);
		if (!agent) {
			throw new Error(`Agent ${targetAgentArg} not found`);
		}

		return agent.process(context);
	}
}
