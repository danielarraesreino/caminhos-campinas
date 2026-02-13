"use client";

import { useEffect, useRef } from "react";
import { useGameContext } from "@/contexts/GameContext";
import { detectActiveArc } from "@/data/story-arcs";
import { useAudioSystem } from "@/hooks/useAudioSystem";

export function useAudioDirector() {
	const gameContext = useGameContext();
	// Defensively access properties in case context is partial or undefined during init
	// Defensively access properties
	const time = gameContext?.time ?? 8;
	const health = gameContext?.health ?? 100;
	const sanity = gameContext?.sanity ?? 80;
	const activeDilemmaId = gameContext?.activeDilemmaId;
	const hasHydrated = gameContext?.hasHydrated;

	const { playAmbience, setVolume } = useAudioSystem();

	const lastHourRef = useRef(time || 8);

	useEffect(() => {
		// Initialize Audio System
		const interactHandler = () => {
			// Placeholder for resume context
		};
		document.addEventListener("click", interactHandler);
		return () => document.removeEventListener("click", interactHandler);
	}, []);

	const lastVolumeRef = useRef(-1); // [NEW] Prevent volume loop

	useEffect(() => {
		// 🛡️ Guard: Wait for data
		if (!hasHydrated) return;

		const hour = (time || 0) % 24;
		const isNight = hour >= 19 || hour < 6;

		// 🎭 STORY ARC DETECTION
		const activeArc = detectActiveArc(activeDilemmaId);

		// Lookup Active Dilemma for Sensory Overrides
		let activeDilemma: any = null;
		if (activeDilemmaId) {
			try {
				// Inline require to avoid top-level optional chaining issues if module not ready
				activeDilemma =
					require("@/features/game-loop/dilemmas").GAME_DILEMMAS.find(
						(d: any) => d.id === activeDilemmaId,
					);
			} catch (e) {
				console.warn("Audio Director could not load dilemmas", e);
			}
		}

		// Base Ambience Logic
		let targetVolume = isNight ? 0.4 : 0.6;

		// 🎵 AUDIO FIRST: Seleção dinâmica de track baseada no contexto
		const getAmbienceTrack = (): string => {
			// 🎭 PRIORIDADE 0: Story Arc Override
			if (activeArc?.audioProfile.ambience) {
				return activeArc.audioProfile.ambience;
			}

			// Prioridade 1: Dilema com audioId específico
			if (activeDilemma?.audioId) {
				return activeDilemma.audioId;
			}

			// Prioridade 2: Estado mental do jogador
			if (sanity < 30) {
				return "rain_heavy"; // Chuva = ambiente opressivo para sanidade baixa
			}

			// Prioridade 3: Horário do dia
			if (isNight) {
				return "rain_heavy"; // Noite = chuva, atmosfera isolada
			}

			// Default: Trânsito durante o dia
			return "traffic";
		};

		const targetTrack = getAmbienceTrack();

		// 🎭 STORY ARC: Ajustar volume baseado na intensidade do arco
		if (activeArc) {
			const intensityVolume = {
				LOW: 0.4,
				MEDIUM: 0.6,
				HIGH: 0.9,
			}[activeArc.audioProfile.intensity];
			targetVolume = intensityVolume;
		}
		// Priority 1: Director High Intensity (Crisis)
		else if (activeDilemma?.intensity === "HIGH") {
			// High Intensity overrides everything
			targetVolume = 0.9; // Loud

			if (
				activeDilemma?.aspect === "HEALTH" || // 🛡️ Optional Chaining
				activeDilemma?.aspect === "SECURITY"
			) {
				// Danger / Sirens / Heartbeat (simulated by volume/track if we had multiple)
				// For now, boost volume to max to create urgency
				targetVolume = 1.0;
			}
		}
		// Priority 2: Low Stats
		else if (health < 20) {
			targetVolume = 0.3; // Weakness
		} else if (sanity < 30) {
			targetVolume = 0.8; // Noise/Confusion
		}

		// [FIX] Loop Prevention: Only update if volume changed significantly
		if (Math.abs(lastVolumeRef.current - targetVolume) > 0.05) {
			setVolume(targetVolume);
			lastVolumeRef.current = targetVolume;
		}

		// Logic to trigger ambience track
		try {
			playAmbience(targetTrack, { fade: true });
		} catch (err) {
			console.warn("[AudioDirector] Autoplay prevented or audio error:", err);
		}
	}, [
		time,
		health,
		sanity,
		activeDilemmaId,
		hasHydrated,
		playAmbience,
		setVolume,
		// playAmbience e setVolume removidos para evitar loop infinito se não forem estáveis
	]);

	// 2. Event Triggers (One-shot SFX)
	useEffect(() => {
		if (time !== lastHourRef.current) {
			// Time changed
			lastHourRef.current = time;
		}
	}, [time]);

	return null; // Logic-only hook
}
