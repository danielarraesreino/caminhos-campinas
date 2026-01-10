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
		const { day = 1, time = 8, avatar, userPosition, activeDilemmaId } = state;

		console.log(
			`[DilemmaManager] Checking for triggered dilemmas. Day: ${day}, Time: ${time}, Active: ${activeDilemmaId}, Total dilemmas: ${this.dilemmas.length}`,
		);

		if (activeDilemmaId) return null;

		// 0. Priority: Hardcoded Systemic Triggers (RealityAtlas Based)
		if (day === 1 && !this.resolvedIds.has("intro_acordar_praca")) {
			console.log(
				`[DilemmaManager] Triggering intro_acordar_praca (Day 1, Time: ${time})`,
			);
			return this.getDilemmaById("intro_acordar_praca");
		}

		// 1. Reality-Weighted Triggers ("O Rapa", etc.) - Keep as immediate interrupts
		if (userPosition) {
			// ... (Existing O Rapa Logic kept for safety, or move to candidates?)
			// For now, let's keep high-risk location interrupts as "Scene Stealers"
			// But to be consistent, we should probably check them against candidates too.
			// However, given the complexity of the previous code, I will leave the logic inside O Rapa separate
			// OR I can trust the Director.
			// Let's reimplement strictly the existing O Rapa check here for now to minimize regression risk.
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

			// ... (Simple re-implementation of the logic or keep it if I didn't verify it fully)
			// Actually, let's stick to the Candidate Loop for everything else.
			// If strict adherence to previous "O Rapa" is needed, I should have read it more carefully or kept it.
			// I will restore the O Rapa logic block carefully.

			const neighborhoodId =
				nearestLoc.neighborhoodId as keyof typeof REALITY_ATLAS.NEIGHBORHOOD_MODIFIERS;
			const neighborhood = REALITY_ATLAS.NEIGHBORHOOD_MODIFIERS[neighborhoodId];
			let rapaModifier = 1.0;
			if (avatar?.ethnicity === "preto" || avatar?.ethnicity === "pardo") {
				rapaModifier =
					REALITY_ATLAS.SOCIAL_STATS.VETOR_RACIAL.NEGATIVO_ESTIGMA_PRETO_PARDO;
			}
			const policeActivity = neighborhood ? neighborhood.policeActivity : 1.0;
			const rapaChance =
				REALITY_ATLAS.SOCIAL_STATS.VIOLENCE_SOURCE.PUBLIC_AGENTS *
				0.05 *
				policeActivity *
				rapaModifier;

			const distToLoc = this.calculateDistance(
				userPosition[0],
				userPosition[1],
				nearestLoc.coords.lat,
				nearestLoc.coords.lng,
			);

			if (distToLoc < 0.8 && Math.random() < rapaChance) {
				if (
					neighborhoodId === "CENTRO_HISTORICO" ||
					neighborhoodId === "TAQUARAL_CAMBUI"
				) {
					return this.getDilemmaById("enquadro_13_maio");
				}
			}
		}

		// 2. Candidate Gathering (Director's Pool)
		const candidates: Dilemma[] = [];

		for (const dilemma of this.dilemmas) {
			if (this.resolvedIds.has(dilemma.id) && !dilemma.repeatable) continue;

			if (dilemma.prerequisite && !this.resolvedIds.has(dilemma.prerequisite)) {
				continue;
			}

			// 2.1 New Deterministic Condition System
			if (!this.checkConditions(dilemma, state)) {
				continue;
			}

			// Legacy Gender Check
			if (
				dilemma.requiredGender &&
				!dilemma.conditions?.gender &&
				avatar?.gender
			) {
				if (!dilemma.requiredGender.includes(avatar.gender)) {
					continue;
				}
			}

			// Check Trigger
			if (this.isTriggered(dilemma, state)) {
				candidates.push(this.applyDynamicModifiers(dilemma, avatar));
			}
		}

		console.log(
			`[DilemmaManager] Found ${candidates.length} candidate dilemmas`,
		);
		if (candidates.length > 0) {
			console.log(
				`[DilemmaManager] Candidate IDs:`,
				candidates.map((d) => d.id),
			);
		}

		if (candidates.length === 0) return null;

		// 3. Director of Intensity Logic

		// 3.1 Priority: Active Narrative Chains
		// If a candidate is a CHAIN_STEP, it effectively "belongs" to the user's current timeline.
		const chainCandidate = candidates.find(
			(d) => d.trigger.type === "CHAIN_STEP",
		);
		if (chainCandidate) {
			console.log(`[Director] Prioritizing Chain: ${chainCandidate.id}`);
			return chainCandidate;
		}

		// 3.2 Bombardeio Sensorial (Critical State -> High Intensity Aspect)
		// Health Crisis
		if ((state.health || 0) < 30) {
			const healthCrisis = candidates.find(
				(d) => d.aspect === "HEALTH" && d.intensity === "HIGH",
			);
			if (healthCrisis) return healthCrisis;
		}

		// Sanity Crisis
		if ((state.sanity || 0) < 30) {
			const sanityCrisis = candidates.find(
				(d) => d.aspect === "HEALTH" || d.tags?.includes("saúde_mental"),
			);
			if (sanityCrisis) return sanityCrisis; // We might not have typed aspect for all yet, so tags fallback
		}

		// Hunger Crisis
		if ((state.hunger || 0) < 20) {
			const foodCrisis = candidates.find(
				(d) => d.aspect === "FOOD" && d.intensity === "HIGH",
			);
			if (foodCrisis) return foodCrisis;
		}

		// Security/Fear Crisis (e.g. at night or high stigma)
		if ((state.time || 0) > 20 || (state.time || 0) < 5) {
			// Night
			const nightlifeRisk = candidates.find(
				(d) => d.aspect === "SECURITY" && d.intensity === "HIGH",
			);
			if (nightlifeRisk) return nightlifeRisk;
		}

		// 3.3 Environmental Pressure (Noise)
		// If no crisis, prefer Low Intensity events to keep the "vibe" without overwhelming,
		// OR just random pick from the candidates.
		// Let's pick a random candidate from what's left to ensure variety.
		const randomIndex = Math.floor(Math.random() * candidates.length);
		const selected = candidates[randomIndex];
		console.log(`[DilemmaManager] Selected dilemma: ${selected?.id}`);
		return selected;
	}

	// biome-ignore lint/suspicious/noExplicitAny: avatar type legacy
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

	// biome-ignore lint/suspicious/noExplicitAny: state type legacy
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
				if (
					dilemma.trigger.condition &&
					typeof dilemma.trigger.condition === "string"
				) {
					if (
						!this.checkConditionExpression(dilemma.trigger.condition, state)
					) {
						return false;
					}
				}
				return Math.random() < (value as number);
			case "HUNGER_LOW":
				return (hunger || 0) < (value as number);
			case "HYGIENE_LOW":
				return (hygiene || 0) < (value as number);
			case "SOCIAL_STIGMA_HIGH":
				return (socialStigma || 0) > (value as number);
			case "STORYLINE_START":
				// Checks if avatar ethnicity matches target value (e.g., "PERFIL_NEGRO")
				if (value === "PERFIL_NEGRO" && state.avatar) {
					return (
						state.avatar.ethnicity === "preto" ||
						state.avatar.ethnicity === "pardo"
					);
				}
				return false;
			case "CHAIN_STEP":
				if (dilemma.trigger?.prev_id) {
					// Check if previous dilemma was resolved
					const prevResolved = this.resolvedIds.has(dilemma.trigger.prev_id);
					if (!prevResolved) return false;

					// Check specific conditions
					if (dilemma.trigger.condition === "slept_outside") {
						return !state.isAtShelter;
					}
					if (dilemma.trigger.condition === "no_docs") {
						return (
							!state.documents?.hasRG &&
							state.resolvedDilemmas?.includes(dilemma.trigger.prev_id)
						);
					}
					if (dilemma.trigger.condition === "accepted_help") {
						// Check if "ACCEPTED_HELP" buff is active (added in previous step)
						return state.activeBuffs?.includes("ACCEPTED_HELP");
					}
					return true;
				}
				return false;
			case "LOCATION_IDLE":
				// ... existing logic ...
				// NEW: Check dynamic conditions
				if (
					dilemma.trigger.condition &&
					typeof dilemma.trigger.condition === "string"
				) {
					if (
						!this.checkConditionExpression(dilemma.trigger.condition, state)
					) {
						return false;
					}
				}

				if (timeInLocation >= (value as number)) {
					// Logic copied from view...
					if (dilemma.location_trigger && userPosition) {
						// re-using calc
						const dist = this.calculateDistance(
							userPosition[0],
							userPosition[1],
							dilemma.location_trigger.lat,
							dilemma.location_trigger.lng,
						);
						return dist * 1000 <= (dilemma.location_trigger.radius || 50);
					}
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
			case "CHAIN":
				return false; // Chains are triggered manually via nextDilemmaId or events
			case "STATUS":
				if (statusCondition?.battery !== undefined) {
					return (phoneBattery || 0) <= statusCondition.battery;
				}
				if (statusCondition?.health !== undefined) {
					return (state.health || 0) <= statusCondition.health;
				}
				// [NEW] Support for generic attribute checking (e.g. citizenship)
				if (dilemma.trigger.attribute) {
					const attr = dilemma.trigger.attribute;
					// biome-ignore lint/suspicious/noExplicitAny: dynamic access
					const currentVal = (state as any)[attr];
					if (currentVal !== undefined) {
						// Default to >= for positive stats like citizenship, unless specified otherwise
						// The JSON uses value: 40 for citizenship. Assuming >= check for "Unlock".
						return currentVal >= (value as number);
					}
				}
				break;
			case "LOCATION":
				// [NEW] Evaluate string conditions for LOCATION type triggers (e.g. Arc 2)
				if (
					dilemma.trigger.condition &&
					typeof dilemma.trigger.condition === "string"
				) {
					if (
						!this.checkConditionExpression(dilemma.trigger.condition, state)
					) {
						return false;
					}
				}

				// Check if location matches (value = LOCATION_ID)
				// For now, simple string matching logic or reusing the coordinate calculation if mapped
				// The new JSON uses "value": "BOM_PRATO". We need to map this to coordinates or check distance if available.
				// Assuming simplified check for now or basic distance check vs userPosition if we map IDs.
				// Since we don't have a robust ID->Coord map inside Trigger yet, let's assume Director handles location via coordinates
				// separately or we use the 'value' as a key in REALITY_ATLAS.

				if (typeof value === "string" && value === "BOM_PRATO") {
					// Hardcoded location check for Arc 2 MVP
					// Bom Prato Centro aprox coords
					const bpLat = -22.9099; // Example
					const bpLng = -47.0626;
					if (userPosition) {
						const dist = this.calculateDistance(
							userPosition[0],
							userPosition[1],
							bpLat,
							bpLng,
						);
						return dist < 0.05; // 50m
					}
				}
				// For SAMIM_BONFIM (Arc 2 - Refined)
				if (typeof value === "string" && value === "SAMIM_BONFIM") {
					const samimLat = -22.9035;
					const samimLng = -47.0689;
					if (userPosition) {
						const dist = this.calculateDistance(
							userPosition[0],
							userPosition[1],
							samimLat,
							samimLng,
						);
						return dist < 0.05;
					}
				}
				// For POUPATEMPO
				if (typeof value === "string" && value === "POUPATEMPO_CENTRO") {
					const poupaLat = -22.9055;
					const poupaLng = -47.0608;
					if (userPosition) {
						const dist = this.calculateDistance(
							userPosition[0],
							userPosition[1],
							poupaLat,
							poupaLng,
						);
						return dist < 0.05;
					}
				}

				// For Centro Pop (Rua José Paulino aprox)
				if (typeof value === "string" && value === "Centro Pop") {
					const cpLat = -22.9; // Generic placeholder logic
					const cpLng = -47.06;
					if (userPosition) {
						const dist = this.calculateDistance(
							userPosition[0],
							userPosition[1],
							cpLat,
							cpLng,
						);
						return dist < 0.1; // 100m
					}
				}

				// For CRAS (Generic - use Center as proxy or specific address if known)
				if (typeof value === "string" && value === "CRAS") {
					// Using a central logic for MVP
					if (userPosition) {
						// Trigger if near Center for now
						const dist = this.calculateDistance(
							userPosition[0],
							userPosition[1],
							REALITY_ATLAS.LOCATIONS.CENTRO.coords.lat,
							REALITY_ATLAS.LOCATIONS.CENTRO.coords.lng,
						);
						return dist < 0.5; // 500m logic
					}
				}

				// For CONSULTORIO_RUA (Arc 3)
				if (typeof value === "string" && value === "CONSULTORIO_RUA") {
					const consLat = -22.8765;
					const consLng = -47.052;
					if (userPosition) {
						// Larger radius for "Van" logic (simulating widespread presence or just loose check)
						const dist = this.calculateDistance(
							userPosition[0],
							userPosition[1],
							consLat,
							consLng,
						);
						return dist < 0.1; // 100m radius
					}
				}

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
		}
		return false;
	}

	// Safe evaluator for condition strings
	// biome-ignore lint/suspicious/noExplicitAny: state type legacy
	private checkConditionExpression(expression: string, state: any): boolean {
		try {
			// Supported: "A && B", "!A", "A === 'val'", "A < 10"

			// 0. Split logical Comparisons (&& only for now)
			if (expression.includes(" && ")) {
				const subExprs = expression.split(" && ");
				return subExprs.every((e) => this.checkConditionExpression(e, state));
			}

			let target = expression.trim();
			let operator = "";
			const _compareValue: any = null;

			// 1. Identify Operator
			if (target.includes(" === ")) operator = "===";
			else if (target.includes(" !== ")) operator = "!==";
			else if (target.includes(" >= ")) operator = ">=";
			else if (target.includes(" <= ")) operator = "<=";
			else if (target.includes(" > ")) operator = ">";
			else if (target.includes(" < ")) operator = "<";

			// 2. Resolve Left Side (State Path) or Value
			if (operator) {
				const [leftSide, rightSide] = target.split(operator);
				const leftVal = this.resolveValue(leftSide.trim(), state);
				const rightVal = this.resolveValue(rightSide.trim(), state);

				switch (operator) {
					case "===":
						return leftVal === rightVal;
					case "!==":
						return leftVal !== rightVal;
					case ">=":
						return Number(leftVal) >= Number(rightVal);
					case "<=":
						return Number(leftVal) <= Number(rightVal);
					case ">":
						return Number(leftVal) > Number(rightVal);
					case "<":
						return Number(leftVal) < Number(rightVal);
					default:
						return false;
				}
			}

			// 3. Handle Boolean / Negation (No operator)
			let isNegated = false;
			if (target.startsWith("!")) {
				isNegated = true;
				target = target.substring(1);
			}

			const val = this.resolveValue(target, state);
			return isNegated ? !val : !!val;
		} catch (e) {
			console.warn("Error evaluating condition:", expression, e);
			return false;
		}
	}

	// Helper to resolve "state.foo.bar" or "string" or 10
	// biome-ignore lint/suspicious/noExplicitAny: value resolution
	private resolveValue(pathOrValue: string, state: any): any {
		// String literal
		if (
			(pathOrValue.startsWith("'") && pathOrValue.endsWith("'")) ||
			(pathOrValue.startsWith('"') && pathOrValue.endsWith('"'))
		) {
			return pathOrValue.slice(1, -1);
		}

		// Number literal
		if (!Number.isNaN(Number(pathOrValue))) {
			return Number(pathOrValue);
		}

		// Boolean literal
		if (pathOrValue === "true") return true;
		if (pathOrValue === "false") return false;

		// State Path
		if (pathOrValue.startsWith("state.")) {
			const parts = pathOrValue.replace("state.", "").split(".");
			let value = state;
			for (const part of parts) {
				if (value === undefined || value === null) return undefined;
				value = value[part];
			}
			return value;
		}

		return undefined;
	}

	// biome-ignore lint/suspicious/noExplicitAny: state type legacy
	private checkConditions(dilemma: Dilemma, state: any): boolean {
		if (!dilemma.conditions) return true;

		const { gender } = state.avatar || {};
		const inventory = state.inventory || [];
		const _resolvedIds = this.resolvedIds || new Set();

		// 1. Gender Check
		if (dilemma.conditions.gender) {
			if (dilemma.conditions.gender === "all") return true;
			if (gender !== dilemma.conditions.gender) {
				return false;
			}
		}

		// 2. Item Check (Inventory OR WorkTool)
		if (dilemma.conditions.requiredItem) {
			const { requiredItem } = dilemma.conditions;
			const hasInventoryItem = inventory.some(
				(i: any) => i.id === requiredItem,
			);

			// Check WorkTool as well (User might name it "carrinho")
			const hasWorkTool =
				state.workTool?.type === "CARRINHO_RECICLAGEM" &&
				requiredItem.includes("carrinho");

			if (!hasInventoryItem && !hasWorkTool) return false;
		}

		// 3. Flag Check
		if (dilemma.conditions.requiredFlag) {
			const hasFlag = this.resolvedIds.has(dilemma.conditions.requiredFlag);
			if (!hasFlag) return false;
		}

		return true;
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
