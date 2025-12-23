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
	prerequisite?: string;
	options: DilemmaOption[];
}

export const GAME_DILEMMAS: Dilemma[] = [
	{
		id: "hunger-emergency",
		title: "Fome Apertando",
		description:
			"O dia está acabando e sua barriga dói de fome. Você precisa encontrar algo para comer logo ou sua saúde começará a declinar rapidamente.",
		trigger: { type: "HUNGER_LOW", value: 30 },
		options: [
			{
				label: "Bom Prato Centro (R$ 1)",
				consequence:
					"O Bom Prato garante alimentação de qualidade por um preço simbólico. Você comeu bem e economizou. (Disponível apenas entre 10h e 14h)",
				effect: { hunger: 80, money: -1 },
			},
			{
				label: "Refeitório Metodista (Grátis)",
				consequence:
					"O refeitório oferece comida com dignidade e você se sente respeitado. A fila estava longa (-2h), mas valeu a pena.",
				effect: { hunger: 60, dignity: 15, timeAdvance: 2 },
			},
			{
				label: "Revirar Lixo",
				consequence:
					"A fome falou mais alto, mas você corre risco de doenças e sua dignidade foi embora.",
				effect: { hunger: 20, health: -10, sanity: -5, dignity: -20 },
			},
		],
	},
	{
		id: "barreira-samim",
		title: "A Barreira do SAMIM",
		description:
			"Você chegou ao SAMIM para o pernoite, mas está com seu carrinho de reciclagem. As regras são claras: não entra carga ou ferramentas grandes. O pernoite é sua única chance de sono seguro, mas o carrinho é seu sustento.",
		trigger: { type: "RANDOM", value: 0.3 },
		options: [
			{
				label: "Abandonar Carrinho",
				consequence:
					"Você entrou e dormiu seguro, mas ao acordar, o 'Rapa' (fiscalização) tinha levado seu carrinho que ficou na calçada. Você terá que recomeçar do zero.",
				effect: {
					health: 20,
					dignity: 5,
					workToolUpdate: { type: null, capacity: 0, riskFactor: 0 },
				},
			},
			{
				label: "Dormir na Rua",
				consequence:
					"Você preferiu proteger seu patrimônio. A noite foi fria e perigosa na calçada da Francisco Elisiário. Seu corpo dói e sua mente está exausta.",
				effect: { health: -15, sanity: -15, energy: -20, dignity: -5 },
			},
		],
	},
	{
		id: "abordagem-rapa",
		title: "Abordagem do Rapa",
		description:
			"A fiscalização urbana ('Rapa') parou ao seu lado. Eles não querem te prender, querem limpar a calçada. Seus pertences e sua ferramenta de trabalho estão em risco.",
		trigger: { type: "SOCIAL_STIGMA_HIGH", value: 60 },
		options: [
			{
				label: "Tentar Negociar",
				consequence:
					"Você implora e consegue salvar o básico, mas eles levam sua carga de recicláveis e metade da sua dignidade.",
				effect: {
					dignity: -20,
					socialStigma: 10,
					workToolUpdate: { condition: 50 }, // Perda de carga degrada condição simbolicamente
				},
			},
			{
				label: "Perder Tudo",
				consequence:
					"Eles levam seu carrinho e tudo o que estava dentro. Você fica apenas com a roupa do corpo.",
				effect: {
					dignity: -30,
					workToolUpdate: { type: null, capacity: 0, riskFactor: 0 },
				},
			},
		],
	},
	{
		id: "paradoxo-caps",
		title: "O Paradoxo do CAPS AD",
		description:
			"Você buscou ajuda no CAPS AD para lidar com a ansiedade e o vício. O atendimento é ótimo e a medicação te acalma, mas ela traz um sono profundo.",
		trigger: { type: "RANDOM", value: 0.15 },
		options: [
			{
				label: "Aceitar a Medicação",
				consequence:
					"Sua mente descansa, mas você fica 'sedado'. No sono profundo na praça, você é um alvo fácil. Sua vigilância caiu drasticamente.",
				effect: { sanity: 20, addBuff: "SEDADO_CAPS" },
			},
			{
				label: "Apenas Conversar",
				consequence:
					"O diálogo ajuda, mas a crise de abstinência e o barulho da rua dificultam o descanso.",
				effect: { sanity: 5, health: -5 },
			},
		],
	},
	{
		id: "lei-padre-julio",
		title: "Arquitetura Hostil",
		description:
			"Você encontrou uma marquise nova no Centro, mas o dono do prédio instalou pinos metálicos no chão para impedir que alguém deite. Isso fere a Lei Padre Júlio Lancellotti.",
		trigger: { type: "RANDOM", value: 0.1 },
		options: [
			{
				label: "Usar Papelão",
				consequence:
					"Você improvisa uma camada grossa de papelão sobre os pinos. É desconfortável, mas neutraliza o dano do frio.",
				effect: { energy: 10, dignity: -10, health: -5 },
			},
			{
				label: "Denunciar (Cidadania)",
				consequence:
					"Você chama um coletivo de direitos humanos. A estrutura é removida dias depois e você ganha reconhecimento por lutar pelos seus direitos.",
				effect: { dignity: 30, stabilityGap: -5, socialStigma: -10 },
			},
		],
	},
	{
		id: "bico-flanelinha",
		title: "Conflito de Território",
		description:
			"Você estava vigiando carros na Rua Barão de Jaguara quando outro vigia chega dizendo que 'aquele quarteirão tem dono'. O clima esquenta.",
		trigger: { type: "RANDOM", value: 0.2 },
		options: [
			{
				label: "Recuar (Paz)",
				consequence:
					"Você evita o confronto físico, mas perde o ponto de renda da tarde.",
				effect: { sanity: 5, money: -10 },
			},
			{
				label: "Impor Respeito",
				consequence:
					"Você garante o território, mas o estresse e a adrenalina te deixam exausto e mal visto pela vizinhança.",
				effect: { money: 30, sanity: -20, energy: -30, socialStigma: 15 },
			},
		],
	},
	{
		id: "venda-farol",
		title: "Chuva no Farol",
		description:
			"Você investiu seus últimos trocados em caixas de bala para vender no cruzamento da Aquidaban. No meio do expediente, começa um temporal típico de Campinas.",
		trigger: { type: "RANDOM", value: 0.15 },
		options: [
			{
				label: "Proteger Mercadoria",
				consequence:
					"Você se molha todo, mas salva as balas. Sua saúde sofre pelo frio intenso.",
				effect: { health: -20, dignity: -5 },
			},
			{
				label: "Vender na Chuva",
				consequence:
					"Alguns motoristas sentem pena e compram rápido, mas o papel das balas amolece e metade se perde.",
				effect: { money: 20, health: -30, sanity: -10 },
			},
		],
	},
	{
		id: "horario-ceprocamp",
		title: "Conflito Institucional",
		description:
			"Suas aulas no CEPROCAMP terminam às 22h, mas o SAMIM fecha os portões às 19h. Sem uma declaração especial, você terá que escolher entre o futuro ou o teto de hoje.",
		trigger: { type: "RANDOM", value: 0.25 },
		options: [
			{
				label: "Estudar e dormir na rua",
				consequence:
					"Você aprendeu muito, mas a noite na rua cobrou seu preço em saúde e segurança.",
				effect: { stabilityGap: -15, health: -20, sanity: -10 },
			},
			{
				label: "Garantir o abrigo",
				consequence:
					"Você dormiu seco, mas faltou à aula e corre risco de perder a vaga no curso.",
				effect: { health: 10, energy: 30, stabilityGap: 5 },
			},
		],
	},
	{
		id: "comunidade-terapeutica",
		title: "Comunidade Terapêutica",
		description:
			"Uma Kombi de uma Comunidade Terapêutica te oferece 'Teto e Comida' por 6 meses, mas a regra é abstinência total e oração obrigatória.",
		trigger: { type: "RANDOM", value: 0.05 },
		options: [
			{
				label: "Aceitar (Teto)",
				consequence:
					"Você tem comida e cama, mas perdeu sua rede de contatos na rua e sua liberdade de ir e vir.",
				effect: {
					health: 50,
					hunger: 50,
					dignity: 10,
					stabilityGap: -10,
					addBuff: "RECLUSO",
				},
			},
			{
				label: "Recusar (Liberdade)",
				consequence:
					"A liberdade da rua é dura, mas você prefere manter sua autonomia e seus contatos reais.",
				effect: { sanity: 15, dignity: 5 },
			},
		],
	},
	// --- QUEST LINE: DOCUMENTAÇÃO ---
	{
		id: "samim-entry-fail",
		title: "Barrado no SAMIM",
		description:
			"Você tenta entrar para o pernoite, mas o monitor pede seu RG. Você não o tem.",
		trigger: { type: "RANDOM", value: 0.1 },
		options: [
			{
				label: "Explicar que perdeu tudo",
				consequence:
					"Ele entende, mas sem documento ou B.O. a vaga é negada. Você passará a noite na rua. (Missão: Vá ao Poupatempo)",
				effect: { health: -10, sanity: -10 },
			},
			{
				label: "Procurar o Poupatempo amanhã",
				consequence:
					"Você aceita a derrota, mas decide que precisa regularizar sua situação. A noite será longa.",
				effect: { sanity: 5, health: -5 },
			},
		],
	},
	{
		id: "poupatempo-visit",
		title: "Fila do Poupatempo",
		description:
			"Você chega ao Poupatempo disposto a tirar o RG, mas descobre que precisa de agendamento online prévio.",
		prerequisite: "samim-entry-fail", // Só acontece se já foi barrado antes
		trigger: { type: "RANDOM", value: 0.4 }, // Alta chance se já teve o problema
		options: [
			{
				label: "Tentar implorar por um encaixe",
				consequence:
					"O segurança é firme: 'Só com agendamento'. Frustração total. Você precisa de internet.",
				effect: { sanity: -15 },
			},
			{
				label: "Ir até a Biblioteca Municipal",
				consequence:
					"Alguém na fila diz que lá tem internet grátis para agendar. É sua melhor chance.",
				effect: { stabilityGap: -2 },
			},
		],
	},
	{
		id: "library-internet",
		title: "Ponto Sagrado: Biblioteca",
		description:
			"Na Biblioteca Municipal (perto da prefeitura), você consegue usar o computador por 30 min.",
		prerequisite: "poupatempo-visit", // Só acontece se já foi ao poupatempo
		trigger: { type: "RANDOM", value: 0.5 },
		options: [
			{
				label: "Agendar RG no Poupatempo",
				consequence:
					"Missão cumprida! Agora é só esperar o dia marcado. Cidadania +10. (Você obteve o agendamento)",
				effect: { stabilityGap: -10, sanity: 10, addBuff: "AGENDAMENTO_RG" },
			},
			{
				label: "Pesquisar cursos no CEPROCAMP",
				consequence:
					"Você vê uma chance de sair da rua através da capacitação, mas esquece do RG.",
				effect: { sanity: 15, dignity: 10 },
			},
		],
	},
];
