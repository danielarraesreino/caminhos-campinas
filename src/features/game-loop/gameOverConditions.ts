"use client";

import type { GameState } from "@/contexts/GameContext";

export interface GameOverResult {
	isGameOver: boolean;
	reason: string;
	narrative: string;
	statistics?: {
		daysSurvived: number;
		moneyEarned: number;
		dignityFinal: number;
		socialStigmaFinal: number;
	};
}

export function checkGameOver(state: GameState): GameOverResult {
	const playerName = state.avatar?.name || "Você";

	if (state.dignity <= 0) {
		return {
			isGameOver: true,
			reason: "DESISTÊNCIA",
			narrative: `${playerName} não aguenta mais.

A invisibilidade doeu mais que a fome. Cada humilhação retirou um pedaço da sua humanidade.

Você decide parar de lutar.

**Fim de jogo.** ${state.day} dias sobrevividos.

*"A morte social precede a morte física."* - Castel, 1998`,
			statistics: {
				daysSurvived: state.day,
				moneyEarned: state.money,
				dignityFinal: state.dignity,
				socialStigmaFinal: state.socialStigma,
			},
		};
	}

	if (state.health <= 0) {
		return {
			isGameOver: true,
			reason: "ÓBITO",
			narrative: `${playerName} não resistiu.

Estatística do IBGE. Sem nome no jornal, sem túmulo, sem notícia.

**${state.day} dias nas ruas de Campinas.**

*"A expectativa de vida da população de rua é de 45 anos."* - IPEA, 2020`,
			statistics: {
				daysSurvived: state.day,
				moneyEarned: state.money,
				dignityFinal: state.dignity,
				socialStigmaFinal: state.socialStigma,
			},
		};
	}

	return {
		isGameOver: false,
		reason: "",
		narrative: "",
	};
}
