import { useEffect, useRef, useState } from "react";
import { useGameContext } from "@/contexts/GameContext";
import { useSurvivalLogic } from "@/hooks/useSurvivalLogic";
import { GAME_DILEMMAS } from "./dilemmas";
import { applyWeatherEffects, processRandomEvents } from "./eventEngine";

export function useGameLoop() {
	const {
		health,
		hunger,
		hygiene,
		dignity,
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

			// 3. Efeitos Atmosféricos e Eventos Randômicos
			const stateSnap = {
				health,
				hunger,
				hygiene,
				dignity,
				sanity,
				energy,
				socialStigma,
				workTool,
				inventory,
				isAtShelter,
			} as any;

			if (health <= 0) {
				if (activeDilemmaId !== "game-over") {
					setActiveDilemma("game-over");
				}
				return;
			}

			// REFATORAÇÃO: GAME OVER SOCIAL (Depressão Profunda/Desistência)
			// Se a Dignidade chega a 0, o jogador não tem mais forças para lutar.
			if (stateSnap.dignity <= 0) {
				if (activeDilemmaId !== "game-over") {
					setActiveDilemma("game-over");
				}
				return;
			}

			// 1. Clima Dinâmico (Chuva) - 5% de chance a cada tick (10s)
			if (Math.random() < 0.05) {
				setIsRaining((prev) => !prev);
			}

			// REFATORAÇÃO: TAXAS DE DECAIMENTO (Core_Mechanics.md)
			// Baseado na "Fome Apertando" e necessidade de Serviços
			let hngDecay = 0.4; // Fome aperta mais rápido (antes 0.2)
			const hygDecay = 0.3; // Higiene degrada constante (antes 0.08)
			let enrDecay = 0.2;
			let snyDecay = 0.15 * getSanityDecayMultiplier();

			// Modificadores de Avatar
			if (avatar) {
				if (avatar.ageRange === "jovem") hngDecay += 0.1; // Metabolismo rápido
				if (avatar.ageRange === "idoso") enrDecay += 0.1; // Cansaço rápido
				if (avatar.timeOnStreet === "recente") snyDecay += 0.1; // Choque de realidade
			}

			// 2. Refatoração de Inventário (Peso Realista)
			// Carrinho protege contra sobrecarga
			const totalWeight = inventory.reduce((acc, i) => acc + i.weight, 0);
			if (totalWeight > 10 && workTool.type !== "CARRINHO_RECICLAGEM") {
				enrDecay += 0.3; // Carregar peso na mão exaure
			}

			// Eventos de Clima
			const weatherEffects = applyWeatherEffects(stateSnap, isRaining);
			if (weatherEffects.health)
				modifyStat("health", weatherEffects.health - health);
			if (weatherEffects.workTool) setWorkTool(weatherEffects.workTool);

			// Eventos Randômicos (O Rapa, etc)
			const randomEventEffects = processRandomEvents(stateSnap);
			if (randomEventEffects) {
				if (randomEventEffects.workTool !== undefined)
					setWorkTool(randomEventEffects.workTool);
				if (randomEventEffects.inventory !== undefined) {
					// Simplificado: assume que se mudou inventário, ele foi limpo
					for (const item of inventory) removeFromInventory(item.id);
				}
				if (randomEventEffects.dignity)
					modifyStat("dignity", randomEventEffects.dignity - stateSnap.dignity);
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
		dignity,
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
		inventory,
		setActiveDilemma,
		modifyStat,
		checkShelterBarrier,
		socialStigma,
	]);

	return { isRaining };
}
