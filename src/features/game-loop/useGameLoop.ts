import { useCallback, useEffect, useRef, useState } from "react";
import { useGameContext } from "@/contexts/GameContext";
import { useModalQueue } from "@/contexts/ModalQueueContext";
import { useHaptics } from "@/hooks/useHaptics";
import { DilemmaManager } from "./DilemmaManager";
import { GAME_DILEMMAS } from "./dilemmas"; // Unified import source

const dilemmaManager = new DilemmaManager(GAME_DILEMMAS);

// Coordenadas do Centro de Campinas (Largo do Rosário/13 de Maio)
const CENTER_COORDS = { lat: -22.9055, lng: -47.0608 };
const IDLE_THRESHOLD = 3;

const getSanityDecayMultiplier = (stigma: number) => 1 + stigma / 100;

// [DEMO_MODE] Flag for GovChallenge
const DEMO_MODE = true;

// biome-ignore lint/suspicious/noExplicitAny: legacy workTool type
const processRandomEvents = (state: { dignity: number; workTool: any }) => {
	// [DEMO_MODE] Disable 'O Rapa' (confiscation) to avoid frustration
	const chance = DEMO_MODE ? 0 : 0.02;
	if (Math.random() < chance) {
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
		hasHydrated,
	} = useGameContext();

	// [NEW] ModalQueue Integration
	const { enqueueDilemma } = useModalQueue();

	const [isRaining, setIsRaining] = useState(false);
	// Refs to prevent effects running on every render
	const lastHourRef = useRef<number | null>(null);
	// [NEW] Initialization throttle - prevents "metralhadora caótica"
	const [gameInitialized, setGameInitialized] = useState(false);
	const { triggerImpact, triggerWarning } = useHaptics();

	const [timeInLocation, setTimeInLocation] = useState(0);
	const [lastPosition, setLastPosition] = useState<[number, number] | null>(
		null,
	);

	// [NEW] 2-second initialization delay to prevent tutorial overlap
	useEffect(() => {
		if (hasHydrated && !gameInitialized) {
			const timer = setTimeout(() => {
				setGameInitialized(true);
				console.log(
					"[GameLoop] Initialization throttle complete - ready to process events",
				);
			}, 2000); // 2s delay
			return () => clearTimeout(timer);
		}
	}, [hasHydrated, gameInitialized]);

	// [NEW] Set data-game-ready flag for E2E tests
	useEffect(() => {
		if (typeof document !== "undefined" && gameInitialized && hasHydrated) {
			document.body.setAttribute("data-game-ready", "true");
			console.log("[GameLoop] Game ready flag set for E2E tests");
		}
	}, [gameInitialized, hasHydrated]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: Game loop logic depends on specific ticks
	useEffect(() => {
		// 🛡️ Guard: Wait for ecosystem
		if (!hasHydrated || isPaused) return;

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
		// 🛡️ Guard: Wait for ecosystem and avatar
		if (!hasHydrated || isPaused || !avatar) return;

		const interval = setInterval(
			() => {
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

					// [DEMO_MODE] Reduce sanity decay
					if (DEMO_MODE) {
						snyDecay *= 0.5;
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
				}
			},
			DEMO_MODE ? 30000 : 10000,
		); // 30s for Demo
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
		activeBuffs.includes,
		hasHydrated,
		triggerImpact,
		triggerWarning,
	]);

	useEffect(() => {
		// Run on mount or when time OR hydration status changes
		// We only run the check if hydrated. If we weren't hydrated when the hour changed,
		// we'll run it now because hasHydrated changed.
		if (
			hasHydrated &&
			(lastHourRef.current === null || time !== lastHourRef.current)
		) {
			// [CRITICAL] Use real local time for dilemas condizentes com a interação
			const currentRealHour = new Date().getHours();
			console.log(
				`[GameLoop] Triggering systemic event check for real hour ${currentRealHour}. (State hour: ${time})`,
			);
			checkSystemicEvents(currentRealHour);
			lastHourRef.current = time;

			if (Math.random() < 0.2) setIsRaining(true);
			else setIsRaining(false);
		}

		function checkSystemicEvents(currentHour: number) {
			// 🛡️ Guard: No events if already a dilemma is active
			if (activeDilemmaId) {
				console.log(
					`[GameLoop] Skipping dilemma check. activeDilemmaId: ${activeDilemmaId}`,
				);
				return;
			}

			// 🛡️ Guard: Wait for initialization throttle
			if (!gameInitialized) {
				console.log("[GameLoop] Skipping - initialization throttle active");
				return;
			}

			console.log(
				`[GameLoop] Running findTriggeredDilemma at hour ${currentHour}`,
			);

			try {
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
					tutorialActive: false, // [FIX] Explicitly pass false to unblock dilemmas
				});

				if (triggered) {
					// [NEW] Calculate priority based on player state
					let priority = 5; // default

					// Critical health/hunger = max priority
					if (health < 20 || hunger < 20) priority = 10;
					else if (sanity < 30) priority = 8;
					else if (triggered.intensity === "HIGH") priority = 7;
					else if (triggered.aspect === "FOOD" || triggered.aspect === "HEALTH")
						priority = 6;

					console.log(
						`[GameLoop] Enqueueing dilemma '${triggered.id}' with priority ${priority}`,
					);

					// [CHANGED] Use ModalQueue instead of direct trigger
					enqueueDilemma(triggered, priority);
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
				if (pdu.isActive && pdu.objective) {
					const isVictoryTrabalho =
						pdu.objective === "TRABALHO" &&
						pdu.completedStages.includes("cadastro_cpat");
					const isVictoryFamilia =
						pdu.objective === "FAMILIA" &&
						pdu.completedStages.includes("contato_telefonico");

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
			} catch (error) {
				// 🛡️ Safe Fail: Log but don't crash
				console.warn("⚠️ Game Loop Warning: Failed to check events", error);
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
		resolvedDilemmas,
		documents,
		flags,
		avatar,
		hasHydrated,
		workTool, // [CHANGED] Use ModalQueue instead of direct trigger
		enqueueDilemma,
		gameInitialized,
	]);

	return { isRaining, batteryLevel: phoneBattery / 100 };
}
