import { useEffect, useRef, useState } from "react";
import { useGameContext } from "@/contexts/GameContext";
import { useSurvivalLogic } from "@/hooks/useSurvivalLogic";
import { processRandomEvents, applyWeatherEffects } from "./eventEngine";
import { GAME_DILEMMAS } from "./dilemmas";

export function useGameLoop() {
	const {
		health,
		hunger,
		hygiene,
		energy,
		sanity,
		socialStigma,
		activeBuffs,
		time,
		activeDilemmaId,
		resolvedDilemmas,
		isAtShelter,
		workTool,
		inventory,
		avatar,
		isPaused,
		modifyStat,
		setActiveDilemma,
		advanceTime,
		removeFromInventory,
		setWorkTool,
		addToInventory,
	} = useGameContext();

	const { getSanityDecayMultiplier, checkShelterBarrier } = useSurvivalLogic();

	const lastHourRef = useRef(time);
	const [isRaining, setIsRaining] = useState(false);

	useEffect(() => {
		const interval = setInterval(() => {
			if (isPaused || activeDilemmaId) return;

			if (health <= 0) {
				if (activeDilemmaId !== "game-over") {
					setActiveDilemma("game-over");
				}
				return;
			}

			// 1. Clima Dinâmico (Chuva)
			if (Math.random() < 0.05) {
				setIsRaining((prev) => !prev);
			}

			// Decadência passiva suavizada (ritmo de Campinas)
			let hngDecay = 0.2;   // Reduzido: -0.5 → -0.2 (60% menor)
			let hygDecay = 0.08;  // Reduzido: -0.2 → -0.08 (60% menor)
			let enrDecay = 0.08;  // Reduzido: -0.2 → -0.08 (60% menor)
			let snyDecay = 0.08 * getSanityDecayMultiplier();  // Reduzido: -0.2 → -0.08 (60% menor)

			if (avatar) {
				if (avatar.ageRange === "jovem") hngDecay += 0.04;    // Proporcional
				if (avatar.ageRange === "idoso") enrDecay += 0.04;    // Proporcional
				if (avatar.timeOnStreet === "recente") hygDecay += 0.04;  // Proporcional
			}

			// 2. Refatoração de Inventário (Peso)
			const totalWeight = inventory.reduce((acc, i) => acc + i.weight, 0);
			if (totalWeight > 10 && workTool.type !== "CARRINHO_RECICLAGEM") {
				enrDecay += 0.12; // Sobrecarga física (reduzido proporcionalmente)
			}

			// 3. Efeitos Atmosféricos e Eventos Randômicos
			const stateSnap = { health, hunger, hygiene, sanity, energy, socialStigma, workTool, inventory, isAtShelter } as any;

			// Eventos de Clima
			const weatherEffects = applyWeatherEffects(stateSnap, isRaining);
			if (weatherEffects.health) modifyStat("health", weatherEffects.health - health);
			if (weatherEffects.workTool) setWorkTool(weatherEffects.workTool);

			// Eventos Randômicos (O Rapa, etc)
			const randomEventEffects = processRandomEvents(stateSnap);
			if (randomEventEffects) {
				if (randomEventEffects.workTool !== undefined) setWorkTool(randomEventEffects.workTool);
				if (randomEventEffects.inventory !== undefined) {
					// Simplificado: assume que se mudou inventário, ele foi limpo
					for (const item of inventory) removeFromInventory(item.id);
				}
				if (randomEventEffects.dignity) modifyStat("dignity", randomEventEffects.dignity - stateSnap.dignity);
			}

			modifyStat("hunger", -hngDecay);
			modifyStat("hygiene", -hygDecay);
			modifyStat("energy", -enrDecay);
			modifyStat("sanity", -snyDecay);

			// Avanço de tempo automático
			advanceTime(1);
		}, 10000);

		return () => clearInterval(interval);
	}, [
		health,
		hunger,
		hygiene,
		sanity,
		energy,
		socialStigma,
		activeDilemmaId,
		isPaused,
		modifyStat,
		advanceTime,
		setActiveDilemma,
		avatar,
		inventory,
		workTool,
		isRaining,
		isAtShelter,
		removeFromInventory,
		setWorkTool,
		getSanityDecayMultiplier,
	]);

	// Efeito separado para checar eventos sistêmicos quando a hora muda
	useEffect(() => {
		if (time !== lastHourRef.current) {
			checkSystemicEvents(time);
			lastHourRef.current = time;
		}

		function checkSystemicEvents(currentHour: number) {
			if (activeDilemmaId) return;

			// 1. CHECK DE FERRAMENTA DE TRABALHO (Bloqueio Institucional)
			checkShelterBarrier();

			// 2. CHECK DE CLIMA/ABRIGO (Frio Real)
			if (currentHour >= 22 || currentHour < 5) {
				if (!isAtShelter) {
					const hasCardboard = inventory.some((i) => i.name === "Papelão");
					if (hasCardboard) {
						modifyStat("health", -1); // Suavizado com papelão
						modifyStat("sanity", -1);
					} else {
						modifyStat("health", -5);
						modifyStat("sanity", -5);
					}
				}
			}

			// 3. Procurar dilemas elegíveis em GAME_DILEMMAS
			for (const dilemma of GAME_DILEMMAS) {
				if (resolvedDilemmas.includes(dilemma.id)) continue;

				// Check Prerequisite (Quest Line)
				if (
					dilemma.prerequisite &&
					!resolvedDilemmas.includes(dilemma.prerequisite)
				) {
					continue;
				}

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
				}

				if (triggered) {
					setActiveDilemma(dilemma.id);
					return; // Apenas um dilema por vez
				}
			}

			// 4. Efeito de Sedação do CAPS (Sistêmico)
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
		workTool,
		inventory,
		setActiveDilemma,
		modifyStat,
		checkShelterBarrier,
	]);
}
