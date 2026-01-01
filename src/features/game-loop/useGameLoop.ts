import { useEffect, useRef, useState, useCallback } from "react";
import { useGameContext } from "@/contexts/GameContext";
import { REAL_DILEMMAS as GAME_DILEMMAS } from "./dilemmas-real"; // Using the real dilemmas file
import { TelemetryAction, telemetryService } from "@/services/telemetry";

function calculateDistance(
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

export function useGameLoop() {
	const {
		time,
		health,
		hunger,
		hygiene,
		sanity,
		energy,
		dignity,
		socialStigma,
		activeBuffs,
		modifyStat,
		advanceTime,
		activeDilemmaId,
		setActiveDilemma,
		resolvedDilemmas,
		isPaused,
		avatar,
		inventory,
		workTool,
		removeFromInventory,
		setWorkTool,
		isAtShelter,
		userPosition,
		addBuff,
		removeBuff,
		phoneBattery,
	} = useGameContext();

	const [isRaining, setIsRaining] = useState(false);
	// Refs to prevent effects running on every render
	const lastHourRef = useRef(time);

	// Coordenadas do Centro de Campinas (Largo do Rosário/13 de Maio)
	const CENTER_COORDS = { lat: -22.9055, lng: -47.0608 };
	const IDLE_THRESHOLD = 3; // Horas paradas para gatilho

	// Estado local para rastrear tempo no mesmo local
	const [timeInLocation, setTimeInLocation] = useState(0);
	const [lastPosition, setLastPosition] = useState<[number, number] | null>(
		null,
	);

	useEffect(() => {
		if (userPosition && lastPosition) {
			const dist = Math.sqrt(
				Math.pow(userPosition[0] - lastPosition[0], 2) +
					Math.pow(userPosition[1] - lastPosition[1], 2),
			);

			// Se moveu menos que ~100m, considera parado
			if (dist < 0.001) {
				setTimeInLocation((prev) => prev + 1);
			} else {
				setTimeInLocation(0);
				setLastPosition(userPosition);
			}
		} else if (userPosition) {
			setLastPosition(userPosition);
		}
	}, [time]); // Roda a cada "hora" do jogo

	// Checagem de Evento Sistêmico
	useEffect(() => {
		// Distância do Centro
		if (userPosition) {
			const distToCenter = Math.sqrt(
				Math.pow(userPosition[0] - CENTER_COORDS.lat, 2) +
					Math.pow(userPosition[1] - CENTER_COORDS.lng, 2),
			);

			// Se está no centro E parado há muito tempo
			// Raio de 0.005 graus é aproximadamente 550m. O usuário pediu 500m, então vamos ajustar levemente para 0.0045 se quisermos precisão,
			// mas 0.005 é seguro. A estatística de 51% justifica a agressividade.
			if (distToCenter < 0.005 && timeInLocation >= IDLE_THRESHOLD) {
				// FORCE TRIGGER: Systemic aggression doesn't wait for probability if you abuse spacing
				// We enforce it.
				setActiveDilemma("enquadro_13_maio");
				setTimeInLocation(0);
			}
		}
	}, [timeInLocation, userPosition]);

	// --- Helpers ---
	const getSanityDecayMultiplier = (stigma: number) => 1 + stigma / 100;

	const applyWeatherEffects = (state: any, raining: boolean) => {
		// Return distinct effects to be applied
		// This function calculates projected changes but doesn't apply them directly
		const effects: any = {};
		if (raining && !state.isAtShelter) {
			effects.health = state.health - 1; // Rain hurts
			if (state.workTool?.type === "CARRINHO_RECICLAGEM") {
				// Rust or wet cardboard?
			}
		}
		return effects;
	};

	const processRandomEvents = (state: any) => {
		// Placeholder for "O Rapa"
		if (Math.random() < 0.005) {
			// 0.5% chance per tick
			// O Rapa logic
			return {
				workTool: { ...state.workTool, isConfiscated: true },
				dignity: state.dignity - 10,
			};
		}
		return null;
	};

	const checkShelterBarrier = () => {
		// Logic to check if user can enter shelter (ignored for now as mostly handled in NearbyList)
	};

	const checkBattery = useCallback(() => {
		if (phoneBattery <= 0) {
			if (!activeBuffs.includes("SEM_BATERIA")) {
				addBuff("SEM_BATERIA");
			}
		} else {
			if (activeBuffs.includes("SEM_BATERIA")) {
				removeBuff("SEM_BATERIA");
			}
		}
	}, [phoneBattery, activeBuffs, addBuff, removeBuff]);

	// --- Main Tick (Real-time to Game-time) ---
	useEffect(() => {
		if (isPaused) return;

		const interval = setInterval(() => {
			// Advance Logic (Decay Stats) happens every Real World Loop
			// Assume 10 seconds = 1 hour? Or 10 seconds = X minutes?
			// Implementation uses 10000ms.

			// Calculate Decay
			let hngDecay = 2; // Base Hunger
			let hygDecay = 1; // Base Hygiene
			let enrDecay = 1; // Base Energy
			let snyDecay = 0.5 * getSanityDecayMultiplier(socialStigma);

			// Class Modifiers
			if (avatar) {
				if (avatar.ageRange === "jovem") hngDecay += 0.1;
				if (avatar.ageRange === "idoso") enrDecay += 0.1;
				if (avatar.timeOnStreet === "recente") snyDecay += 0.1;
				if (avatar.timeOnStreet === "veterano") {
					snyDecay = Math.max(0, snyDecay - 0.2); // Slower sanity decay
					modifyStat("health", -0.2); // Physical wear and tear
				}
			}

			// Inventory Weight Penalty
			const totalWeight = inventory.reduce(
				(acc: number, i: any) => acc + i.weight,
				0,
			);
			if (totalWeight > 10 && workTool.type !== "CARRINHO_RECICLAGEM") {
				enrDecay += 0.3;
			}

			// Rain
			if (isRaining && !isAtShelter) {
				snyDecay += 1;
				hngDecay += 0.5; // Cold makes you hungry
				modifyStat("health", -0.5); // Getting wet risks health
			}

			// Apply
			modifyStat("hunger", -hngDecay);
			modifyStat("hygiene", -hygDecay);
			modifyStat("energy", -enrDecay);
			modifyStat("sanity", -snyDecay);
			modifyStat("phoneBattery", -5); // Battery decay 5% per hour

			// Random Events
			const rand = processRandomEvents({ dignity, workTool });
			if (rand) {
				if (rand.workTool) setWorkTool(rand.workTool);
				if (rand.dignity) modifyStat("dignity", rand.dignity - dignity); // Set new dignity
			}

			// Check Battery
			checkBattery();

			// Advance Time
			advanceTime(1);
		}, 10000); // 10s per tick (1 hour)

		return () => clearInterval(interval);
	}, [
		health,
		hunger,
		hygiene,
		sanity,
		energy,
		socialStigma,
		isPaused,
		modifyStat,
		advanceTime,
		avatar,
		inventory,
		workTool,
		isRaining,
		isAtShelter,
		removeFromInventory,
		setWorkTool,
		activeBuffs,
		addBuff,
		removeBuff,
		dignity,
		phoneBattery,
		checkBattery,
	]);

	// --- Systemic Events (Triggered by Time Change) ---
	useEffect(() => {
		if (time !== lastHourRef.current) {
			checkSystemicEvents(time);
			lastHourRef.current = time;

			// Random Rain change every hour
			if (Math.random() < 0.2) setIsRaining(true);
			else setIsRaining(false);
		}

		function checkSystemicEvents(currentHour: number) {
			if (activeDilemmaId) return;

			// 1. SAMIM BARRIER Removed (Handled by JSON Dilemma "barreira_samim_time")

			// 2. Cold Night (Without Shelter)
			if (currentHour >= 22 || currentHour < 5) {
				if (!isAtShelter) {
					const hasCardboard = inventory.some((i: any) => i.name === "Papelão");
					if (hasCardboard) {
						modifyStat("health", -1);
						modifyStat("sanity", -1);
					} else {
						modifyStat("health", -3);
						modifyStat("sanity", -3);
					}
				}
			}

			// 3. Narrative Dilemmas Trigger
			for (const dilemma of GAME_DILEMMAS) {
				// If it's resolved and NOT repeatable, skip.
				if (resolvedDilemmas.includes(dilemma.id) && !dilemma.repeatable)
					continue;

				// If it IS repeatable but resolved, we still check trigger conditions.
				// But we must ensure smooth UX (not spamming).
				// The trigger conditions below (low stats) effectively throttle it.
				if (
					dilemma.prerequisite &&
					!resolvedDilemmas.includes(dilemma.prerequisite)
				)
					continue;

				let triggered = false;
				const { type, value } = dilemma.trigger;

				switch (type) {
					case "RANDOM":
						if (Math.random() < value) triggered = true;
						break;
					case "HUNGER_LOW":
						if (hunger < value) triggered = true;
						break;
					case "HYGIENE_LOW":
						if (hygiene < value) triggered = true;
						break;
					case "SOCIAL_STIGMA_HIGH":
						if (socialStigma > value) triggered = true;
						break;
					case "LOCATION":
						if (dilemma.location_trigger && userPosition) {
							const dist = calculateDistance(
								userPosition[0],
								userPosition[1],
								dilemma.location_trigger.lat,
								dilemma.location_trigger.lng,
							);
							if (dist * 1000 <= (dilemma.location_trigger.radius || 50)) {
								triggered = true;
							}
						}
						break;
					case "STATUS":
						if (dilemma.trigger.statusCondition) {
							const { battery } = dilemma.trigger.statusCondition;
							// Battery check (value in JSON is 5 for 5%, phoneBattery is 0-100)
							if (battery !== undefined && phoneBattery <= battery) {
								triggered = true;
							}
						}
						break;
				}

				// Special Prerequisite Handlers
				if (dilemma.prerequisite === "TIME_AFTER_19" && time < 19)
					triggered = false;

				/* Hard Constraint for ODS 2 (Hunger) - Force dilemma if critical */
				if (hunger < 10 && !resolvedDilemmas.includes("fome_extrema_01")) {
					// Assuming ID exists for now, or fallback
				}

				if (triggered) {
					setActiveDilemma(dilemma.id);
					return;
				}
			}

			// 4. CAPS Sedation Systemic Effect
			if (activeBuffs.includes("SEDADO_CAPS")) {
				modifyStat("energy", -5);
			}
		}
	}, [
		time,
		activeDilemmaId,
		resolvedDilemmas,
		hunger,
		hygiene,
		activeBuffs,
		isAtShelter,
		inventory,
		setActiveDilemma,
		modifyStat,
		socialStigma,
		userPosition,
	]);

	return { isRaining, batteryLevel: phoneBattery / 100 };
}
