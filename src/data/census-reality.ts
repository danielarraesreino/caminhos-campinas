export const CENSUS_REALITY = {
	causes: {
		familyConflict: 71.5, // Censo 2024: A maior causa real (conflitos familiares)
		unemployment: 55.4, // Desemprego é fator massivo
		alcohol: 28.2,
		drugs: 32.1, // Menor que o senso comum imagina
		prison: 24.0, // Passagem pelo sistema prisional
	},
	violenceSource: {
		publicAgents: 51.1, // GM (30%) + PM (21%) = Maioria absoluta
		civilians: 41.8,
		other: 7.1,
	},
	digitalExclusion: {
		noPhone: 20.0,
		noData: 45.0,
		hasPhoneNoBattery: 35.0, // Estimativa de dificuldade de carga
	},
	migration: {
		campinasBorn: 30.2, // Nascidos na cidade
		localState: 68.8, // Estado de SP
		otherStates: 31.2,
	},
	recidivism: {
		returnedToStreet: 30.1, // Saíram e voltaram
		prisonExitDirect: 41.0, // Saíram da cadeia direto para a rua (Funil Prisional)
		familyConflictReturn: 39.4,
	},
	funnel: {
		familyBreakdown: 71.5,
		documentLoss: 19.2,
		prisonPipeline: 41.0,
		streetPermanence: 100,
	},
	odsScorecard: {
		ods1: {
			status: "CRITICAL",
			label: "Erradicação da Pobreza",
			trend: "Worsening",
			value: "+39% PopRua",
		},
		ods2: {
			status: "CRITICAL",
			label: "Fome Zero",
			trend: "Stable",
			value: "38.5% Fome/Dia",
		},
		ods3: {
			status: "WARNING",
			label: "Saúde e Bem-Estar",
			trend: "Improving",
			value: "Consultório na Rua",
		},
		ods8: {
			status: "WARNING",
			label: "Trabalho Decente",
			trend: "Mixed",
			value: "70% Trabalham (Informal)",
		},
		ods16: {
			status: "CRITICAL",
			label: "Paz e Justiça",
			trend: "Worsening",
			value: "51% Violência Estatal",
		},
	},

	// ═══════════════════════════════════════════════════════════════════
	// GUERRA DOS NÚMEROS: Censo Oficial vs. Visão dos Coletivos
	// ═══════════════════════════════════════════════════════════════════
	populationContrast: {
		official: 1557, // Censo FEAC 2024 (1.300 rua + 257 acolhidos)
		estimated: 2800, // Estimativa Coletivos (Toca de Assis, A Rua Tem Voz)
		multiplier: 1.8, // Fator de subnotificação
		methodology: "Censo = fotografia de dias específicos (março/abril)",
		limitation:
			"Perde quem se esconde (medo da GCM), trabalha à noite, dorme em áreas dispersas",
		sources: ["FEAC 2024", "Toca de Assis", "Coletivo A Rua Tem Voz"],
	},

	// Mito da "Vadiagem" vs. Realidade do Trabalho
	workReality: {
		myth: "Eles só pedem dinheiro",
		hadFormalJob: 74.9, // % que já teve emprego formal (Censo 2024)
		currentRecycling: 28.8, // % trabalha com reciclagem
		currentWork: 70.9, // % exerce atividade remunerada (IPEA)
		barrier:
			"Exigência de antecedentes/comprovante de residência bloqueia emprego formal",
	},

	// Gênero: A Invisibilidade dentro da Invisibilidade
	genderReality: {
		womenPercent: 17.8, // % mulheres no Censo (subnotificado)
		familyPercent: 7.0, // % que vive com família na rua
		abuseReported: 23.6, // % mulheres que relatam abuso
		hidingReason:
			"Mulheres se escondem para evitar que Conselho Tutelar retire guarda dos filhos",
	},

	// Saúde Mental: Causa ou Consequência?
	substanceReality: {
		alcoholPredominant: true,
		alcoholPercent: 28.2, // Álcool é principal substância
		drugsPercent: 32.1, // Drogas (menor que senso comum)
		truthBomb:
			"O uso de substâncias muitas vezes AUMENTA após entrada na rua (anestesia social)",
	},
};

// ═══════════════════════════════════════════════════════════════════════════
// FREAKONOMICS: A VISÃO DAS ONGs - OS INCENTIVOS OCULTOS DA CONTAGEM
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Dados coletados por ONGs e coletivos que atuam na ponta.
 * Representa a "Realidade Operacional" vs "Realidade Burocrática" do Censo.
 */
export const NGO_ESTIMATES = {
	// População real estimada pelos coletivos
	population: {
		official: 1557, // Censo FEAC 2024
		estimated: 3100, // ONGs estimam "pelo menos o dobro"
		invisiblePopulation: 1543, // A diferença = pessoas que o Estado não vê
		multiplier: 2.0,
	},

	// Crítica Metodológica (Baseada em experiência de campo)
	methodologyCritique: {
		title: "O Censo é uma Fotografia de Quem o Estado Quer Ver",
		issues: [
			"Varredura em noite única (18-21/março) ignora quem trabalha ou se esconde",
			"Mistura abstinência de cigarro com crack na mesma métrica",
			"Gestão de equipe por entidades ligadas a Comunidades Terapêuticas",
			"Mulheres com filhos evitam contagem por medo do Conselho Tutelar",
		],
		source: "Coletivo A Rua Tem Voz, Cáritas, Pastoral do Povo da Rua",
	},

	// A Economia Oculta: Incentivos Perversos
	hiddenIncentives: {
		title: "A 'Bolsa Crack': Por que inflacionar dependência?",
		costComparison: {
			studentPerMonth: 316, // Custo aluno ensino médio
			tcPerMonth: 1350, // Custo Comunidade Terapêutica
		},
		critique:
			"Há incentivo financeiro em diagnosticar 'químico' e não 'social'",
		consequence: "Priorização de internação sobre Housing First",
	},

	// ONGs que realmente contam
	trustedSources: [
		{
			name: "Coletivo A Rua Tem Voz",
			role: "Dados de sobrevivência e direitos",
			methodology: "Contagem contínua por quem vive na rua",
		},
		{
			name: "Cáritas Arquidiocesana",
			role: "Casas de passagem com foco em reinserção",
			methodology: "Acompanhamento longitudinal",
		},
		{
			name: "Pastoral do Povo da Rua",
			role: "Denúncia de violência e aporofobia",
			methodology: "Testemunho direto",
		},
		{
			name: "MNPR - Movimento Nacional Pop Rua",
			role: "Luta política e dados de direitos",
			methodology: "Organização de base",
		},
	],

	// Como a metodologia falha afeta o indivíduo
	diagnosisViciado: {
		scenario: "Declarar uso de cigarro pode classificar como 'dependente'",
		consequence: "Vaga em Comunidade Terapêutica isolada ao invés de moradia",
		lostOpportunity: "Perde bicos e autonomia por meses de internação",
	},
};
