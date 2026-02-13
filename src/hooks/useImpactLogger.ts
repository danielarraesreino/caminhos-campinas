import { useGameContext } from "@/contexts/GameContext";
import type { DilemmaOption } from "@/features/game-loop/dilemma-types";

export const useImpactLogger = () => {
	const { logEvent } = useGameContext();

	const auditResolution = (
		dilemmaId: string,
		choice: DilemmaOption,
		outcome: "success" | "failure" = "success",
	) => {
		// biome-ignore lint/suspicious/noExplicitAny: complex dilemma effects
		const effects: any =
			outcome === "failure" && choice.effect_failure
				? choice.effect_failure
				: choice.effect;
		const consequence =
			(outcome === "failure" && choice.consequence_failure) ||
			choice.consequence ||
			"";

		// 1. Auditoria de Violência de Estado (O Rapa/Polícia)
		if (effects?.clearInventory || effects?.inventoryRemove) {
			const isRapa =
				dilemmaId.includes("rapa") ||
				consequence.toLowerCase().includes("polícia") ||
				consequence.toLowerCase().includes("segurança");

			if (isRapa) {
				logEvent({
					id: `violation_${dilemmaId}_${Date.now()}`,
					type: "VIOLATION",
					timestamp: Date.now(),
					tags: ["ODS_10", "ODS_11", "RAPA", "HIGIENIZACAO"],
					description:
						"Violência Patrimonial / Higienização: O Estado confiscou meios de sobrevivência, violando o direito à cidade e à propriedade.",
				});
			}
		}

		// 2. Auditoria de Trabalho (O Suor Invisível)
		if (
			effects?.addBuff === "JOB_DENIED" ||
			effects?.addBuff === "SOCIAL_REJECTION"
		) {
			logEvent({
				id: `barrier_work_${dilemmaId}_${Date.now()}`,
				type: "BARRIER",
				timestamp: Date.now(),
				tags: ["ODS_8", "ESTIGMA_APARENCIA", "FALTA_BANHO"],
				description:
					"Barreira de Entrada: Estigma/Higiene. A falta de infraestrutura sanitária (banho) impediu o acesso ao emprego.",
			});
		}

		// 3. Auditoria de Burocracia (Fome/Documento)
		if (
			effects?.hunger &&
			effects.hunger > 10 &&
			(dilemmaId.includes("fome_doc") ||
				consequence.toLowerCase().includes("documento") ||
				consequence.toLowerCase().includes("rg"))
		) {
			logEvent({
				id: `violation_food_${dilemmaId}_${Date.now()}`,
				type: "VIOLATION",
				timestamp: Date.now(),
				tags: ["ODS_2", "BUROCRACIA_ALIMENTAR"],
				description:
					"Insegurança Alimentar Burocrática: O acesso à alimentação subsidiada foi negado por falta de identificação civil.",
			});
		}

		// 4. Falha na Saúde/Drogas (ODS 3)
		if (effects?.cycle_repeat) {
			logEvent({
				id: `fail_health_${dilemmaId}_${Date.now()}`,
				type: "VIOLATION",
				timestamp: Date.now(),
				tags: ["ODS_3", "PORTA_GIRATORIA", "FALTA_MORADIA"],
				description:
					"Eficácia da Política Pública: Recaída pós-internação devido à ausência de moradia ('Housing First') na alta médica.",
			});
		}

		// 5. Auditoria de Dignidade (Violência Simbólica / Preconceito)
		if (effects?.dignity && effects.dignity <= -15) {
			logEvent({
				id: `violation_dignity_${dilemmaId}_${Date.now()}`,
				type: "VIOLATION",
				timestamp: Date.now(),
				tags: ["ODS_10", "APOROFOBIA", "HUMILHACAO"],
				description:
					"Violência Simbólica: Humilhação pública ou tratamento degradante que corrói a dignidade humana e a saúde mental.",
			});
		}

		// 6. Auditoria de Saúde Mental (Trauma)
		if (effects?.sanity && effects.sanity <= -15) {
			logEvent({
				id: `barrier_sanity_${dilemmaId}_${Date.now()}`,
				type: "BARRIER",
				timestamp: Date.now(),
				tags: ["ODS_3", "SAUDE_MENTAL", "TRAUMA"],
				description:
					"Impacto Psicológico: A jornada de exclusão gera traumas profundos que dificultam a retomada de vínculos e autonomia.",
			});
		}
	};

	return { auditResolution };
};
