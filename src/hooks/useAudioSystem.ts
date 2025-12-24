import { useCallback, useEffect, useState } from "react";

// Global Audio State (Module Level)
// This ensures that even if the hook is used in multiple components,
// there is only ONE ambient track playing at a time.
let globalAmbience: HTMLAudioElement | null = null;
let globalVolume = 0.5;

type AudioState = "IDLE" | "PLAYING" | "MUTED";

interface AudioSystemCallbacks {
	playAmbience: (trackId: string) => void;
	playSfx: (trackId: string) => void;
	stopAmbience: () => void;
	setVolume: (volume: number) => void;
	initAudio: () => void;
}

export function useAudioSystem(): AudioSystemCallbacks {
	const [isInitialized, setIsInitialized] = useState(false);

	// Sync local volume state with global for reactivity if needed,
	// but for now we just control the global.
	const [volume, setLocalVolume] = useState(globalVolume);

	const initAudio = useCallback(() => {
		if (isInitialized) return;
		setIsInitialized(true);
		// Unlock logic if needed
	}, [isInitialized]);

	const playAmbience = useCallback((trackId: string) => {
		// Construct path
		const src = `/sounds/${trackId}.mp3`;

		// Check if same src is already playing
		if (
			globalAmbience &&
			globalAmbience.src.endsWith(src) &&
			!globalAmbience.paused
		) {
			return;
		}

		// Stop existing
		if (globalAmbience) {
			globalAmbience.pause();
			globalAmbience = null;
		}

		// Create new
		const audio = new Audio(src);
		audio.loop = true;
		audio.volume = globalVolume;

		// Auto-play if initialized (or try anyway)
		// Note: If not initialized by interaction, this might fail.
		audio.play().catch((e) => {
			console.warn("Audio play failed (waiting for interaction):", e);
		});

		globalAmbience = audio;
	}, []);

	const stopAmbience = useCallback(() => {
		if (globalAmbience) {
			globalAmbience.pause();
			globalAmbience = null;
		}
	}, []);

	const playSfx = useCallback((trackId: string) => {
		const audio = new Audio(`/sounds/${trackId}.mp3`);
		audio.volume = globalVolume;
		audio.play().catch((e) => console.warn("SFX fail:", e));
	}, []);

	const setVolume = useCallback((vol: number) => {
		globalVolume = vol;
		setLocalVolume(vol);
		if (globalAmbience) {
			globalAmbience.volume = vol;
		}
	}, []);

	return {
		playAmbience,
		playSfx,
		stopAmbience,
		setVolume,
		initAudio,
	};
}
