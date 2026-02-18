/**
 * Story Arc Metadata - Narrativas Temáticas
 *
 * Define sequências de dilemmas agrupadas por arcos narrativos temáticos.
 * Cada arco possui um perfil de áudio único que orienta a direção sonora.
 */

import { EXPANDED_ARCS } from "./story-arcs-expanded";

export interface StoryArc {
	id: string;
	name: string;
	description: string;
	theme: string;
	dilemmaSequence: string[];
	audioProfile: {
		ambience?: string;
		intensity: "LOW" | "MEDIUM" | "HIGH";
		narrator?: string;
	};
	ods: string[];
}

/**
 * Arcos Narrativos Principais
 *
 * Baseados em dados do Censo Pop Rua 2024 e análise temática dos dilemmas.
 */
export const STORY_ARCS: Record<string, StoryArc> = {
	CRISE_FAMILIAR: {
		id: "crise_familiar",
		name: "Crise Familiar",
		description: "O rompimento de vínculos como causa raiz da situação de rua",
		theme: "abandono, solidão, tentativa de reconexão, vínculos rompidos",
		dilemmaSequence: [
			"saude_mental_vinculo", // Ligação para família (R$ 5)
			"pdu_intro_familia", // PDU: Trilha Familiar
			"egresso_prisao_inicio", // Rejeição da mãe
			"cachorro_abrigo", // [FIX] ID válido: Escolha entre teto ou pet
			"fianca_amigo_preso", // Solidariedade vs. bota nova
		],
		audioProfile: {
			ambience: "despair", // Vento vazio, solidão
			intensity: "HIGH",
			narrator: "Voz Interna (Reflexiva)",
		},
		ods: ["ODS 3", "ODS 10"],
	},

	O_CORRE: {
		id: "o_corre",
		name: "O Corre",
		description:
			"Rotina de sobrevivência: logística urbana, horários e trabalho informal",
		theme: "urgência, exaustão, luta pelo sustento, sincronização perversa",
		dilemmaSequence: [
			"intro_acordar_praca", // Despertar no Centro
			"mendicancia_vs_trabalho", // [FIX] ID válido: Esquina: esmola ou papelão
			"chain_bagageiro_01_start", // Corrida para Bagageiro (17h)
			"tentativa_abrigo_samim", // Dilema SAMIM 19h vs Bico
			"trabalho_escravizado_bico", // [FIX] ID válido: Oferta suspeita
		],
		audioProfile: {
			ambience: "street_noise", // Vozes, movimento, pregões
			intensity: "MEDIUM",
			narrator: "Cronômetro da Rua (Voz Urgente)",
		},
		ods: ["ODS 8", "ODS 11", "ODS 1"],
	},

	BARREIRA_DO_RG: {
		id: "barreira_do_rg",
		name: "Barreira do RG",
		description:
			"Burocracia e exclusão digital como barreiras invisíveis de acesso",
		theme: "invisibilidade, documentação, cidadania negada, kafkiano",
		dilemmaSequence: [
			"documento_perdido_chuva", // RG destruído
			"pdu_dilemma_rg_fee", // Poupatempo: R$ 55 ou Declaração
			"trabalho_escravizado_bico", // [FIX] ID válido: Barreira de bico/exploração
			"burocracia_fome_cras", // CadÚnico vs Bico
			"arquitetura_hostil_denuncia", // Sistema ignora cidadania
		],
		audioProfile: {
			ambience: "bureaucracy", // Som de escritório
			intensity: "LOW",
			narrator: "Funcionário Público (Tom Neutro)",
		},
		ods: ["ODS 16", "ODS 1", "ODS 10"],
	},

	PESO_DA_MEMORIA: {
		id: "peso_da_memoria",
		name: "O Peso da Memória",
		description:
			"Trauma psicológico e saúde mental: 71,5% da população de rua rompeu vínculos familiares",
		theme: "luto, trauma, culpa, fragmentação psíquica, memórias fantasmas",
		dilemmaSequence: [
			"saude_mental_vinculo", // Ligação telefônica recusada
			"tuberculose_risco_latente", // [FIX] ID válido: Tosse severa
			"fianca_amigo_preso", // [FIX] ID válido: Perda de aliado
		],
		audioProfile: {
			ambience: "heartbeat", // Batimento cardíaco acelerado
			intensity: "LOW", // Intenso mas interno
			narrator: "Voz Interna (Fragmentada)",
		},
		ods: ["ODS 3"],
	},

	GEOGRAFIA_DO_MEDO: {
		id: "geografia_do_medo",
		name: "A Geografia do Medo",
		description:
			"Violência institucional: 51,1% das agressões vêm de agentes do estado",
		theme: "brutalidade policial, território, intimidação, estado punitivo",
		dilemmaSequence: [
			"enquadro_gcm_centro", // Enquadro abusivo no Centro
		],
		audioProfile: {
			ambience: "street_noise", // Som de sirene ao longe
			intensity: "HIGH",
			narrator: "Voz Autoritária (Ameaçadora)",
		},
		ods: ["ODS 16", "ODS 10"],
	},

	// Expanded Arcs (New Themes)
	...EXPANDED_ARCS,
};

/**
 * Detecta qual arco narrativo está ativo baseado no dilemma ID
 * @param dilemmaId - ID do dilema ativo
 * @returns StoryArc ativo ou null
 */
export function detectActiveArc(dilemmaId: string | null): StoryArc | null {
	if (!dilemmaId) return null;

	for (const arc of Object.values(STORY_ARCS)) {
		if (arc.dilemmaSequence.includes(dilemmaId)) {
			return arc;
		}
	}
	return null;
}

/**
 * Retorna progresso do jogador no arco (0-100%)
 * @param arc - Arco narrativo
 * @param dilemmaId - Dilema atual
 * @returns Percentual de progressão
 */
export function getArcProgress(arc: StoryArc, dilemmaId: string): number {
	const index = arc.dilemmaSequence.indexOf(dilemmaId);
	if (index === -1) return 0;
	return Math.round(((index + 1) / arc.dilemmaSequence.length) * 100);
}
