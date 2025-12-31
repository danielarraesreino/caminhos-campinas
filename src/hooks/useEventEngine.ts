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
		(optionIndex: number, outcome: "success" | "failure" = "success") => {
			if (!activeDilemma) return;

			const option = activeDilemma.options[optionIndex];
			if (!option) return;

			// Determine which effect to apply
			let effectToApply = option.effect;
			if (outcome === "failure" && option.effect_failure) {
				effectToApply = option.effect_failure as any;
			}

			// 1. Aplicar stats básicos
			Object.entries(effectToApply).forEach(([key, value]) => {
				if (
					typeof value === "number" &&
					key !== "timeAdvance" &&
					key !== "money"
				) {
					modifyStat(key as any, value);
				}
			});

			// 2. Efeitos Especializados
			if (effectToApply.money) addMoney(effectToApply.money);
			if (effectToApply.timeAdvance) advanceTime(effectToApply.timeAdvance);
			if (effectToApply.inventoryAdd)
				addToInventory(effectToApply.inventoryAdd);
			if (effectToApply.clearInventory) {
				// Esvaziar inventário (Logic needed in context or just iterating IDs?)
				// Simplified: Context doesn't have clearInventory, so we rely on manual removal or updated hook
				// For now, let's assume valid intent but maybe limited implementation
				console.log(
					"Inventory clearing requested but not fully implemented in context yet.",
				);
			}

			// 3. Efeitos Sociais Campinas
			if (effectToApply.addBuff) addBuff(effectToApply.addBuff);
			if (effectToApply.removeBuff) removeBuff(effectToApply.removeBuff);
			if (effectToApply.workToolUpdate) {
				setWorkTool({
					...workTool,
					...effectToApply.workToolUpdate,
				} as any);
			}

			// Finalizar evento
			markDilemmaResolved(activeDilemma.id);

			// Check for chained dilemma
			if (option.nextDilemmaId) {
				setActiveDilemma(option.nextDilemmaId);
			} else {
				setActiveDilemma(null);
			}

			// 4. Telemetry Tracking (Novo: Censo 2024 Integration)
			if (option.telemetryTag) {
				// Determine resolution "success" or "risk" based on effect
				// Using outcome from JSON or deriving it
				import("@/services/telemetry").then(({ telemetryService, TelemetryAction }) => {
					try {
						telemetryService.track(
							TelemetryAction.DECISION_MADE,
							{
								dilemmaId: activeDilemma.id,
								optionLabel: option.label,
								outcome: option.telemetryTag?.outcome,
								action: option.telemetryTag?.action
							},
							{
								ods_category: option.telemetryTag?.ods,
								violation_type: option.telemetryTag?.violation_type,
								resource_gap: option.telemetryTag?.resource_gap
							}
						);
					} catch (e) {
						console.warn("Telemetry error", e);
					}
				});
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
		],
	);

	return {
		activeDilemma,
		resolveDilemma,
		clearActiveDilemma,
	};
}
