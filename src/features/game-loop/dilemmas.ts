import type { GameState } from "@/contexts/GameContext";
import { REAL_DILEMMAS } from "./dilemmas-real";

export type TriggerType =
	| "HUNGER_LOW"
	| "HYGIENE_LOW"
	| "RANDOM"
	| "SOCIAL_STIGMA_HIGH"
	| "LOCATION"
	| "STATUS";

export interface DilemmaOption {
	label: string;
	consequence: string;
	consequence_failure?: string;
	risk?: number; // 0-100
	effect: Partial<
		Omit<
			GameState,
			| "inventory"
			| "day"
			| "time"
			| "resolvedDilemmas"
			| "activeDilemmaId"
			| "activeBuffs"
			| "workTool"
			| "criticalHealth"
		>
	> & {
		inventoryAdd?: string;
		addBuff?: string;
		removeBuff?: string;
		workToolUpdate?: Partial<GameState["workTool"]>;
		timeAdvance?: number;
		// Special handling for inventory clear or specific changes
		clearInventory?: boolean;
	};
	effect_failure?: Partial<
		Omit<
			GameState,
			| "inventory"
			| "day"
			| "time"
			| "resolvedDilemmas"
			| "activeDilemmaId"
			| "activeBuffs"
			| "workTool"
			| "criticalHealth"
		>
	> & {
		inventoryAdd?: string;
		addBuff?: string;
		removeBuff?: string;
		workToolUpdate?: Partial<GameState["workTool"]>;
		timeAdvance?: number;
		clearInventory?: boolean;
	};
	telemetryTag?: {
		ods: string;
		action: string;
		outcome: string;
	};
}

export interface Dilemma {
	id: string;
	title: string;
	description: string;
	trigger: {
		type: TriggerType;
		value: number;
		locationId?: string;
		statusCondition?: Record<string, number>;
	};
	tags?: string[];
	location_trigger?: {
		lat: number;
		lng: number;
		radius: number; // em metros
	};
	audioId?: string;
	ambience?: string;
	soundEffect?: string;
	prerequisite?: string;
	options: DilemmaOption[];
}

