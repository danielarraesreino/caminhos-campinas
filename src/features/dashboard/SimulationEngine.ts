export const CAMPINAS_CENSUS_2024 = {
	totalPopulation: 1557,
	racialProfile: {
		pretoPardo: 0.678, // 67.8%
		branco: 0.31,
		outros: 0.012,
	},
	genderProfile: {
		masculino: 0.811, // 81.1%
		feminino: 0.189,
	},
	mainReasons: {
		familyConflict: 0.715, // 71.5% - Conflitos Familiares
		unemployment: 0.45,
		drugAbuse: 0.3,
	},
};

export class SimulationEngine {
	static generateRandomProfile() {
		// Simple weighted random generation
		const isMale = Math.random() < CAMPINAS_CENSUS_2024.genderProfile.masculino;
		const isPretoPardo =
			Math.random() < CAMPINAS_CENSUS_2024.racialProfile.pretoPardo;

		return {
			gender: isMale ? "masculino" : "feminino",
			ethnicity: isPretoPardo ? "preto/pardo" : "branco",
			mainReason:
				Math.random() < CAMPINAS_CENSUS_2024.mainReasons.familyConflict
					? "Conflito Familiar"
					: "Outro",
		};
	}

	static getTotalPopulation() {
		return CAMPINAS_CENSUS_2024.totalPopulation;
	}
}
