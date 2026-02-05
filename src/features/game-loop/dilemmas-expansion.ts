import type { Dilemma } from "./dilemma-types";

export const EXPANSION_DILEMMAS: Dilemma[] = [
	// --- SAÚDE: ODONTO E ACESSO ---
	{
		id: "dor_dente_abscesso",
		title: "A Dor que Palpita",
		description:
			"Um dente quebrado inflamou. Seu rosto está inchado e você não consegue comer. A dor é insuportável e lateja na cabeça inteira.",
		trigger: { type: "STATUS", value: 0.1, statusCondition: { health: 40 } },
		aspect: "HEALTH",
		intensity: "HIGH",
		tags: ["saúde", "dor"],
		options: [
			{
				label: "Buscar CEO (Centro de Especialidades)",
				consequence:
					"Você conseguiu atendimento de urgência. O alívio foi imediato, mas você perdeu o dia todo na fila.",
				effect: { health: 20, sanity: 10, energy: -20, timeAdvance: 6 },
			},
			{
				label: "Automedicação com cachaça",
				consequence:
					"O álcool anestesiou a dor por um tempo, mas a infecção piorou. Agora você tem febre.",
				effect: { health: -20, sanity: 5, money: -5, addBuff: "FEBRE" },
			},
		],
	},

	// --- EMPREGO: O ESTIGMA DO ENDEREÇO ---
	{
		id: "entrevista_restaurante",
		title: "A Vaga na Copa",
		description:
			"Um restaurante precisa de lavador de pratos. O gerente gostou de você, mas pediu comprovante de residência para o registro.",
		trigger: { type: "LOCATION", value: 0.15, locationId: "cambui_centro" },
		aspect: "WORK",
		intensity: "MEDIUM",
		tags: ["trabalho", "documentação"],
		options: [
			{
				label: "Dizer a verdade (Moro na rua)",
				consequence:
					"O sorriso do gerente sumiu. 'Ah, entendi. A gente te liga.' Você sabe que nunca vão ligar.",
				effect: { dignity: -20, sanity: -10, socialStigma: 10 },
			},
			{
				label: "Mentir endereço (risco)",
				consequence:
					"Você deu um endereço falso. Começa amanhã, mas o medo de ser descoberto te consome.",
				effect: { money: 50, sanity: -5, timeAdvance: 8 }, // Adiantamento
			},
		],
	},

	// --- CLIMA: ONDA DE FRIO ---
	{
		id: "onda_frio_subzero",
		title: "Alerta Defesa Civil",
		description:
			"A temperatura vai cair para 4°C esta noite. A Operação Inverno abriu vagas extras, mas são longe do centro.",
		trigger: {
			type: "STATUS",
			value: 1.0,
			statusCondition: { temperature: 5 },
		},
		aspect: "SHELTER",
		intensity: "HIGH",
		tags: ["clima", "sobrevivência"],
		options: [
			{
				label: "Caminhar até o abrigo extra",
				consequence:
					"Foram 2 horas de caminhada. Você chegou exausto, mas dormiu protegido e ganhou sopa.",
				effect: { energy: -40, health: 10, hunger: -20 },
			},
			{
				label: "Ficar e usar cobertores",
				consequence:
					"Mesmo com doações, o frio penetrou nos ossos. Você não sente os dedos dos pés.",
				effect: { health: -30, energy: -10, sanity: -10 },
			},
		],
	},

	// --- SOCIAL: O OLHAR DO OUTRO ---
	{
		id: "restaurante_sobras",
		title: "O Pedaço de Pizza",
		description:
			"Você vê um casal deixando metade de uma pizza na mesa da calçada. O garçom ainda não recolheu. A fome é grande.",
		trigger: { type: "STATUS", value: 0.2, statusCondition: { hunger: 30 } },
		aspect: "FOOD",
		intensity: "LOW",
		tags: ["fome", "estigma"],
		options: [
			{
				label: "Pegar rápido e sair",
				consequence:
					"Você pegou. O garçom gritou 'Ei, sai pra lá!', mas a pizza estava quente e deliciosa.",
				effect: { hunger: -30, socialStigma: 10, dignity: -5 },
			},
			{
				label: "Pedir ao garçom",
				consequence:
					"Ele disse que não pode dar restos aos clientes, regras da casa. Jogou no lixo na sua frente.",
				effect: { hunger: 0, sanity: -20, dignity: -20 },
			},
		],
	},

	// --- HIGIENE: BANHO PAGO ---
	{
		id: "banho_rodoviaria",
		title: "O Custo da Limpeza",
		description:
			"Você está se sentindo muito sujo. O banho na rodoviária custa R$ 8,00, mas é quente e privado.",
		trigger: { type: "STATUS", value: 0.2, statusCondition: { hygiene: 20 } },
		aspect: "HYGIENE",
		intensity: "MEDIUM",
		tags: ["higiene", "dinheiro"],
		options: [
			{
				label: "Pagar pelo banho",
				consequence:
					"Foi o melhor banho do mês. Você se sente humano de novo, mesmo com o bolso vazio.",
				effect: { hygiene: 100, sanity: 20, money: -8, dignity: 10 },
			},
			{
				label: "Lavar-se na pia pública",
				consequence:
					"Você se lavou como deu. O segurança ficou te vigiando o tempo todo.",
				effect: { hygiene: 30, dignity: -10, socialStigma: 5 },
			},
		],
	},

	// --- SEGURANÇA: BRIGA DE RUA ---
	{
		id: "briga_territorio",
		title: "Disputa de Espaço",
		description:
			"Outro morador diz que aquela marquise é dele há anos. Ele parece bêbado e agressivo.",
		trigger: { type: "RANDOM", value: 0.05 },
		aspect: "SECURITY",
		intensity: "HIGH",
		tags: ["violência", "território"],
		options: [
			{
				label: "Sair e buscar outro lugar",
				consequence:
					"Você evitou a briga, mas agora está vagando no meio da noite sem rumo.",
				effect: { energy: -20, sanity: -5, security: -10 },
			},
			{
				label: "Defender seu espaço",
				consequence:
					"Houve empurrões. Ele caiu e dormiu. Você ficou, mas dormiu com um olho aberto.",
				effect: { energy: -10, sanity: -15 },
				risk: 20,
			},
		],
	},

	// --- MULHER: ASSÉDIO (Condicional de Gênero) ---
	{
		id: "assedio_noturno",
		title: "O Carro que Para",
		description:
			"Um carro parou perto de você. O motorista baixou o vidro e fez uma proposta indecente em troca de dinheiro.",
		trigger: { type: "RANDOM", value: 0.1 },
		conditions: { gender: "feminino" },
		aspect: "SECURITY",
		intensity: "HIGH",
		tags: ["gênero", "violência"],
		options: [
			{
				label: "Ignorar e se afastar",
				consequence:
					"Ele xingou e acelerou. O medo ficou pulsando no seu peito.",
				effect: { sanity: -10, dignity: -5 },
			},
			{
				label: "Gritar por ajuda",
				consequence:
					"Pessoas olharam e ele fugiu. Você se sentiu exposta, mas segura.",
				effect: { sanity: -5, socialStigma: 5 },
			},
		],
	},

	// --- DOCUMENTOS: 2ª VIA GRATUITA ---
	{
		id: "isencao_cartorio",
		title: "Certidão de Nascimento",
		description:
			"Você descobriu que pode tirar a 2ª via da certidão de graça no cartório. Mas precisa estar apresentável.",
		trigger: { type: "LOCATION", value: 0.1, locationId: "centro_cartorio" },
		aspect: "BUREAUCRACY",
		intensity: "LOW",
		tags: ["documentos", "direitos"],
		options: [
			{
				label: "Ir como está",
				consequence: "O segurança barrou sua entrada. 'Não pode entrar assim'.",
				effect: { dignity: -20, sanity: -10 },
			},
			{
				label: "Passar no Centro Pop antes",
				consequence:
					"Você tomou banho e trocou de roupa. Foi atendido e o documento chega em 15 dias.",
				effect: { timeAdvance: 4, dignity: 10, addBuff: "PROTOCOL_CERTIDAO" },
			},
		],
	},

	// --- LEISER: BIBLIOTECA ---
	{
		id: "biblioteca_publica",
		title: "O Refúgio de Papel",
		description:
			"A Biblioteca Municipal é climatizada e silenciosa. O segurança te olha torto, mas a entrada é livre.",
		trigger: { type: "LOCATION", value: 0.1, locationId: "biblioteca_centro" },
		aspect: "LEISURE",
		intensity: "LOW",
		tags: ["lazer", "cultura"],
		options: [
			{
				label: "Entrar para ler",
				consequence:
					"Você leu jornal e um livro. Por 3 horas, esqueceu que morava na rua. Ninguém te incomodou.",
				effect: { sanity: 20, energy: 10, timeAdvance: 3 },
			},
			{
				label: "Usar banheiro e bebedouro",
				consequence: "Você se hidratou e lavou o rosto. Rápido e prático.",
				effect: { hygiene: 5, health: 5 },
			},
		],
	},

	// --- SAÚDE MENTAL: O AMIGO IMAGINARIO ---
	{
		id: "alucinacao_fome",
		title: "O Banquete Fantasma",
		description:
			"A fome é tanta que você sente cheiro de frango assado. Você vê um prato feito na calçada, mas quando chega perto, é só lixo.",
		trigger: {
			type: "STATUS",
			value: 0.5,
			statusCondition: { hunger: 10, sanity: 20 },
		},
		aspect: "MENTAL",
		intensity: "HIGH",
		tags: ["fome", "alucinação"],
		options: [
			{
				label: "Comer mesmo assim",
				consequence:
					"Você comeu restos estragados. A intoxicação veio forte horas depois.",
				effect: { hunger: -10, health: -30, sanity: -10 },
			},
			{
				label: "Chorar de desespero",
				consequence: "Você desabou. Um passante viu e te deu um salgado real.",
				effect: { sanity: -10, hunger: -20, dignity: -10 },
			},
		],
	},

	// --- SOLIDARIEDADE: O COBERTOR EXTRA ---
	{
		id: "doacao_cobertor",
		title: "Sobrou um Cobertor",
		description:
			"Um grupo de doação te deu um cobertor novo. Você já tem um, mas vê um idoso tremendo sem nada.",
		trigger: { type: "RANDOM", value: 0.1 },
		aspect: "ETHICS",
		intensity: "MEDIUM",
		tags: ["ética", "solidariedade"],
		options: [
			{
				label: "Doar para o idoso",
				consequence:
					"Ele agradeceu com lágrimas. Você sente que fez a coisa certa.",
				effect: { sanity: 20, dignity: 20, socialStigma: -5 },
			},
			{
				label: "Guardar (reserva)",
				consequence:
					"Você garantiu sua segurança, mas a imagem do idoso tremendo te persegue.",
				effect: { security: 10, sanity: -5 },
			},
		],
	},

	// --- TECNOLOGIA: WI-FI LIVRE ---
	{
		id: "wifi_praca",
		title: "Conexão Digital",
		description:
			"Você achou um ponto de Wi-Fi livre na praça. Seu celular tem 15% de bateria. O que fazer?",
		trigger: { type: "LOCATION", value: 0.2, locationId: "largo_rosario" },
		aspect: "INFO",
		intensity: "LOW",
		tags: ["tecnologia", "comunicação"],
		options: [
			{
				label: "Procurar emprego/serviços",
				consequence:
					"Você achou o endereço de um sopão hoje à noite. Informação vale ouro.",
				effect: { sanity: 10, phoneBattery: -10, addBuff: "INFO_SOPAO" },
			},
			{
				label: "Ver redes sociais",
				consequence:
					"Você viu fotos da vida 'normal' dos outros. A comparação doeu.",
				effect: { sanity: -15, phoneBattery: -10 },
			},
		],
	},

	// --- HIGIENE: BARBEARIA SOCIAL ---
	{
		id: "barbearia_social",
		title: "Tapa no Visual",
		description: "Um projeto social está cortando cabelo de graça na praça.",
		trigger: { type: "RANDOM", value: 0.05 },
		aspect: "HYGIENE",
		intensity: "LOW",
		tags: ["higiene", "autoestima"],
		options: [
			{
				label: "Cortar o cabelo",
				consequence:
					"Você se olha no espelho e se reconhece de novo. A autoestima voltou.",
				effect: { hygiene: 20, sanity: 20, dignity: 15 },
			},
			{
				label: "Tenho vergonha",
				consequence: "Você observou de longe. Perdeu a chance.",
				effect: { sanity: -5 },
			},
		],
	},

	// --- POLITICA: ABORDAGEM ELEITORAL ---
	{
		id: "candidato_visita",
		title: "Promessas Vazias",
		description:
			"É ano de eleição. Um candidato vem apertar sua mão e tirar foto. Ele promete 'resolver a situação'.",
		trigger: { type: "RANDOM", value: 0.02 },
		aspect: "POLITICS",
		intensity: "LOW",
		tags: ["política", "cidadania"],
		options: [
			{
				label: "Cobrar propostas reais",
				consequence:
					"O assessor te afastou. 'Sem confusão'. Mas você falou o que pensava.",
				effect: { dignity: 10, socialStigma: 5 },
			},
			{
				label: "Aceitar o santinho",
				consequence:
					"Ele tirou a foto e foi embora sem olhar pra trás. Você se sentiu usado.",
				effect: { dignity: -10, sanity: -5 },
			},
		],
	},

	// --- CIDADE: FESTA NA RUA ---
	{
		id: "bloco_carnaval",
		title: "A Cidade em Festa",
		description:
			"Um bloco de carnaval passa na rua. Música, alegria, gente bebendo. Você é invisível no meio da multidão.",
		trigger: { type: "TIME_SPECIFIC", value: 14 }, // Exemplo
		aspect: "SOCIAL",
		intensity: "MEDIUM",
		tags: ["cultura", "exclusão"],
		options: [
			{
				label: "Catar as latinhas da festa",
				consequence:
					"A festa deles é seu lucro. Você encheu dois sacos em 1 hora!",
				effect: { money: 40, energy: -20, dignity: -5 },
			},
			{
				label: "Tentar curtir a música",
				consequence:
					"Você dançou um pouco. Alguém te ofereceu uma água. Foi um momento de leveza.",
				effect: { sanity: 25, energy: -10 },
			},
		],
	},

	// --- TRANSPORTE: PULAR A CATRACA ---
	{
		id: "onibus_sem_dinheiro",
		title: "Distância Urbana",
		description:
			"Você precisa ir para a periferia buscar um documento, mas não tem dinheiro para o ônibus (R$ 5,50).",
		trigger: { type: "STATUS", value: 0.1, statusCondition: { money: 0 } },
		aspect: "TRANSPORT",
		intensity: "MEDIUM",
		tags: ["transporte", "mobilidade"],
		options: [
			{
				label: "Pedir carona ao motorista",
				consequence:
					"O motorista foi gente boa. 'Entra aí, mas vai no fundo'. Você seguiu viagem.",
				effect: { dignity: 5, energy: -5 },
			},
			{
				label: "Pular a catraca / Entrar por trás",
				consequence:
					"Você entrou, mas passageiros reclamaram. A viagem foi tensa.",
				effect: { socialStigma: 10, dignity: -5 },
			},
		],
	},
];
