/**
 * RealityAtlas: Sociological Truth Vectors for Campinas/Brazil.
 * This file serves as the "Source of Truth" for the Code Agent to weight risks and rewards.
 * Data based on: Censo Pop Rua 2024 (Campinas), Relatório Luz 2024, and IPEA.
 */

export const REALITY_ATLAS = {
	SOCIAL_STATS: {
		// Baseado no Censo 2024: 51,1% da violência vem da GM e 47,3% da PM [7]
		VIOLENCE_SOURCE: {
			PUBLIC_AGENTS: 0.51,
			CIVILIANS: 0.41,
			OTHER_HOMELESS: 0.08,
		},
		// Baseado no Censo 2024: 38,5% ficaram um dia sem comer na última semana [8]
		HUNGER_RISK: 0.385,
		// Baseado no Censo 2024: 83,5% dormem na rua vs 16,5% em abrigos [1]
		SHELTER_CAPACITY_RATIO: 0.165,

		// Legacy stats mapping for compatibility (deprecated but kept for safety)
		VIOLENCIA_GM: 0.511,
		VIOLENCIA_POLICIAL: 0.15,
		VETOR_RACIAL: {
			NEGATIVO_ESTIGMA_PRETO_PARDO: 1.5,
			PERCENTUAL_POP_NEGRA: 0.678,
		},
		VETOR_GENERO: {
			RISCO_VIOLENCIA_SEXUAL_FEMININO: 0.236,
			RECAO_ABRIGO_MULHERES: 0.189,
		},
	},
	NEIGHBORHOOD_MODIFIERS: {
		CENTRO_HISTORICO: {
			description:
				"Alta circulação, muitos serviços, mas vigilância ostensiva.",
			resourceAvailability: 1.5, // 50% mais fácil achar comida/dinheiro [3]
			policeActivity: 2.0, // Dobro de chance de enquadro (GM concentra-se aqui) [4]
			stigmaFactor: 1.8, // Aporofobia alta em áreas comerciais
			availableServices: [
				"bom_prato_centro",
				"centro_pop_i",
				"consultorio_rua_centro",
			],
		},
		VILA_INDUSTRIAL: {
			description:
				"Zona de serviços pesados. Onde ficam os albergues e o bagageiro.",
			resourceAvailability: 0.8,
			policeActivity: 1.2,
			stigmaFactor: 1.0,
			availableServices: [
				"samim_bonfim",
				"bagageiro_municipal",
				"casa_cidadania",
			],
		},
		PERIFERIA_NOROESTE: {
			description:
				"Alta vulnerabilidade, longe de tudo. Solidariedade comunitária maior.",
			resourceAvailability: 0.4, // Desertos alimentares [5]
			policeActivity: 0.8,
			stigmaFactor: 0.5, // Menos julgamento, mais invisibilidade
			availableServices: ["bom_prato_movel_florence", "cras_satelite"],
		},
		TAQUARAL_CAMBUI: {
			description: "Bairros nobres. Alta renda, tolerância zero.",
			resourceAvailability: 2.0, // Lixo rico, esmolas altas
			policeActivity: 3.0, // Segurança privada expulsa imediatamente [6]
			stigmaFactor: 2.5,
			availableServices: ["caps_ad_reviver"], // Poucos serviços sociais
		},
	},
	LOCATIONS: {
		CENTRO: {
			name: "Centro de Campinas",
			coords: { lat: -22.9055, lng: -47.0608 },
			riskLevel: "HIGH",
			surveillance: 0.8,
			opportunity: 0.7,
			neighborhoodId: "CENTRO_HISTORICO",
		},
		RODOVIARIA: {
			name: "Terminal Rodoviário Ramos de Azevedo",
			coords: { lat: -22.9008, lng: -47.0722 },
			riskLevel: "MEDIUM",
			surveillance: 0.6,
			utility: "CHARGING_STATION",
			neighborhoodId: "VILA_INDUSTRIAL", // Nearby
		},
		SAMIM: {
			name: "SAMIM - Albergue Municipal",
			coords: { lat: -22.9025, lng: -47.066 },
			curfew: 19,
			neighborhoodId: "VILA_INDUSTRIAL",
		},
	},
	ODS_TARGETS: {
		ODS_1: "Erradicação da Pobreza",
		ODS_2: "Fome Zero e Agricultura Sustentável",
		ODS_3: "Saúde e Bem-Estar",
		ODS_5: "Igualdade de Gênero",
		ODS_10: "Redução das Desigualdades",
	},
};

export type RealityStats = typeof REALITY_ATLAS;
