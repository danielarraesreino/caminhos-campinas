import type { GameState } from "@/contexts/GameContext";

export type TriggerType =
	| "HUNGER_LOW"
	| "HYGIENE_LOW"
	| "RANDOM"
	| "SOCIAL_STIGMA_HIGH";

export interface DilemmaOption {
	label: string;
	consequence: string;
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
	};
	audioId?: string;
	ambience?: string;
	soundEffect?: string;
	prerequisite?: string;
	options: DilemmaOption[];
}

// --- REALITY INJECTED DILEMMAS (SOCIOLOGIA_BRASILEIRA_E_CAMPINAS) ---
export const GAME_DILEMMAS: Dilemma[] = [
	// 1. SOBREVIVÊNCIA BÁSICA
	{
		id: "hunger-emergency",
		title: "Fome Apertando",
		description:
			"O dia está acabando e sua barriga dói de fome. Você precisa encontrar algo para comer logo ou sua saúde começará a declinar rapidamente.",
		trigger: { type: "HUNGER_LOW", value: 30 },
		ambience: "rain_heavy",
		options: [
			{
				label: "Bom Prato Centro (R$ 1)",
				consequence:
					"O Bom Prato garante alimentação de qualidade por um preço simbólico. Você comeu bem e economizou. (Disponível apenas entre 10h e 14h)",
				effect: { hunger: 80, money: -1 },
				telemetryTag: {
					ods: "ODS_2_FOME",
					action: "BUSCA_SERVICO_PUBLICO",
					outcome: "SUCESSO",
				},
			},
			{
				label: "Refeitório Metodista (Grátis)",
				consequence:
					"O Refeitório Metodista oferece comida com dignidade e você se sente respeitado. A fila estava longa (-2h), mas valeu a pena pela conversa e segurança.",
				effect: { hunger: 60, dignity: 15, timeAdvance: 2 },
				telemetryTag: {
					ods: "ODS_2_FOME",
					action: "BUSCA_REDE_APOIO",
					outcome: "SUCESSO_DIGNIDADE",
				},
			},
			{
				label: "Revirar Lixo",
				consequence:
					"A fome falou mais alto. O risco de infecção é alto e a vergonha é inevitável.",
				effect: { hunger: 20, health: -15, sanity: -5, dignity: -25 },
				telemetryTag: {
					ods: "ODS_2_FOME",
					action: "BUSCA_INFORMAL_RISCO",
					outcome: "DEGRADACAO",
				},
			},
		],
	},
	{
		id: "hygiene-barrier",
		title: "A Barreira Invisível da Higiene",
		description:
			"Você tenta entrar no mercado para comprar água, mas o segurança bloqueia sua entrada apenas com o olhar. 'Aqui não', ele diz. Sua aparência/higiene (Status Crítico) está impedindo o acesso.",
		trigger: { type: "HYGIENE_LOW", value: 15 },
		options: [
			{
				label: "Ir ao Centro Pop (Banho)",
				consequence:
					"Você caminha até o Centro Pop. O banho renova não apenas o corpo, mas a alma. Você se sente humano novamente.",
				effect: { hygiene: 90, sanity: 10, dignity: 10, timeAdvance: 2 },
				telemetryTag: {
					ods: "ODS_6_SANEAMENTO",
					action: "BUSCA_SERVICO_PUBLICO",
					outcome: "SUCESSO",
				},
			},
			{
				label: "Discutir com Segurança",
				consequence:
					"A discussão chama a atenção da polícia. Você é humilhado e expulso do local, aumentando seu Estigma Social.",
				effect: { socialStigma: 15, sanity: -10, dignity: -10 },
				telemetryTag: {
					ods: "ODS_10_DESIGUALDADE",
					action: "CONFLITO_SOCIAL",
					outcome: "ESTIGMA_AUMENTADO",
				},
			},
		],
	},

	// 2. DILEMAS DO CARRINHO (A FERRAMENTA DE TRABALHO)
	{
		id: "barreira-samim",
		title: "A Barreira do SAMIM",
		description:
			"Você chegou ao SAMIM para o pernoite, mas está com seu carrinho de reciclagem. As regras são claras: não é permitida a entrada de 'objetos volumosos'.",
		trigger: { type: "RANDOM", value: 0.3 },
		options: [
			{
				label: "Abandonar Carrinho na Rua",
				consequence:
					"Você entrou e dormiu seguro. Ao acordar, o Caminhão do Rapa havia passado. Sua ferramenta de trabalho e seus pertences foram apreendidos como 'lixo'.",
				effect: {
					health: 20,
					dignity: 5,
					workToolUpdate: { type: null, capacity: 0, riskFactor: 0 },
					sanity: -20,
				},
				telemetryTag: {
					ods: "ODS_11_CIDADES",
					action: "ACEITE_INSTITUCIONAL",
					outcome: "PERDA_BENS",
				},
			},
			{
				label: "Dormir na Rua (Defender o Carrinho)",
				consequence:
					"Você escolheu proteger seu sustento. A noite na calçada foi fria e tensa, vigilância constante. Você manteve o carrinho, mas sua saúde cobrou o preço.",
				effect: { health: -15, sanity: -15, energy: -30, dignity: -5 },
				telemetryTag: {
					ods: "ODS_1_POBREZA",
					action: "RECUSA_INSTITUCIONAL",
					outcome: "PRESERVACAO_TRABALHO",
				},
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
