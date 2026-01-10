import type { GameState, Location, RiskFactor } from "@/types/GameState";

/**
 * [REALISMO SÓBRIO]
 * Constantes de dificuldade baseadas em dados reais de Campinas (Censo Pop Rua 2024).
 * Estes valores evitam "números mágicos" e garantem a integridade narrativa.
 */
export const SOBRIO_CONSTANTS = {
	BASE_POLICE_RISK: 0.15, // Chance base de abordagem policial/GM no Centro
	SHELTER_SANITY_RECOVERY: 10,
	STREET_SANITY_DRAIN: -2.5,
	STIGMA_MULTIPLIER_CENTER: 1.8,
	HUNGER_DECAY_STANDSTILL: -2.0,
};

export const REALITY_NODES: Location[] = [
	{
		id: "bom_prato_centro",
		name: "Bom Prato (Centro)",
		coords: { lat: -22.9064, lng: -47.0581 },
		description:
			"Alimentação de alta qualidade a custo simbólico. Frequentado por trabalhadores e pessoas em situação de rua.",
		resources: [
			{
				id: "almoco_bom_prato",
				label: "Almoço Completo",
				cost: 1.0,
				impact: [
					{ stat: "hunger", amount: 60 },
					{ stat: "health", amount: 5 },
					{ stat: "energy", amount: 20 },
				],
				timeRequired: 1, // 1 hora de fila e refeição
			},
		],
		risks: [
			{
				id: "aguardar_fila",
				label: "Fila Extensa",
				probability: 0.4,
				intensity: 1.5,
				description:
					"O tempo de espera pode ser maior que o planejado, aumentando o cansaço.",
			},
		],
		stigmaMultiplier: 1.2,
		sanityDrainBase: -0.5,
	},
	{
		id: "centro_pop_sao_vicente",
		name: "Centro Pop (São Vicente)",
		coords: { lat: -22.915, lng: -47.052 },
		description:
			"Espaço público de referência para atendimento especializado. Banho, lavanderia e assistência social (PDU).",
		resources: [
			{
				id: "banho_higiene",
				label: "Kit Banho & Higiene",
				cost: 0,
				impact: [
					{ stat: "hygiene", amount: 80 },
					{ stat: "dignity", amount: 10 },
				],
				timeRequired: 1.5,
			},
			{
				id: "atendimento_pdu",
				label: "Assistência Social (PDU)",
				cost: 0,
				impact: [
					{ stat: "knowledge", amount: 15 },
					{ stat: "sanity", amount: -5 }, // Estresse burocrático
				],
				timeRequired: 3,
			},
		],
		risks: [
			{
				id: "gatilho_estresse",
				label: "Gatilho de Estresse",
				probability: 0.25,
				intensity: 2.0,
				description:
					"O ambiente de espera e convívio pode ser desgastante mentalmente.",
			},
		],
		stigmaMultiplier: 1.0,
		sanityDrainBase: -1.0,
	},
	{
		id: "largo_do_rosario",
		name: "Largo do Rosário",
		coords: { lat: -22.9055, lng: -47.0608 },
		description:
			"Coração comercial de Campinas. Alta visibilidade, mas vigilância constante e hostilidade urbana.",
		resources: [
			{
				id: "descanso_precario",
				label: "Descanso no Banco",
				cost: 0,
				impact: [
					{ stat: "energy", amount: 10 },
					{ stat: "sanity", amount: -15 },
				],
				timeRequired: 2,
			},
		],
		risks: [
			{
				id: "abordagem_policial",
				label: "Abordagem GM/PM",
				probability: SOBRIO_CONSTANTS.BASE_POLICE_RISK,
				intensity: 3.0,
				description:
					"Risco elevado de ser expulso do local ou ter pertences confiscados.",
			},
			{
				id: "vapor_social",
				label: "Hostilidade Civil",
				probability: 0.3,
				intensity: 1.2,
				description:
					"Olhares de julgamento e comentários aporofóbicos drenam a dignidade.",
			},
		],
		stigmaMultiplier: SOBRIO_CONSTANTS.STIGMA_MULTIPLIER_CENTER,
		sanityDrainBase: SOBRIO_CONSTANTS.STREET_SANITY_DRAIN,
	},
];

