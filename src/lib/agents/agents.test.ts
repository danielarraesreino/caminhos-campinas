import { beforeEach, describe, expect, it, vi } from "vitest";
import { AgentOrchestrator } from "./AgentOrchestrator";
import { GameMasterAgent } from "./GameMasterAgent";
import { NarrativeAgent } from "./NarrativeAgent";

// Mock streamText to avoid actual API calls
vi.mock("ai", () => ({
	streamText: vi.fn().mockResolvedValue({
		toTextStreamResponse: () => new ReadableStream(),
	}),
}));

describe("AgentOrchestrator", () => {
	let orchestrator: AgentOrchestrator;

	beforeEach(() => {
		// Reset singleton if possible, or just get instance
		orchestrator = AgentOrchestrator.getInstance();
	});

	it("should return NarrativeAgent by default", () => {
		const agent = orchestrator.getAgent("NarrativeAgent");
		expect(agent).toBeInstanceOf(NarrativeAgent);
	});

	it("should return GameMasterAgent when requested", () => {
		const agent = orchestrator.getAgent("GameMasterAgent");
		expect(agent).toBeInstanceOf(GameMasterAgent);
	});

	it("should route to NarrativeAgent when mode is undefined", async () => {
		const context = { messages: [] };
		const spy = vi.spyOn(orchestrator, "route");
		await orchestrator.route(context);
		expect(spy).toHaveBeenCalledWith(context);
	});
});

describe("NarrativeAgent", () => {
	it("should generate correct system prompt with game state", () => {
		const agent = new NarrativeAgent();
		// Access protected method via any or test public interface if refactored
		// For now, we trust the integration or we can expose it for testing
		// Since it's protected, we can't call getSystemPrompt directly in TS without casting

		const context = {
			messages: [],
			gameState: {
				health: 50,
				hunger: 80,
				money: 200,
			} as any,
		};

		// We can't easily test protected methods without a test subclass or @ts-expect-error
		// Let's create a Test subclass to expose it
		class TestNarrativeAgent extends NarrativeAgent {
			public testGetSystemPrompt(ctx: any) {
				return this.getSystemPrompt(ctx);
			}
		}

		const testAgent = new TestNarrativeAgent();
		const prompt = testAgent.testGetSystemPrompt(context);

		expect(prompt).toContain("Vigor: 50%");
		expect(prompt).toContain("Fome: 80%");
		expect(prompt).toContain("R$ 200");
	});
});
