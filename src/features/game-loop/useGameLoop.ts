import { useCallback, useEffect, useRef, useState } from "react";
import { useGameContext } from "@/contexts/GameContext";
import { GAME_DILEMMAS } from "./dilemmas"; // Unified import source

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
	const lastHourRef = useRef(time);
	const CENTER_COORDS = { lat: -22.9055, lng: -47.0608 };
	const IDLE_THRESHOLD = 3;

	const [timeInLocation, setTimeInLocation] = useState(0);
	const [lastPosition, setLastPosition] = useState<[number, number] | null>(null);

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
	}, [timeInLocation, userPosition]);

	const getSanityDecayMultiplier = (stigma: number) => 1 + stigma / 100;

	const processRandomEvents = (state: any) => {
		if (Math.random() < 0.02) {
			return {
				workTool: { ...state.workTool, isConfiscated: true },
				dignity: state.dignity - 15,
			};
		}
		return null;
	};

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

			const totalWeight = inventory.reduce((acc: number, i: any) => acc + i.weight, 0);
			if (totalWeight > 10 && workTool.type !== "CARRINHO_RECICLAGEM") enrDecay += 0.3;

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
	}, [health, hunger, hygiene, sanity, energy, socialStigma, isPaused, modifyStat, advanceTime, avatar, inventory, workTool, isRaining, isAtShelter, dignity, phoneBattery, checkBattery]);

	useEffect(() => {
		if (time !== lastHourRef.current) {
			checkSystemicEvents(time);
			lastHourRef.current = time;
			if (Math.random() < 0.2) setIsRaining(true);
			else setIsRaining(false);
		}

		function checkSystemicEvents(currentHour: number) {
			if (activeDilemmaId) return;
			if (currentHour >= 22 || currentHour < 5) {
				if (!isAtShelter) {
					const hasCardboard = inventory.some((i: any) => i.name === "Papelão");
					modifyStat("health", hasCardboard ? -1 : -3);
					modifyStat("sanity", hasCardboard ? -1 : -3);
				}
			}
			for (const dilemma of GAME_DILEMMAS) {
				if (resolvedDilemmas.includes(dilemma.id) && !dilemma.repeatable) continue;
				if (dilemma.prerequisite && !resolvedDilemmas.includes(dilemma.prerequisite)) continue;

				let triggered = false;
				const { type, value } = dilemma.trigger;
				switch (type) {
					case "RANDOM": if (Math.random() < value) triggered = true; break;
					case "HUNGER_LOW": if (hunger < value) triggered = true; break;
					case "HYGIENE_LOW": if (hygiene < value) triggered = true; break;
					case "SOCIAL_STIGMA_HIGH": if (socialStigma > value) triggered = true; break;
					case "LOCATION":
						if (dilemma.location_trigger && userPosition) {
							const dist = calculateDistance(userPosition[0], userPosition[1], dilemma.location_trigger.lat, dilemma.location_trigger.lng);
							if (dist * 1000 <= (dilemma.location_trigger.radius || 50)) triggered = true;
						}
						break;
					case "LOCATION_IDLE":
						if (timeInLocation >= value) {
							if (dilemma.location_trigger && userPosition) {
								const dist = calculateDistance(userPosition[0], userPosition[1], dilemma.location_trigger.lat, dilemma.location_trigger.lng);
								if (dist * 1000 <= (dilemma.location_trigger.radius || 50)) triggered = true;
							} else if (dilemma.id === "enquadro_13_maio" && userPosition) {
								const dist = calculateDistance(userPosition[0], userPosition[1], CENTER_COORDS.lat, CENTER_COORDS.lng);
								if (dist < 0.005) triggered = true;
							} else triggered = true;
						}
						break;
					case "STATUS":
						if (dilemma.trigger.statusCondition?.battery !== undefined && phoneBattery <= dilemma.trigger.statusCondition.battery) triggered = true;
						break;
				}
				if (triggered) { setActiveDilemma(dilemma.id); return; }
			}
			if (activeBuffs.includes("SEDADO_CAPS")) modifyStat("energy", -5);
		}
	}, [time, activeDilemmaId, resolvedDilemmas, hunger, hygiene, activeBuffs, isAtShelter, inventory, setActiveDilemma, modifyStat, socialStigma, userPosition, phoneBattery, timeInLocation]);

	return { isRaining, batteryLevel: phoneBattery / 100 };
}
