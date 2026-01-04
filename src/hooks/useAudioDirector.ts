"use client";

import { useEffect, useRef } from "react";
import { useGameContext } from "@/contexts/GameContext";
import { useAudioSystem } from "@/hooks/useAudioSystem";

export function useAudioDirector() {
	const { state } = useGameContext();
	const { playAmbience, playSfx, setVolume } = useAudioSystem();
	const lastHourRef = useRef(state.time);

	useEffect(() => {
		// Initialize Audio System
		const interactHandler = () => {
			// Browser requires interaction to play audio
			// We can optimistically try to resume context here if we had access to it,
			// but essentially this handler is just a placeholder for now unless we invoke a "resume" method.
		};
		document.addEventListener("click", interactHandler);
		// Clean up
		return () => document.removeEventListener("click", interactHandler);
	}, []);

	// 1. Cycle Day/Night & Traffic
	useEffect(() => {
		const hour = state.time % 24;
		const isNight = hour >= 19 || hour < 6;

		// Base Ambience
		// We use 'traffic' as the city hum.
		// At night, volume lowers or track changes.

		// Check for specific conditions overriding normal ambience
		if (state.health < 20) {
			// Low Health - Tension
			setVolume(0.3);
		} else if (state.sanity < 30) {
			// Low Sanity - Disorienting
			setVolume(0.8);
		} else {
			// Normal State
			setVolume(isNight ? 0.4 : 0.6);
		}

		// Logic to trigger ambience track
		// Wrapped in try-catch via the hook usually, but good to be safe if Logic changes
		try {
			playAmbience("traffic", { fade: true });
		} catch (err) {
			console.warn("[AudioDirector] Autoplay prevented or audio error:", err);
		}
	}, [state.time, state.health, state.sanity, playAmbience, setVolume]);

	// 2. Event Triggers (One-shot SFX)
	useEffect(() => {
		if (state.time !== lastHourRef.current) {
			// Time changed
			lastHourRef.current = state.time;
		}
	}, [state.time]);

	return null; // Logic-only hook
}
