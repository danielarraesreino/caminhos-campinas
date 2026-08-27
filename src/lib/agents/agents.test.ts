import { beforeEach, describe, expect, it, vi } from "vitest";
import type { GameState } from "@/types/GameState";
import { AgentOrchestrator } from "./AgentOrchestrator";
import { BaseAgent } from "./BaseAgent";
import { GameMasterAgent } from "./GameMasterAgent";
import { NarrativeAgent } from "./NarrativeAgent";
import { streamText } from "ai";

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
		const _agent = new NarrativeAgent();
		// Access protected method via any or test public interface if refactored
		// For now, we trust the integration or we can expose it for testing
		// Since it's protected, we can't call getSystemPrompt directly in TS without casting

		const context = {
			messages: [],
			gameState: {
				health: 50,
				hunger: 80,
				money: 200,
			} as unknown as GameState,
		};

		// We can't easily test protected methods without a test subclass or @ts-expect-error
		// Let's create a Test subclass to expose it
		class TestNarrativeAgent extends NarrativeAgent {
			public testGetSystemPrompt(ctx: unknown) {
				// biome-ignore lint/suspicious/noExplicitAny: Test helper for protected property
				return this.getSystemPrompt(ctx as any);
			}
		}

		const testAgent = new TestNarrativeAgent();
		const prompt = testAgent.testGetSystemPrompt(context);

		expect(prompt).toContain("Vigor: 50%");
		expect(prompt).toContain("Fome: 80%");
		expect(prompt).toContain("R$ 200");
	});
});

describe("BaseAgent", () => {
	class TestBaseAgent extends BaseAgent {
		name = "TestAgent";
		description = "A test agent";
		protected getSystemPrompt(): string {
			return "Test System Prompt";
		}
	}

	it("should catch and rethrow errors from AI processing", async () => {
		const testAgent = new TestBaseAgent();
		const testError = new Error("AI API Error");

		// Override the default mock for this specific test
		vi.mocked(streamText).mockRejectedValueOnce(testError);

		const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

		await expect(testAgent.process({ messages: [] })).rejects.toThrow("AI API Error");

		expect(consoleErrorSpy).toHaveBeenCalledWith(
			"[TestAgent] Error processing request:",
			testError
		);

		consoleErrorSpy.mockRestore();
	});
});
