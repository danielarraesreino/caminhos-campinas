import { useCallback, useEffect, useRef, useState } from "react";
import { useGameContext } from "@/contexts/GameContext";
import { useHaptics } from "@/hooks/useHaptics";
import { DilemmaManager } from "./DilemmaManager";
import { GAME_DILEMMAS } from "./dilemmas"; // Unified import source

const dilemmaManager = new DilemmaManager(GAME_DILEMMAS);

// Coordenadas do Centro de Campinas (Largo do Rosário/13 de Maio)
const CENTER_COORDS = { lat: -22.9055, lng: -47.0608 };
const IDLE_THRESHOLD = 3;

const getSanityDecayMultiplier = (stigma: number) => 1 + stigma / 100;

// biome-ignore lint/suspicious/noExplicitAny: legacy workTool type
const processRandomEvents = (state: { dignity: number; workTool: any }) => {
	if (Math.random() < 0.02) {
		return {
			workTool: { ...state.workTool, isConfiscated: true },
			dignity: state.dignity - 15,
		};
	}
	return null;
};

export function useGameLoop() {
	const {
		day,
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
		setWorkTool,
		isAtShelter,
		userPosition,
		addBuff, // Single declaration
		removeBuff,
		phoneBattery,
		pdu,
		documents,
		flags,
	} = useGameContext();

	const [isRaining, setIsRaining] = useState(false);
	// Refs to prevent effects running on every render
	const lastHourRef = useRef<number | null>(null);
	const { triggerImpact, triggerWarning } = useHaptics();

	const [timeInLocation, setTimeInLocation] = useState(0);
	const [lastPosition, setLastPosition] = useState<[number, number] | null>(
		null,
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: Game loop logic depends on specific ticks
	useEffect(() => {
		if (userPosition && lastPosition) {
			const dist = Math.sqrt(
				(userPosition[0] - lastPosition[0]) ** 2 +
					(userPosition[1] - lastPosition[1]) ** 2,
			);
			if (dist < 0.001) {
				setTimeInLocation((prev) => prev + 1);
			} else {
				setTimeInLocation(0);
				setLastPosition(userPosition);
			}
		} else if (userPosition) {
			setLastPosition(userPosition);
		}
	}, [time]);

	useEffect(() => {
		if (userPosition) {
			const distToCenter = Math.sqrt(
				(userPosition[0] - CENTER_COORDS.lat) ** 2 +
					(userPosition[1] - CENTER_COORDS.lng) ** 2,
			);
			if (distToCenter < 0.005 && timeInLocation >= IDLE_THRESHOLD) {
				setActiveDilemma("enquadro_13_maio");
				setTimeInLocation(0);
			}
		}
	}, [timeInLocation, userPosition, setActiveDilemma]);

	useEffect(() => {
		dilemmaManager.updateResolved(resolvedDilemmas);
	}, [resolvedDilemmas]);

	const checkBattery = useCallback(() => {
		if (phoneBattery <= 0) {
			if (!activeBuffs.includes("SEM_BATERIA")) addBuff("SEM_BATERIA");
		} else {
			if (activeBuffs.includes("SEM_BATERIA")) removeBuff("SEM_BATERIA");
		}
	}, [phoneBattery, activeBuffs, addBuff, removeBuff]);

	useEffect(() => {
		if (isPaused) return;
		const interval = setInterval(() => {
			let hngDecay = 2;
			const hygDecay = 1;
			let enrDecay = 1;
			let snyDecay = 0.5 * getSanityDecayMultiplier(socialStigma);

			if (avatar) {
				if (avatar.ageRange === "jovem") hngDecay += 0.1;
				if (avatar.ageRange === "idoso") enrDecay += 0.1;
				if (avatar.timeOnStreet === "recente") snyDecay += 0.1;
				if (avatar.timeOnStreet === "veterano") {
					snyDecay = Math.max(0, snyDecay - 0.2);
					modifyStat("health", -0.2);
				}
			}

			const totalWeight = inventory.reduce(
				(acc: number, i: { weight: number }) => acc + i.weight,
				0,
			);
			if (totalWeight > 10 && workTool.type !== "CARRINHO_RECICLAGEM")
				enrDecay += 0.3;

			if (activeBuffs.includes("DESMOTIVADO")) {
				enrDecay *= 2.0;
			}

			if (isRaining && !isAtShelter) {
				snyDecay += 1;
				hngDecay += 0.5;
				modifyStat("health", -0.5);
			}

			modifyStat("hunger", -hngDecay);
			modifyStat("hygiene", -hygDecay);
			modifyStat("energy", -enrDecay);
			modifyStat("sanity", -snyDecay);
			modifyStat("phoneBattery", -5);

			// Haptic Feedback for critical decay
			if (snyDecay > 1 || hngDecay > 3) triggerWarning();

			const rand = processRandomEvents({ dignity, workTool });
			if (rand) {
				if (rand.workTool) setWorkTool(rand.workTool);
				if (rand.dignity) {
					modifyStat("dignity", rand.dignity - dignity);
					triggerImpact(); // Bad event
				}
			}

			checkBattery();
			advanceTime(1);
		}, 10000);
		return () => clearInterval(interval);
	}, [
		socialStigma,
		isPaused,
		modifyStat,
		advanceTime,
		avatar,
		inventory,
		workTool,
		isRaining,
		isAtShelter,
		dignity,
		checkBattery,
		setWorkTool,
	]);

	useEffect(() => {
		// Run on mount (lastHourRef.current is null) or when time changes
		if (lastHourRef.current === null || time !== lastHourRef.current) {
			checkSystemicEvents(time);
			lastHourRef.current = time;
			if (Math.random() < 0.2) setIsRaining(true);
			else setIsRaining(false);
		}

		function checkSystemicEvents(currentHour: number) {
			if (activeDilemmaId) return;

			const triggered = dilemmaManager.findTriggeredDilemma({
				day,
				time: currentHour,
				health,
				hunger,
				hygiene,
				sanity,
				energy,
				socialStigma,
				userPosition,
				timeInLocation,
				activeDilemmaId,
				phoneBattery,
				avatar,
				inventory,
				workTool,
				activeBuffs,
				documents,
				flags,
			});

			if (triggered) {
				setActiveDilemma(triggered.id);
				return;
			}

			if (currentHour >= 22 || currentHour < 5) {
				if (!isAtShelter) {
					const hasCardboard = inventory.some(
						(i: { name: string }) => i.name === "Papelão",
					);
					modifyStat("health", hasCardboard ? -1 : -3);
					modifyStat("sanity", hasCardboard ? -1 : -3);
				}
			}

			if (activeBuffs.includes("SEDADO_CAPS")) modifyStat("energy", -5);

			// [NEW] PDU Victory Check
			// Check if current objective's final stage is completed
			// TRABALHO -> Final: "cadastro_cpat"
			// FAMILIA -> Final: "contato_telefonico" (Assume success for now, or check specific dilemma resolution)

			// Hardcoded Victory Triggers based on completion
			// Ideally we traverse PDU_QUESTS to find if last step is in completedStages
			// But for simplicity/performance in loop:

			if (pdu.isActive && pdu.objective) {
				const isVictoryTrabalho =
					pdu.objective === "TRABALHO" &&
					pdu.completedStages.includes("cadastro_cpat");
				const isVictoryFamilia =
					pdu.objective === "FAMILIA" &&
					pdu.completedStages.includes("contato_telefonico"); // Logic gap: This stage doesn't "complete" via dilemma yet properly in JSON?
				// Actually, let's trigger it if the "result" dilemma is resolved.
				// "pdu_dilemma_contact_result" ?? No, that's intermediate.
				// Let's rely on `pdu.completedStages` having the final ID.
				// Update dilemmas to ensure "contato_telefonico" marks itself complete.

				if (
					isVictoryTrabalho &&
					!resolvedDilemmas.includes("pdu_victory_trabalho")
				) {
					setActiveDilemma("pdu_victory_trabalho");
				}
				if (
					isVictoryFamilia &&
					!resolvedDilemmas.includes("pdu_victory_familia")
				) {
					setActiveDilemma("pdu_victory_familia");
				}
			}
		}
	}, [
		day,
		time,
		activeDilemmaId,
		health,
		hunger,
		hygiene,
		sanity,
		energy,
		activeBuffs,
		isAtShelter,
		inventory,
		setActiveDilemma,
		modifyStat,
		socialStigma,
		userPosition,
		phoneBattery,
		timeInLocation,
		pdu,
		pdu,
		resolvedDilemmas,
		documents,
		flags,
	]);

	return { isRaining, batteryLevel: phoneBattery / 100 };
}