// --- REALITY INJECTED DILEMMAS (SOCIOLOGIA_BRASILEIRA_E_CAMPINAS) ---
export const GAME_DILEMMAS: Dilemma[] = [
	// MODELO 1: FOME (Refeitório Metodista vs Bom Prato)
	{
		id: "fome_centro_01",
		title: "A Escolha do Alimento",
		description:
			"Sua barriga dói. Você tem pouco dinheiro. O Bom Prato tem fila mas é garantido por R$1. O Refeitório Metodista é de graça, mas exige cadastro e tem horário rígido.",
		trigger: { type: "HUNGER_LOW", value: 30 },
		tags: ["fome", "comida", "almoço", "jantar", "alimentação"],
		location_trigger: { lat: -22.9075, lng: -47.0595, radius: 2000 },
		ambience: "rain_heavy",
		options: [
			{
				label: "Ir ao Bom Prato (R$ 1,00)",
				consequence:
					"Você comeu bem. O purê estava quente. Gastou seu dinheiro, mas garantiu a energia do dia.",
				consequence_failure:
					"A fila estava enorme e a comida acabou bem na sua vez. Você perdeu tempo na fila.",
				risk: 10,
				effect: { hunger: 100, money: -1, energy: 20 },
				effect_failure: { energy: -10, timeAdvance: 1 },
			},
			{
				label: "Tentar o Refeitório Metodista (Grátis)",
				consequence:
					"Eles te acolheram bem. Comer sentado à mesa, com talheres de metal, recuperou sua dignidade.",
				consequence_failure:
					"Você chegou atrasado. O portão fechou às 13h em ponto. Só restou a fome.",
				risk: 30,
				effect: { hunger: 100, dignity: 15, money: 0 },
			},
		],
	},
	// MODELO 2: SAÚDE (Consultório na Rua)
	{
		id: "saude_vicio_01",
		title: "A Dor e o Medo",
		description:
			"Você tem uma ferida na perna que não cicatriza. O Consultório na Rua (a van do SUS) estacionou na praça. Você sabe que eles não exigem abstinência, mas tem medo de ser internado à força.",
		trigger: { type: "RANDOM", value: 0.2 },
		tags: ["dor", "ferida", "abstinencia", "médico", "ajuda", "saude"],
		location_trigger: { lat: -22.9085, lng: -47.0585, radius: 5000 }, // Mobile roughly center
		options: [
			{
				label: "Aproximar-se da Van",
				risk: 0,
				consequence:
					"A enfermeira fez o curativo ali mesmo na calçada. Ninguém te julgou. Você ganhou um kit de higiene.",
				effect: { health: 20, sanity: 10, hygiene: 30 },
			},
			{
				label: "Esconder-se e aguentar a dor",
				risk: 80,
				consequence: "Você evitou o médico, mas a dor continua.",
				consequence_failure:
					"A infecção piorou drasticamente. A dor agora impede você de caminhar para buscar reciclagem.",
				effect: { health: -5 },
				effect_failure: { health: -20, energy: -30 },
			},
		],
	},
	// MODELO 3: ABRIGO (SAMIM vs Carrinho)
	{
		id: "abrigo_samim_01",
		title: "A Barreira do SAMIM",
		description:
			"A noite caiu e está frio. Você está na porta do SAMIM. Você tem seu carrinho de reciclagem cheio (R$ 40 em material). A regra é clara: o carrinho não entra.",
		trigger: { type: "RANDOM", value: 0.3 },
		tags: ["samim", "albergue", "dormir", "carrinho", "reciclagem", "barreira"],
		location_trigger: { lat: -22.9038, lng: -47.0652, radius: 1000 },
		options: [
			{
				label: "Entrar e abandonar o carrinho",
				risk: 100, // Perda certa (converted from user input)
				consequence: "N/A - 100% Risk",
				consequence_failure:
					"Você dormiu no quente e tomou banho. Mas ao sair, seu carrinho sumiu. Você está limpo, mas falido.",
				effect: { energy: 100, hygiene: 100, money: 0 }, // Unreachable?
				effect_failure: {
					energy: 100,
					hygiene: 100,
					money: 0,
					clearInventory: true,
					workToolUpdate: { type: null },
				},
			},
			{
				label: "Dormir na rua vigiando o carrinho",
				risk: 50,
				consequence:
					"Foi uma noite terrível, acordando a cada hora. Mas seu sustento está garantido.",
				consequence_failure:
					"Você cochilou e alguém levou seus papelões. Agora você está com frio, cansado e sem dinheiro.",
				effect: { energy: 40, health: -10, sanity: -10 },
				effect_failure: { energy: 30, health: -15, sanity: -20, money: 0 },
			},
		],
	},
	{
		id: "barreira-animal",
		title: "O Dilema do Companheiro",
		description:
			"Você tem um cachorro que é sua única família e proteção na rua. Tentou entrar no abrigo, mas animais são proibidos.",
		trigger: { type: "RANDOM", value: 0.2 },
		options: [
			{
				label: "Abandonar o Cachorro",
				consequence:
					"Você deixa seu amigo para trás para dormir em uma cama. A culpa te consome a noite toda. Você perdeu sua humanidade.",
				effect: { sanity: -50, dignity: -30, health: 10 },
			},
			{
				label: "Ficar fora com ele",
				consequence:
					"Vocês dormem juntos sob a marquise. O cachorro te aquece e alerta sobre perigos. Você dorme mal, mas seu coração está em paz.",
				effect: {
					sanity: 10,
					health: -10,
					energy: -10,
					addBuff: "PROTECAO_CANINA",
				},
			},
		],
	},
	{
		id: "abordagem-rapa",
		title: "O Rapa Chegou",
		description:
			"Fiscalização Urbana. Eles alegam que seu carrinho está 'obstruindo o passeio público' e ameaçam apreensão imediata baseada no Código de Posturas.",
		trigger: { type: "SOCIAL_STIGMA_HIGH", value: 50 },
		options: [
			{
				label: "Tentar Dialogar",
				consequence:
					"Você argumenta que é trabalhador da reciclagem. Eles permitem que fique com os pertences pessoais, mas levam o material coletado (dinheiro do dia).",
				effect: {
					dignity: -10,
					inventoryAdd: "NOTIFICACAO_FISCAL",
					money: -100, // Perde o valor do dia
				},
			},
			{
				label: "Resistir (Conflito)",
				consequence:
					"A GCM é chamada. Você perde o carrinho, a carga e é levado para averiguação. Perda total.",
				effect: {
					dignity: -40,
					workToolUpdate: { type: null, capacity: 0, riskFactor: 0 },
					health: -10,
					socialStigma: 20,
				},
			},
		],
	},

	// 3. SAÚDE & REDUÇÃO DE DANOS
	{
		id: "paradoxo-caps",
		title: "O Paradoxo do CAPS AD",
		description:
			"Você buscou o CAPS AD. O atendimento foi humanizado e sem julgamentos, mas a medicação para ansiedade/abstinência é forte.",
		trigger: { type: "RANDOM", value: 0.15 },
		options: [
			{
				label: "Tomar a Medicação",
				consequence:
					"A ansiedade some, mas a sonolência é pesada. Dormir na rua 'dopado' é um risco extremo de ter seus tênis ou pertences roubados (Vigilância Zero).",
				effect: { sanity: 30, addBuff: "SEDADO_CAPS" },
			},
			{
				label: "Participar só da Oficina",
				consequence:
					"Você conversa, faz arte, se conecta. Ajuda, mas a crise de abstinência física continua batendo.",
				effect: { sanity: 10, health: -5 },
			},
		],
	},

	// 4. QUEST LINE: BUROCRACIA DO RG (CICLO DO "NADA CONSTA")
	{
		id: "samim-entry-fail",
		title: "Barrado no SAMIM (Documento)",
		description:
			"Para cadastrar o pernoite, exigem RG original ou B.O. recente. Você não tem nenhum dos dois.",
		trigger: { type: "RANDOM", value: 0.1 },
		options: [
			{
				label: "Explicar situação de rua",
				consequence:
					"A burocracia é implacável: 'Sem documento, sem cadastro'. Você é orientado a ir ao Poupatempo, mas hoje dorme na rua.",
				effect: { health: -10, sanity: -10, addBuff: "SEM_DOCUMENTO" },
			},
			{
				label: "Tentar uma Casa de Passagem",
				consequence:
					"A Casa de Passagem Cáritas é mais flexível e foca na retomada de documentos. Você consegue entrar, mas é longe.",
				effect: { energy: -20, hygiene: 10, stabilityGap: -5 },
			},
		],
	},
	{
		id: "poupatempo-paradox",
		title: "O Paradoxo do Endereço",
		description:
			"No Poupatempo, você consegue isenção da taxa, mas o atendente pede um 'Comprovante de Residência' para emitir o RG. Você mora na rua.",
		prerequisite: "samim-entry-fail",
		trigger: { type: "RANDOM", value: 0.5 },
		options: [
			{
				label: "Dar o endereço do Abrigo",
				consequence:
					"Se você tiver o cartão do SAMIM ou Centro Pop, isso funciona! Caso contrário, o sistema trava. (Dica: Vá ao Centro Pop pegar uma declaração)",
				effect: { sanity: -5 },
			},
			{
				label: "Declarar 'Morador de Rua'",
				consequence:
					"Existe um formulário específico para isso, mas nem todo atendente sabe. Você precisa insistir e citar a lei. Cidadania +10 se conseguir.",
				effect: { dignity: 10, stabilityGap: -5, sanity: -5 },
			},
		],
	},
	{
		id: "lei-padre-julio",
		title: "Arquitetura Hostil",
		description:
			"Pedras pontiagudas foram cimentadas embaixo do viaduto onde você costumava ficar. Isso é ilegal pela Lei Padre Júlio Lancellotti, mas está lá.",
		trigger: { type: "RANDOM", value: 0.1 },
		options: [
			{
				label: "Dormir em cima (Papelão)",
				consequence:
					"Você amontoa papelão. As pedras ainda machucam as costas. A noite é péssima.",
				effect: { energy: -20, health: -10, dignity: -15 },
			},
			{
				label: "Denunciar no app da Prefeitura",
				consequence:
					"Você tira foto e denuncia. Não resolve sua noite (você tem que ir para outro lugar), mas você lutou contra a invisibilidade.",
				effect: { dignity: 20, energy: -10, socialStigma: -5 },
			},
		],
	},
	// 5. ODS 18 - RACISMO INSTITUCIONAL (CENSO 2024: 67,8% Pretos/Pardos)
	{
		id: "police-stop",
		title: "Procedimento Padrão",
		description:
			"Uma viatura da Guarda Municipal para ao seu lado. O agente desce com a mão no coldre. 'Mãos na cabeça, encosta na parede'. Você sente os olhares dos passantes.",
		trigger: { type: "RANDOM", value: 0.1 }, // 10% chance
		tags: ["policia", "guarda", "gcm", "segurança", "enquadro", "abordagem"],
		audioId: "siren", // Assuming siren sfx exists or just silent tension
		options: [
			{
				label: "Apresentar RG (Se tiver)",
				consequence:
					"Você mostra o documento. O agente checa os antecedentes. 'Tá limpo, circula'. Você é liberado, mas a humilhação fica.",
				effect: {
					dignity: -5,
					sanity: -5,
				},
				telemetryTag: {
					ods: "ODS_18",
					action: "ENQUADRO_COM_DOC",
					outcome: "LIBERADO",
				},
			},
			{
				label: "Argumentar Direitos",
				consequence:
					"Você questiona a abordagem. O agente não gosta. 'Tá querendo ensinar meu trabalho?'. Você é revistado com agressividade. Seus pertences são espalhados no chão.",
				effect: {
					dignity: -20,
					health: -5,
					sanity: -15,
					socialStigma: 10,
				},
				telemetryTag: {
					ods: "ODS_18_RACISMO_INSTITUCIONAL",
					action: "RESISTENCIA_CIVIL",
					outcome: "OPRESSAO",
				},
			},
		],
	},
];

export const ALL_DILEMMAS: Dilemma[] = [...GAME_DILEMMAS, ...REAL_DILEMMAS];
