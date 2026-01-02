import CENSUS_DATA from "@/data/statistics-censo.json";

export interface SimAgent {
	id: string;
	demographics: {
		race: "PRETA_PARDA" | "BRANCA" | "OUTRA";
		gender: "MASCULINO" | "FEMININO";
	};
	status: {
		sheltered: boolean;
		hungry: boolean;
		sanitationAccess: "PUBLICO" | "COMERCIO" | "RUA";
		menstrualDignity: boolean;
		benefitsAccess:
			| "DEFERIDO"
			| "INDEFERIDO_DOCS"
			| "INDEFERIDO_ENDERECO"
			| "NAO_SOLICITOU";
	};
	background: {
		reason:
			| "CONFLITO_FAMILIAR"
			| "DESEMPREGO"
			| "SAUDE_MENTAL_ALCOOL"
			| "OUTROS";
	};
	outcome:
		| "SUCESSO"
		| "VIOLACAO_ODS_1"
		| "VIOLACAO_ODS_2"
		| "VIOLACAO_ODS_11"
		| "VIOLACAO_ODS_6";
}

export function runCensusSimulation(): SimAgent[] {
	const agents: SimAgent[] = [];
	const { TOTAL_POPULATION, DEMOGRAPHICS, RESOURCES, STATUS, MOTIVES } =
		CENSUS_DATA;

	let shelterSlots = RESOURCES.SHELTER_BEDS;
	let freeMealSlots = RESOURCES.FREE_MEALS;

	for (let i = 0; i < TOTAL_POPULATION; i++) {
		// 1. Gerar Demografia Real
		const isBlackOrBrown = Math.random() < DEMOGRAPHICS.RACE_PRETA_PARDA;
		const isMale = Math.random() < DEMOGRAPHICS.GENDER_MALE;

		// 2. Simular Acesso a Abrigo (ODS 11.1)
		let isSheltered = false;
		if (Math.random() < STATUS.SHELTERED_PROBABILITY) {
			isSheltered = true;
			shelterSlots--;
		} else if (
			shelterSlots > 0 &&
			Math.random() < STATUS.SHELTERED_EXTRA_PROBABILITY
		) {
			isSheltered = true;
			shelterSlots--;
		}

		// 3. Simular Fome (ODS 2.1)
		let isHungry = false;
		const hasMoney = Math.random() > 1 - STATUS.MONEY_PROBABILITY;

		if (!hasMoney && freeMealSlots > 0) {
			freeMealSlots--;
		} else if (!hasMoney) {
			isHungry = true;
		}

		// 4. Simular Saneamento (Jornada da Higiene)
		let sanitationAccess: SimAgent["status"]["sanitationAccess"] = "PUBLICO";
		const randSanitation = Math.random();

		if (randSanitation < STATUS.SANITATION.PUBLICO) {
			sanitationAccess = "PUBLICO";
		} else if (
			randSanitation <
			STATUS.SANITATION.PUBLICO + STATUS.SANITATION.COMERCIO
		) {
			sanitationAccess = "COMERCIO";
			if (Math.random() < STATUS.SANITATION.NEGATION_RISK) {
				sanitationAccess = "RUA";
			}
		} else {
			sanitationAccess = "RUA";
		}

		// 5. Simular Dignidade Menstrual
		let menstrualDignity = true;
		if (!isMale) {
			if (Math.random() < STATUS.MENSTRUAL_VULNERABILITY) {
				menstrualDignity = false;
			}
		}

		// 6. Background (Causa da Rua)
		let reason: SimAgent["background"]["reason"] = "OUTROS";
		const randReason = Math.random();
		if (randReason < MOTIVES.CONFLITO_FAMILIAR) {
			reason = "CONFLITO_FAMILIAR";
		} else if (randReason < MOTIVES.CONFLITO_FAMILIAR + MOTIVES.DESEMPREGO) {
			reason = "DESEMPREGO";
		} else {
			reason = "SAUDE_MENTAL_ALCOOL";
		}

		// 7. Acesso a Benefícios (Barreira CadÚnico)
		let benefitsAccess: SimAgent["status"]["benefitsAccess"] = "NAO_SOLICITOU";
		if (Math.random() < STATUS.BENEFITS.SOLICIT_PROBABILITY) {
			const randBenefit = Math.random();
			if (randBenefit < STATUS.BENEFITS.DEFERED) {
				benefitsAccess = "DEFERIDO";
			} else if (
				randBenefit <
				STATUS.BENEFITS.DEFERED + STATUS.BENEFITS.INDEFERED_DOCS
			) {
				benefitsAccess = "INDEFERIDO_DOCS";
			} else {
				benefitsAccess = "INDEFERIDO_ENDERECO";
			}
		}

		// 8. Determinar Resultado (Violência Institucional/Negação de Direitos)
		let outcome: SimAgent["outcome"] = "SUCESSO";
		if (!isSheltered) outcome = "VIOLACAO_ODS_11";
		if (isHungry) outcome = "VIOLACAO_ODS_2";
		if (sanitationAccess === "RUA") outcome = "VIOLACAO_ODS_6";

		agents.push({
			id: `agent-${i}`,
			demographics: {
				race: isBlackOrBrown ? "PRETA_PARDA" : "BRANCA",
				gender: isMale ? "MASCULINO" : "FEMININO",
			},
			status: {
				sheltered: isSheltered,
				hungry: isHungry,
				sanitationAccess,
				menstrualDignity,
				benefitsAccess,
			},
			background: {
				reason,
			},
			outcome,
		});
	}

	return agents;
}
