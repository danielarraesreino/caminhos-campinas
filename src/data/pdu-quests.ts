import type { PDUObjective } from "@/contexts/GameContext";

export interface PDUQuestStep {
	id: string;
	title: string;
	description: string;
	requiredAction: "LOCATION" | "ITEM" | "STAT" | "INTERACTION";
	target?: string | number; // Location ID or Stat Value
	dilemmaId?: string; // Trigger specific dilemma
	nextStepId?: string;
}

export interface PDUChain {
	objective: PDUObjective;
	title: string;
	steps: PDUQuestStep[];
}

export const PDU_QUESTS: Record<PDUObjective, PDUChain> = {
	TRABALHO: {
		objective: "TRABALHO",
		title: "Caminho da Autonomia",
		steps: [
			{
				id: "entrevista_inicial",
				title: "Pactuação do Plano",
				description:
					"Você definiu que quer trabalhar. Primeiro passo: saber quem você é para o Estado.",
				requiredAction: "INTERACTION",
				dilemmaId: "pdu_intro_trabalho",
				nextStepId: "documentacao_rg",
			},
			{
				id: "documentacao_rg",
				title: "Resgate da Identidade",
				description:
					"Sem RG não existe emprego. Vá ao Poupatempo ou Casa da Cidadania.",
				requiredAction: "LOCATION",
				target: "poupatempo_centro", // Location ID to be mapped
				dilemmaId: "pdu_dilemma_rg_fee",
				nextStepId: "comprovante_residencia",
			},
			{
				id: "comprovante_residencia",
				title: "Endereço Institucional",
				description:
					"Vagas pedem endereço. O Centro Pop pode fornecer uma declaração provisória.",
				requiredAction: "LOCATION",
				target: "centro_pop",
				dilemmaId: "pdu_dilemma_comprovante",
				nextStepId: "higiene_pessoal",
			},
			{
				id: "higiene_pessoal",
				title: "Aparência Profissional",
				description:
					"Para a entrevista, você precisa estar apresentável. Mantenha Higiene > 80.",
				requiredAction: "STAT",
				target: 80, // Hygiene Level
				nextStepId: "cadastro_cpat",
			},
			{
				id: "cadastro_cpat",
				title: "Inscrição no CPAT",
				description:
					"Cadastre seu currículo no CPAT (Centro Público de Apoio ao Trabalhador).",
				requiredAction: "LOCATION",
				target: "cpat_centro",
				dilemmaId: "pdu_dilemma_job_interview",
			},
		],
	},
	FAMILIA: {
		objective: "FAMILIA",
		title: "Reconstrução de Vínculos",
		steps: [
			{
				id: "entrevista_inicial",
				title: "Pactuação do Plano",
				description:
					"Você quer voltar para casa. Vamos localizar seus parentes.",
				requiredAction: "INTERACTION",
				dilemmaId: "pdu_intro_familia",
				nextStepId: "busca_ativa_parentes",
			},
			{
				id: "busca_ativa_parentes",
				title: "Investigação Social",
				description:
					"Forneça nomes e cidades antigas para a equipe técnica buscar.",
				requiredAction: "INTERACTION",
				dilemmaId: "pdu_dilemma_search_phone",
				nextStepId: "contato_telefonico",
			},
		],
	},
	SAUDE: { objective: "SAUDE", title: "Cuidado Integral", steps: [] },
	MORADIA: { objective: "MORADIA", title: "Habitação Primeiro", steps: [] },
};
