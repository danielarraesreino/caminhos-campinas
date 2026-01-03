import { useCallback, useEffect, useRef, useState } from "react";
import { useGameContext } from "@/contexts/GameContext";
import { DilemmaManager } from "./DilemmaManager";
import { GAME_DILEMMAS } from "./dilemmas"; // Unified import source

const dilemmaManager = new DilemmaManager(GAME_DILEMMAS);

// Coordenadas do Centro de Campinas (Largo do Rosário/13 de Maio)
const CENTER_COORDS = { lat: -22.9055, lng: -47.0608 };
const IDLE_THRESHOLD = 3;

const getSanityDecayMultiplier = (stigma: number) => 1 + stigma / 100;

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
		addBuff,
		removeBuff,
		phoneBattery,
	} = useGameContext();

	const [isRaining, setIsRaining] = useState(false);
	// Refs to prevent effects running on every render
	const lastHourRef = useRef<number | null>(null);

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

			const rand = processRandomEvents({ dignity, workTool });
			if (rand) {
				if (rand.workTool) setWorkTool(rand.workTool);
				if (rand.dignity) modifyStat("dignity", rand.dignity - dignity);
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
	]);

	return { isRaining, batteryLevel: phoneBattery / 100 };
}
