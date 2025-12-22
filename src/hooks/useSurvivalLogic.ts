"use client";

import { useCallback } from "react";
import { useGameContext } from "@/contexts/GameContext";

export function useSurvivalLogic() {
	const {
		workTool,
		isAtShelter,
		setActiveDilemma,
		addBuff,
		activeBuffs,
		modifyStat,
	} = useGameContext();

	// Lógica A: O Dilema da Carroça (SAMIM)
	const checkShelterBarrier = useCallback(() => {
		if (workTool.type === "CARRINHO_RECICLAGEM" && isAtShelter) {
			setActiveDilemma("barreira-samim");
		}
	}, [workTool.type, isAtShelter, setActiveDilemma]);

	// Lógica B: Consultório na Rua (CnR) - Refúgio Afetivo
	const interactWithCida = useCallback(() => {
		// No CnR, o jogador não gasta dinheiro
		addBuff("ACOLHIMENTO_CNR");
		// Recupera um pouco de dignidade por ser bem tratado
		modifyStat("dignity", 10);
	}, [addBuff, modifyStat]);

	// Efeito do Buff CnR: Reduz perda de Sanidade
	const getSanityDecayMultiplier = useCallback(() => {
		return activeBuffs.includes("ACOLHIMENTO_CNR") ? 0.5 : 1.0;
	}, [activeBuffs]);

	return {
		checkShelterBarrier,
		interactWithCida,
		getSanityDecayMultiplier,
	};
}
