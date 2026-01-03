import type { GameState } from "@/contexts/GameContext";
import { REALITY_ATLAS } from "@/data/RealityAtlas";
import type { Dilemma } from "./dilemma-types";

export class DilemmaManager {
	private dilemmas: Dilemma[];
	private resolvedIds: Set<string>;

	constructor(dilemmas: Dilemma[], resolvedIds: string[] = []) {
		this.dilemmas = dilemmas;
		this.resolvedIds = new Set(resolvedIds);
	}

	public updateResolved(resolvedIds: string[]) {
		this.resolvedIds = new Set(resolvedIds);
	}

	public findTriggeredDilemma(
		state: Partial<GameState> & {
			userPosition: [number, number] | null;
			timeInLocation: number;
		},
	): Dilemma | null {
		const { day, time, avatar, userPosition, activeDilemmaId } = state;

		if (activeDilemmaId) return null;

		// 0. Priority: Hardcoded Systemic Triggers (RealityAtlas Based)
		if (
			day === 1 &&
			time === 8 &&
			!this.resolvedIds.has("intro_acordar_praca")
		) {
			return this.getDilemmaById("intro_acordar_praca");
		}

		// 1. Reality-Weighted Triggers (Neighborhood granularity)
		if (userPosition) {
			// Find nearest neighborhood
			const nearestLoc = Object.values(REALITY_ATLAS.LOCATIONS).reduce(
				(prev, curr) => {
					const prevDist = this.calculateDistance(
						userPosition[0],
						userPosition[1],
						prev.coords.lat,
						prev.coords.lng,
					);
					const currDist = this.calculateDistance(
						userPosition[0],
						userPosition[1],
						curr.coords.lat,
						curr.coords.lng,
					);
					return prevDist < currDist ? prev : curr;
				},
			);

			const neighborhoodId =
				nearestLoc.neighborhoodId as keyof typeof REALITY_ATLAS.NEIGHBORHOOD_MODIFIERS;
			const neighborhood = REALITY_ATLAS.NEIGHBORHOOD_MODIFIERS[neighborhoodId];

			// "O Rapa" risk is weighted by Neighborhood Police Activity AND racial stigma
			let rapaModifier = 1.0;
			if (avatar?.ethnicity === "preto" || avatar?.ethnicity === "pardo") {
				rapaModifier =
					REALITY_ATLAS.SOCIAL_STATS.VETOR_RACIAL.NEGATIVO_ESTIGMA_PRETO_PARDO;
			}

			// Base chance (GM violence stat) * Neighborhood Factor * Racial Factor
			const policeActivity = neighborhood ? neighborhood.policeActivity : 1.0;
			const rapaChance =
				REALITY_ATLAS.SOCIAL_STATS.VIOLENCE_SOURCE.PUBLIC_AGENTS *
				0.05 *
				policeActivity *
				rapaModifier;

			// Trigger logic (Centro/Comercial areas have higher checks)
			// If in a high surveillance zone (like Centro) and rollout hits:
			const distToLoc = this.calculateDistance(
				userPosition[0],
				userPosition[1],
				nearestLoc.coords.lat,
				nearestLoc.coords.lng,
			);

			if (distToLoc < 0.8 && Math.random() < rapaChance) {
				// Check if specific dilemma makes sense for this location
				if (
					neighborhoodId === "CENTRO_HISTORICO" ||
					neighborhoodId === "TAQUARAL_CAMBUI"
				) {
					return this.getDilemmaById("enquadro_13_maio");
				}
			}
		}

		// 2. Generic JSON Triggers with Dynamic Risk Adjustment
		for (const dilemma of this.dilemmas) {
			if (this.resolvedIds.has(dilemma.id) && !dilemma.repeatable) continue;

			if (dilemma.prerequisite && !this.resolvedIds.has(dilemma.prerequisite)) {
				continue;
			}

			if (this.isTriggered(dilemma, state)) {
				return this.applyDynamicModifiers(dilemma, avatar);
			}
		}

		return null;
	}