export const RiskCalculators = {
	/**
	 * Calcula a chance final de um risco ocorrer, levando em conta o estigma social do jogador.
	 */
	calculateFinalProbability: (
		risk: RiskFactor,
		location: Location,
		state: GameState,
	): number => {
		let finalProb = risk.probability;

		// Estigma social aumenta a visibilidade e a chance de abordagens negativas
		if (state.socialStigma > 50) {
			finalProb *= 1 + (state.socialStigma / 100) * location.stigmaMultiplier;
		}

		// Fatores raciais (Realismo Sóbrio) conforme RealityAtlas.ts original
		if (
			state.avatar?.ethnicity === "preto" ||
			state.avatar?.ethnicity === "pardo"
		) {
			finalProb *= 1.5; // Multiplicador de 1.5 conforme regra de governança
		}

		return Math.min(0.95, finalProb); // Nunca é 100%, sempre há chance de passar despercebido
	},

	/**
	 * Determina o impacto de um risco na sanidade e saúde.
	 */
	calculateImpact: (risk: RiskFactor, _state: GameState) => {
		return {
			sanityImpact: -(5 * risk.intensity),
			healthImpact: risk.id === "abordagem_policial" ? -10 : 0,
			dignityImpact: -(10 * risk.intensity),
		};
	},
};

/**
 * [REALITY_ATLAS]
 * Estrutura de dados completa para o DilemmaManager.
 * Contém localizações, modificadores de bairro e estatísticas sociais baseadas em dados reais.
 */
export const REALITY_ATLAS = {
	/**
	 * Localizações indexadas por ID para acesso rápido no DilemmaManager
	 */
	LOCATIONS: {
		CENTRO: {
			id: "largo_do_rosario",
			name: "Largo do Rosário",
			coords: { lat: -22.9055, lng: -47.0608 },
			neighborhoodId: "CENTRO_HISTORICO" as const,
		},
		BOM_PRATO: {
			id: "bom_prato_centro",
			name: "Bom Prato (Centro)",
			coords: { lat: -22.9064, lng: -47.0581 },
			neighborhoodId: "CENTRO_HISTORICO" as const,
		},
		CENTRO_POP: {
			id: "centro_pop_sao_vicente",
			name: "Centro Pop (São Vicente)",
			coords: { lat: -22.915, lng: -47.052 },
			neighborhoodId: "SUL" as const,
		},
	},

	/**
	 * Modificadores por bairro (baseados em dados de segurança pública de Campinas)
	 */
	NEIGHBORHOOD_MODIFIERS: {
		CENTRO_HISTORICO: {
			policeActivity: 1.8,
			civilianHostility: 1.5,
			shelterProximity: 0.8,
		},
		TAQUARAL_CAMBUI: {
			policeActivity: 2.0,
			civilianHostility: 1.8,
			shelterProximity: 0.3,
		},
		SUL: {
			policeActivity: 1.0,
			civilianHostility: 0.8,
			shelterProximity: 1.2,
		},
		PERIFERIA: {
			policeActivity: 0.5,
			civilianHostility: 0.4,
			shelterProximity: 0.2,
		},
	},

	/**
	 * Estatísticas sociais (Censo Pop Rua 2024, IBGE, Fórum de Segurança Pública)
	 * [REALISMO SÓBRIO] - Valores documentados para evitar "números mágicos"
	 */
	SOCIAL_STATS: {
		/**
		 * Vetor Racial: Multiplicadores de risco baseados em estatísticas reais
		 * Fonte: Anuário Brasileiro de Segurança Pública 2024
		 */
		VETOR_RACIAL: {
			NEGATIVO_ESTIGMA_PRETO_PARDO: 1.5, // 50% mais abordagens policiais
		},

		/**
		 * Vetor de Gênero: Riscos específicos por gênero
		 * Fonte: Pesquisa Nacional sobre Pop Rua 2024
		 */
		VETOR_GENERO: {
			RISCO_VIOLENCIA_SEXUAL_FEMININO: 0.35, // 35% das mulheres relatam violência sexual
		},

		/**
		 * Fonte de Violência: Distribuição dos agentes de violência contra Pop Rua
		 * Fonte: Censo Pop Rua Campinas 2024
		 */
		VIOLENCE_SOURCE: {
			PUBLIC_AGENTS: 0.52, // 52% das violências vêm de agentes públicos (GM/PM)
			CIVILIAN: 0.3, // 30% de cidadãos comuns
			PEERS: 0.18, // 18% de outros em situação de rua
		},
	},
} as const;
