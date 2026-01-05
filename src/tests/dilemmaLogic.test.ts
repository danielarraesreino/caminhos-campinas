import { describe, expect, it } from "vitest";
import type { Avatar, GameState, Item } from "@/contexts/GameContext";
import { DilemmaManager } from "@/features/game-loop/DilemmaManager";
import type { Dilemma } from "@/features/game-loop/dilemma-types";

describe("DilemmaManager Deterministic Logic", () => {
	const mockDilemmas: Dilemma[] = [
		{
			id: "dilemma_female",
			title: "Female Only",
			description: "Test",
			trigger: { type: "RANDOM", value: 1.0 },
			conditions: { gender: "feminino" },
			options: [],
		},
		{
			id: "dilemma_male",
			title: "Male Only",
			description: "Test",
			trigger: { type: "RANDOM", value: 1.0 },
			conditions: { gender: "masculino" },
			options: [],
		},
		{
			id: "dilemma_item",
			title: "Item Required",
			description: "Test",
			trigger: { type: "RANDOM", value: 1.0 },
			conditions: { requiredItem: "key_item" },
			options: [],
		},
	];

	const manager = new DilemmaManager(mockDilemmas);

	// Mock Helper to satisfy strict Avatar type
	const mockAvatar: Avatar = {
		name: "Test",
		gender: "masculino",
		ethnicity: "pardo",
		ageRange: "adulto",
		timeOnStreet: "recente",
		startingSkill: "nenhuma"
	};

	it("should filter dilemmas by gender", () => {
		const stateMock = {
			avatar: { ...mockAvatar, gender: "masculino" },
			inventory: [],
			health: 100,
			sanity: 100,
			hunger: 100,
			energy: 100,
			hygiene: 100,
			dignity: 100,
			money: 0,
			time: 8,
			day: 1,
			weather: "sun",
			activeDilemmaId: null,
			resolvedDilemmas: [],
			gameStatus: "playing",
			gameSpeed: 1,
			// runtime props
			userPosition: null, // [number, number] | null
			timeInLocation: 0
		};

		const dilemma = manager.findTriggeredDilemma(stateMock as any);

		expect(dilemma?.id).toBe("dilemma_male");
	});

	it("should filter dilemmas by item", () => {
		const stateNoItem = {
			avatar: { ...mockAvatar },
			inventory: [],
			activeDilemmaId: null,
			resolvedDilemmas: [],
			userPosition: null,
			timeInLocation: 0
		};

		const dilemma1 = manager.findTriggeredDilemma(stateNoItem as any);
		expect(dilemma1?.id).toBe("dilemma_male");

		// Strict Item type: id, name, weight, type only. No effects, no cost, no available.
		const mockItem: Item = { id: "key_item", name: "Key", weight: 0, type: "valioso" };

		const stateWithItem = {
			avatar: { ...mockAvatar },
			inventory: [mockItem],
			activeDilemmaId: null,
			resolvedDilemmas: [],
			userPosition: null, // Explicit to satisfy intersection type
			timeInLocation: 0
		};

		// Resolve male so item one can pick
		manager.updateResolved(["dilemma_male"]);

		const dilemma2 = manager.findTriggeredDilemma(stateWithItem as any);
		expect(dilemma2?.id).toBe("dilemma_item");
	});

	it("should prioritize High Intensity/Health aspect when health is critical (Director Logic)", () => {
		const criticalHealthDilemmas: Dilemma[] = [
			{
				id: "low_intensity_noise",
				title: "Noise",
				description: "Low intensity",
				trigger: { type: "RANDOM", value: 1.0 },
				aspect: "SOCIAL",
				intensity: "LOW",
				options: []
			},
			{
				id: "high_intensity_crisis",
				title: "Crisis",
				description: "High intensity",
				trigger: { type: "RANDOM", value: 1.0 },
				aspect: "HEALTH",
				intensity: "HIGH",
				options: []
			}
		];

		const directorManager = new DilemmaManager(criticalHealthDilemmas);

		const criticalState = {
			health: 10,
			avatar: { ...mockAvatar },
			inventory: [],
			activeDilemmaId: null,
			resolvedDilemmas: [],
			userPosition: null,
			timeInLocation: 0
		};

		const picked = directorManager.findTriggeredDilemma(criticalState as any);
		expect(picked?.id).toBe("high_intensity_crisis");
	});

	it("should prioritize Chain Step over anything else", () => {
		const chainDilemmas: Dilemma[] = [
			{
				id: "random_crisis",
				title: "Crisis",
				description: "High intensity",
				trigger: { type: "RANDOM", value: 1.0 },
				aspect: "HEALTH",
				intensity: "HIGH",
				options: []
			},
			{
				id: "chain_step",
				title: "Story Step",
				description: "Chain",
				trigger: { type: "CHAIN_STEP", prev_id: "prev_step", value: 0 },
				options: []
			}
		];

		const chainManager = new DilemmaManager(chainDilemmas, ["prev_step"]);

		const criticalState = {
			health: 10,
			activeDilemmaId: null,
			resolvedDilemmas: [],
			userPosition: null,
			timeInLocation: 0
		};

		const picked = chainManager.findTriggeredDilemma(criticalState as any);
		expect(picked?.id).toBe("chain_step");
	});
});