	private applyDynamicModifiers(dilemma: Dilemma, avatar: any): Dilemma {
		// Clone to avoid mutating the original dilemma data
		const modified = JSON.parse(JSON.stringify(dilemma));

		for (const option of modified.options) {
			if (option.risk !== undefined) {
				// Example: Gender risk multiplier for survival in dangerous areas
				if (
					avatar?.gender === "feminino" &&
					dilemma.tags?.includes("segurança_noturna")
				) {
					option.risk *=
						1 +
						REALITY_ATLAS.SOCIAL_STATS.VETOR_GENERO
							.RISCO_VIOLENCIA_SEXUAL_FEMININO;
				}

				// Racial risk multiplier for institutional interactions
				if (
					(avatar?.ethnicity === "preto" || avatar?.ethnicity === "pardo") &&
					dilemma.tags?.includes("institucional")
				) {
					option.risk *=
						REALITY_ATLAS.SOCIAL_STATS.VETOR_RACIAL.NEGATIVO_ESTIGMA_PRETO_PARDO;
				}

				// Clamp risk to 100
				option.risk = Math.min(100, Math.round(option.risk));
			}
		}

		return modified;
	}

	private isTriggered(dilemma: Dilemma, state: any): boolean {
		if (!dilemma.trigger) return false;
		const { type, value, statusCondition } = dilemma.trigger;
		const {
			hunger,
			hygiene,
			socialStigma,
			userPosition,
			timeInLocation,
			phoneBattery,
		} = state;

		switch (type) {
			case "RANDOM":
				return Math.random() < value;
			case "HUNGER_LOW":
				return (hunger || 0) < value;
			case "HYGIENE_LOW":
				return (hygiene || 0) < value;
			case "SOCIAL_STIGMA_HIGH":
				return (socialStigma || 0) > value;
			case "LOCATION":
				if (dilemma.location_trigger && userPosition) {
					const dist = this.calculateDistance(
						userPosition[0],
						userPosition[1],
						dilemma.location_trigger.lat,
						dilemma.location_trigger.lng,
					);
					return dist * 1000 <= (dilemma.location_trigger.radius || 50);
				}
				break;
			case "LOCATION_IDLE":
				if (timeInLocation >= value) {
					if (dilemma.location_trigger && userPosition) {
						const dist = this.calculateDistance(
							userPosition[0],
							userPosition[1],
							dilemma.location_trigger.lat,
							dilemma.location_trigger.lng,
						);
						return dist * 1000 <= (dilemma.location_trigger.radius || 50);
					}
					// Special case for Centro (enquadro) if no specific location_trigger but IDLE
					if (dilemma.id === "enquadro_13_maio" && userPosition) {
						const dist = this.calculateDistance(
							userPosition[0],
							userPosition[1],
							REALITY_ATLAS.LOCATIONS.CENTRO.coords.lat,
							REALITY_ATLAS.LOCATIONS.CENTRO.coords.lng,
						);
						return dist < 0.005;
					}
					return true;
				}
				break;
			case "STATUS":
				if (statusCondition?.battery !== undefined) {
					return (phoneBattery || 0) <= statusCondition.battery;
				}
				break;
		}
		return false;
	}

	private getDilemmaById(id: string): Dilemma | null {
		return this.dilemmas.find((d) => d.id === id) || null;
	}

	private calculateDistance(
		lat1: number,
		lon1: number,
		lat2: number,
		lon2: number,
	) {
		const R = 6371; // Earth radius in km
		const dLat = ((lat2 - lat1) * Math.PI) / 180;
		const dLon = ((lon2 - lon1) * Math.PI) / 180;
		const a =
			Math.sin(dLat / 2) * Math.sin(dLat / 2) +
			Math.cos((lat1 * Math.PI) / 180) *
				Math.cos((lat2 * Math.PI) / 180) *
				Math.sin(dLon / 2) *
				Math.sin(dLon / 2);
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
		return R * c;
	}
}
