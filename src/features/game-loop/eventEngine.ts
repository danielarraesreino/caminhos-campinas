"use client";

import type { GameState } from "@/contexts/GameContext";

export interface GameEvent {
	id: string;
	title: string;
	description: string;
	consequence: (state: GameState) => Partial<GameState>;
}

export function processRandomEvents(
	state: GameState,
): Partial<GameState> | null {
	const { socialStigma, workTool, inventory } = state;

	// 1. "O Rapa" (Fiscalização)
	// Trigger: socialStigma > 70, chance increases with stigma
	const rapaThreshold = 70;
	if (socialStigma > rapaThreshold) {
		const rapaChance = (socialStigma - rapaThreshold) / 100;
		if (Math.random() < rapaChance) {
			return {
				workTool: {
					type: null,
					condition: 100,
					capacity: 0,
					riskFactor: 0,
				},
				inventory: [], // Perda total
				dignity: Math.max(0, state.dignity - 20),
				socialStigma: Math.min(100, state.socialStigma + 10),
			};
		}
	}

	// Outros eventos podem ser adicionados aqui
	return null;
}

export function applyWeatherEffects(
	state: GameState,
	isRaining: boolean,
): Partial<GameState> {
	if (!isRaining || state.isAtShelter) return {};

	const effects: Partial<GameState> = {
		health: Math.max(0, state.health - 2),
		sanity: Math.max(0, state.sanity - 1),
	};

	if (state.workTool.type === "CARRINHO_RECICLAGEM") {
		effects.workTool = {
			...state.workTool,
			condition: Math.max(0, state.workTool.condition - 5),
		};
	}

	return effects;
}
