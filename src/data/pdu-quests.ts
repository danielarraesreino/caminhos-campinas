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
	SOCIAL: {
		objective: "SOCIAL",
		title: "Cidadania Básica",
		steps: [
			{
				id: "cadastro_unico",
				title: "Cadastro Único",
				description:
					"Inscreva-se no CadÚnico no CRAS ou Centro Pop para acessar benefícios.",
				requiredAction: "LOCATION",
				target: "centro_pop",
				dilemmaId: "pdu_dilemma_cadunico",
				nextStepId: "retirada_documentos",
			},
			{
				id: "retirada_documentos",
				title: "Documentação Civil",
				description: "Garanta que seu RG e CPF estejam em dia.",
				requiredAction: "ITEM",
				target: "rg_cpf", // Item ID
				nextStepId: "beneficio_eventual",
			},
		],
	},
	SAUDE: {
		objective: "SAUDE",
		title: "Cuidado Integral",
		steps: [
			{
				id: "consultorio_rua",
				title: "Consultório na Rua",
				description: "Realize um check-up com a equipe do Consultório na Rua.",
				requiredAction: "INTERACTION",
				target: "consultorio_rua_van",
				dilemmaId: "pdu_dilemma_consultorio",
				nextStepId: "tratamento_dental",
			},
		],
	},
	EDUCACAO: {
		objective: "EDUCACAO",
		title: "Formação e Conhecimento",
		steps: [
			{
				id: "visitar_educacao",
				title: "Explorar Educação",
				description: "Acesse o portal de educação para ver oportunidades de estudo.",
				requiredAction: "INTERACTION",
				target: "view_education_portal",
				nextStepId: "concluir_curso_direitos",
			},
			{
				id: "concluir_curso_direitos",
				title: "Curso: Direitos Humanos",
				description:
					"Complete o módulo de Direitos Humanos na seção de Educação.",
				requiredAction: "INTERACTION",
				target: "curso_direitos", // Triggered via /educacao page
				nextStepId: "visitar_cursos_profissionalizantes",
			},
			{
				id: "visitar_cursos_profissionalizantes",
				title: "Cursos Profissionalizantes",
				description: "Conheça as opções de cursos para qualificação profissional.",
				requiredAction: "INTERACTION",
				target: "view_courses_list",
				nextStepId: "matricula_eja",
			},
		],
	},
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
				target: "poupatempo_centro",
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
				target: 80,
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
	FINANCAS: {
		objective: "FINANCAS",
		title: "Organização Financeira",
		steps: [
			{
				id: "abrir_conta",
				title: "Bancarização",
				description: "Abra uma conta social digital para receber pagamentos.",
				requiredAction: "INTERACTION",
				dilemmaId: "pdu_dilemma_conta_bancaria",
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
	CONVIVENCIA: {
		objective: "CONVIVENCIA",
		title: "Regras de Convivência",
		steps: [
			{
				id: "respeito_horario",
				title: "Horário de Entrada",
				description: "Chegue no Abrigo/SAMIM antes das 19h por 3 dias seguidos.",
				requiredAction: "STAT",
				target: 3, // Custom counter needed logic side
			},
		],
	},
	MORADIA: {
		objective: "MORADIA",
		title: "Habitação Primeiro",
		steps: [
			{
				id: "piloto_housing",
				title: "Programa Housing First",
				description: "Inscreva-se no projeto piloto de moradia assistida.",
				requiredAction: "LOCATION",
				target: "cohab_atendimento",
			},
		],
	},
	CIDADANIA: {
		objective: "CIDADANIA",
		title: "Acesso à Justiça",
		steps: [
			{
				id: "defensoria",
				title: "Defensoria Pública",
				description: "Busque apoio jurídico para resolver pendências legais.",
				requiredAction: "LOCATION",
				target: "defensoria_publica",
			},
		],
	},
};
