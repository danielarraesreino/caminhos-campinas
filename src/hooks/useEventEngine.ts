import { useCallback, useEffect, useRef } from "react";
import { useGameContext } from "@/contexts/GameContext";
import { STORY_ARCS } from "@/data/story-arcs";
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
		removeFromInventory,
		inventory,
		initPDU,
		updatePduStage,
		completePduStage,
		updateDocuments,
		setEmployedFormal,
		setFlag,
		activeArcId,
		history,
	} = useGameContext();

	const activeDilemma = GAME_DILEMMAS.find((d) => d.id === activeDilemmaId);

	// [NEW] Force first dilemma of selected arc if new game
	useEffect(() => {
		if (activeArcId && history.length === 0 && !activeDilemmaId) {
			// Convert arc ID to STORY_ARCS key format
			const arcKey = activeArcId.toUpperCase().replace(/-/g, "_");
			const arc = STORY_ARCS[arcKey];

			if (arc?.dilemmaSequence && arc.dilemmaSequence.length > 0) {
				const firstDilemma = arc.dilemmaSequence[0];
				console.log(
					`[EventEngine] Iniciando arco "${arc.name}" com primeiro dilema: ${firstDilemma}`,
				);
				setActiveDilemma(firstDilemma);
			}
		}
	}, [activeArcId, history.length, activeDilemmaId, setActiveDilemma]);

	// Limpeza de Dilemas obsoletos ou IDs que não existem na versão atual
	useEffect(() => {
		if (
			activeDilemmaId &&
			!activeDilemma &&
			activeDilemmaId !== "CREDITS_SCREEN" &&
			activeDilemmaId !== "RESTART_GAME"
		) {
			console.warn(
				`[EventEngine] Dilema obsoleto detectado (${activeDilemmaId}). Limpando estado...`,
			);
			setActiveDilemma(null);
		}
	}, [activeDilemmaId, activeDilemma, setActiveDilemma]);

	const lastTriggerRef = useRef<number>(0);
	// [ADICIONAR] Ref para prevenir re-entrância
	const isResolvingRef = useRef(false);

	const clearActiveDilemma = useCallback(
		() => setActiveDilemma(null),
		[setActiveDilemma],
	);

	const triggerDilemma = useCallback(
		(dilemmaId: string) => {
			const now = Date.now();
			if (now - lastTriggerRef.current < 2000) {
				console.warn(
					`[EventEngine] Throttled dilemma '${dilemmaId}' (too fast)`,
				);
				return;
			}
			lastTriggerRef.current = now;
			setActiveDilemma(dilemmaId);
		},
		[setActiveDilemma],
	);

	const resolveDilemma = useCallback(
		async (optionIndex: number, outcome: "success" | "failure" = "success") => {
			// [FIX] Prevenir chamadas múltiplas simultâneas
			if (isResolvingRef.current || !activeDilemma) return;
			isResolvingRef.current = true;

			try {
				const option = activeDilemma.options[optionIndex];
				if (!option) return;

				// 1. PRIMEIRO: Marcar como resolvido (antes de qualquer estado)
				markDilemmaResolved(activeDilemma.id);

				// Determine which effect to apply
				let effectToApply = option.effect || {};
				if (outcome === "failure" && option.effect_failure) {
					// biome-ignore lint/suspicious/noExplicitAny: Dynamic effect structure
					effectToApply = (option.effect_failure as any) || {};
				}

				// 1. Aplicar stats básicos
				Object.entries(effectToApply).forEach(([key, value]) => {
					if (
						typeof value === "number" &&
						key !== "timeAdvance" &&
						key !== "money" &&
						key !== "addBuff" &&
						key !== "removeBuff" &&
						key !== "inventoryAdd" &&
						key !== "inventoryRemove" &&
						key !== "workToolUpdate"
					) {
						// biome-ignore lint/suspicious/noExplicitAny: key indexing
						modifyStat(key as any, value);
					}
				});

				// 2. Efeitos Especializados
				if (effectToApply.money) addMoney(effectToApply.money);
				if (effectToApply.timeAdvance) advanceTime(effectToApply.timeAdvance);
				if (effectToApply.inventoryAdd)
					addToInventory(effectToApply.inventoryAdd);

				if (effectToApply.clearInventory) {
					// Esvaziar inventário
					inventory.forEach((item: { id: string }) => {
						removeFromInventory(item.id);
					});
				}

				if (effectToApply.inventoryRemove) {
					if (Array.isArray(effectToApply.inventoryRemove)) {
						effectToApply.inventoryRemove.forEach((id: string) => {
							removeFromInventory(id);
						});
					} else if (typeof effectToApply.inventoryRemove === "string") {
						removeFromInventory(effectToApply.inventoryRemove);
					}
				}

				// 3. Efeitos Sociais Campinas
				if (effectToApply.addBuff) addBuff(effectToApply.addBuff);
				if (effectToApply.removeBuff) removeBuff(effectToApply.removeBuff);
				if (effectToApply.workToolUpdate) {
					setWorkTool({
						...workTool,
						...effectToApply.workToolUpdate,
						// biome-ignore lint/suspicious/noExplicitAny: dynamic spread
					} as any);
				}

				if (effectToApply.documentsUpdate) {
					updateDocuments(effectToApply.documentsUpdate);
				}

				if (effectToApply.addiction_risk) {
					modifyStat("addiction", effectToApply.addiction_risk);
				}

				if (effectToApply.trust_state) {
					modifyStat("trust", effectToApply.trust_state);
				}

				if (effectToApply.cycle_repeat) {
					// Simula o ciclo de retorno: Avança 3 meses (90 dias), perde inventário e dinheiro
					// 90 dias * 24 horas = 2160 horas
					advanceTime(2160);
					modifyStat("money", -10000); // Zera dinheiro (supondo max < 10000 ou lógica de zerar)
					// Actually easier to just modifyStat negative max or check context.
					// Context doesn't have setMoney. But addMoney handles negatives?
					// addMoney implementation: Math.max(0, state.money + payload). So removing enormous amount sets to 0. Correct.

					inventory.forEach((item: { id: string }) => {
						removeFromInventory(item.id);
					});
				}

				if (effectToApply.employed_formal !== undefined) {
					setEmployedFormal(effectToApply.employed_formal);
				}

				// 4. [NEW] Action Logic (Flags & Quests)
				if (option.action === "SET_FLAG" && option.flag) {
					setFlag(option.flag, true);

					// TRIGGER PDU UPDATE if flag is quest starter
					if (option.flag === "quest_rg_started") {
						initPDU("TRABALHO"); // Example: Document path leads to work
						// Or just notify? Ideally we use PDU state.
						// Let's assume initPDU handles the toast natively or we rely on UI state changes.
					}
				}

				// 5. [NEW] PDU Logic (Explicit)
				if (option.pduAction) {
					const { type, value } = option.pduAction;
					if (type === "INIT") {
						initPDU(value as any);
					} else if (type === "NEXT_STAGE") {
						updatePduStage(value);
					} else if (type === "COMPLETE_STAGE") {
						completePduStage(value);
					}
				}

				// Chain Logic: If there is a next dilemma, trigger it immediately
				if (option.nextDilemmaId) {
					// [FIX] Pequeno delay para garantir que o modal atual fechou
					await new Promise((resolve) => setTimeout(resolve, 100));
					setActiveDilemma(option.nextDilemmaId);
				} else {
					setActiveDilemma(null);
				}
			} finally {
				// [FIX] Sempre liberar a flag
				isResolvingRef.current = false;
			}
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
			initPDU,
			updatePduStage,
			completePduStage,
			updateDocuments,
			inventory,
			removeFromInventory,
			setEmployedFormal,
			setFlag,
		],
	);

	return {
		activeDilemma,
		resolveDilemma,
		clearActiveDilemma,
		triggerDilemma,
	};
}
