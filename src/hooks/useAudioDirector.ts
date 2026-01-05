"use client";

import { useEffect, useRef } from "react";
import { useGameContext } from "@/contexts/GameContext";
import { useAudioSystem } from "@/hooks/useAudioSystem";

export function useAudioDirector() {
	const gameContext = useGameContext();
	// Defensively access properties in case context is partial or undefined during init
	// Defensively access properties
	const time = gameContext?.time ?? 8;
	const health = gameContext?.health ?? 100;
	const sanity = gameContext?.sanity ?? 80;
	const activeDilemmaId = gameContext?.activeDilemmaId;

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

	// 1. Cycle Day/Night & Traffic & Director Intensity
	useEffect(() => {
		const hour = (time || 0) % 24;
		const isNight = hour >= 19 || hour < 6;

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
		let targetTrack = "traffic"; // Default

		// Priority 1: Director High Intensity (Crisis)
		if (activeDilemma?.intensity === "HIGH") {
			// High Intensity overrides everything
			targetVolume = 0.9; // Loud

			if (
				activeDilemma.aspect === "HEALTH" ||
				activeDilemma.aspect === "SECURITY"
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

		setVolume(targetVolume);

		// Logic to trigger ambience track
		try {
			playAmbience(targetTrack, { fade: true });
		} catch (err) {
			console.warn("[AudioDirector] Autoplay prevented or audio error:", err);
		}
	}, [time, health, sanity, activeDilemmaId, playAmbience, setVolume]);

	// 2. Event Triggers (One-shot SFX)
	useEffect(() => {
		if (time !== lastHourRef.current) {
			// Time changed
			lastHourRef.current = time;
		}
	}, [time]);

	return null; // Logic-only hook
}
