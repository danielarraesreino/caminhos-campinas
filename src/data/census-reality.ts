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
};
