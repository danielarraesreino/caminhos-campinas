import { useCallback, useEffect } from "react";
import { useGameContext } from "@/contexts/GameContext";
import { GAME_DILEMMAS } from "@/features/game-loop/dilemmas";

export function useEventEngine() {
	const {
		activeDilemmaId,
		workTool,
		modifyStat,
		addMoney,
		advanceTime,
		markDilemmaResolved,
		setActiveDilemma,
		addBuff,
		removeBuff,
		setWorkTool,
		addToInventory,
	} = useGameContext();

	const activeDilemma = GAME_DILEMMAS.find((d) => d.id === activeDilemmaId);

	// Limpeza de Dilemas obsoletos ou IDs que não existem na versão atual
	useEffect(() => {
		if (activeDilemmaId && !activeDilemma) {
			console.warn(
				`[EventEngine] Dilema obsoleto detectado (${activeDilemmaId}). Limpando estado...`,
			);
			setActiveDilemma(null);
		}
	}, [activeDilemmaId, activeDilemma, setActiveDilemma]);

	const clearActiveDilemma = useCallback(
		() => setActiveDilemma(null),
		[setActiveDilemma],
	);

	const resolveDilemma = useCallback(
		(optionIndex: number) => {
			if (!activeDilemma) return;

			const option = activeDilemma.options[optionIndex];
			if (!option) return;
			const { effect } = option;

			// 1. Aplicar stats básicos
			Object.entries(effect).forEach(([key, value]) => {
				if (typeof value === "number" && key !== "timeAdvance") {
					modifyStat(key as any, value);
				}
			});

			// 2. Efeitos Especializados
			if (effect.money) addMoney(effect.money);
			if (effect.timeAdvance) advanceTime(effect.timeAdvance);
			if (effect.inventoryAdd) addToInventory(effect.inventoryAdd);

			// 3. Efeitos Sociais Campinas
			if (effect.addBuff) addBuff(effect.addBuff);
			if (effect.removeBuff) removeBuff(effect.removeBuff);
			if (effect.workToolUpdate) {
				setWorkTool({
					...workTool,
					...effect.workToolUpdate,
				} as any);
			}

			// Finalizar evento
			markDilemmaResolved(activeDilemma.id);
			setActiveDilemma(null);
		},
		[
			activeDilemma,
			modifyStat,
			addMoney,
			advanceTime,
			addToInventory,
			addBuff,
			removeBuff,
			setWorkTool,
			workTool,
			markDilemmaResolved,
			setActiveDilemma,
		],
	);

	return {
		activeDilemma,
		resolveDilemma,
		clearActiveDilemma,
	};
}
