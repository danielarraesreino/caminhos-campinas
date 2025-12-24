import type { Dilemma } from "./dilemmas";

export const REAL_DILEMMAS: Dilemma[] = [
	{
		id: "dilema_candido_trabalho",
		title: "A Escolha da Oficina",
		description:
			"Você está na Casa das Oficinas. O coordenador explica que, para receber a 'bolsa-oficina' (dinheiro), você precisa ter assiduidade e responsabilidade. O trabalho é em grupo e exige convivência.",
		trigger: { type: "LOCATION", value: 0.1, locationId: "casa_oficinas" },
		options: [
			{
				label: "Entrar na Oficina de Mosaico",
				consequence:
					"Você se comprometeu. O ambiente é acolhedor e democrático. Você não recebe dinheiro hoje, mas garantiu uma vaga que paga no final do mês.",
				effect: { sanity: 15, stabilityGap: -10, socialStigma: -5 },
			},
			{
				label: "Desistir (Preciso de dinheiro hoje)",
				consequence:
					"A bolsa só vem com o tempo. Você volta para o centro para tentar ganhar algum trocado rápido vigiando carros, mas perdeu a chance de vínculo.",
				effect: { money: 5, sanity: -5, energy: -10 },
			},
		],
	},
	{
		id: "dilema_cras_documento",
		title: "O Bloqueio do CadÚnico",
		description:
			"No CRAS, a assistente social informa que seu Bolsa Família foi bloqueado por 'averiguação cadastral'. Você precisa provar que mora sozinho, mas não tem comprovante de endereço.",
		trigger: { type: "LOCATION", value: 0.1, locationId: "cras_anhumas" },
		options: [
			{
				label: "Pedir Declaração de Situação de Rua",
				consequence:
					"Você aprendeu que a declaração do Centro Pop ou do Posto de Saúde serve. É um trâmite burocrático, mas destrava seu benefício.",
				effect: { dignity: 10, money: 0 }, // Desbloqueia quest futura
			},
			{
				label: "Discutir com a atendente",
				consequence:
					"O estresse tomou conta. Você saiu sem resolver e com o risco de perder o benefício de vez por falta de atualização.",
				effect: { sanity: -10, socialStigma: 5 },
			},
		],
	},
	{
		id: "dilema_consultorio_rua",
		title: "Cuidado sem Julgamento",
		description:
			"A van do Consultório na Rua parou na praça. Você tem um ferimento no pé que não cicatriza. Você teme que eles te internem à força se virem que você usou substâncias.",
		trigger: {
			type: "LOCATION",
			value: 0.1,
			locationId: "consultorio_rua_leste",
		},
		options: [
			{
				label: "Aceitar o curativo (Redução de Danos)",
				consequence:
					"A enfermeira fez o curativo ali mesmo. Ninguém te julgou ou exigiu abstinência. Você recebeu insumos e orientação.",
				effect: { health: 25, sanity: 10 },
			},
			{
				label: "Esconder-se",
				consequence:
					"O medo falou mais alto. A ferida continua aberta e sua mobilidade diminui, dificultando a coleta de recicláveis.",
				effect: { health: -15, energy: -10 },
			},
		],
	},
];
