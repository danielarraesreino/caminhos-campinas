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
	const [pendingTrack, setPendingTrack] = useState<string | null>(null);
	const [isInitialized, setIsInitialized] = useState(false);
	const [, setLocalVolume] = useState(globalVolume);

	const initAudio = useCallback(() => {
		if (isInitialized) return;
		setIsInitialized(true);
		// Resume context if needed (browsers usually handle this on play)
	}, [isInitialized]);

	// Effect to play pending track once initialized
	useEffect(() => {
		if (isInitialized && pendingTrack) {
			const src = `/sounds/${pendingTrack}.mp3`;
			// Check if already playing
			if (globalAmbience?.src.endsWith(src) && !globalAmbience.paused) {
				setPendingTrack(null);
				return;
			}

			// Stop existing
			if (globalAmbience) {
				globalAmbience.pause();
				globalAmbience = null;
			}

			const audio = new Audio(src);
			audio.loop = true;
			audio.volume = globalVolume; // Use module variable for latest volume
			audio.play().catch((e) => console.warn("Pending audio play failed:", e));
			globalAmbience = audio;
			setPendingTrack(null);
		}
	}, [isInitialized, pendingTrack]);

	const playAmbience = useCallback(
		(trackId: string) => {
			if (!isInitialized) {
				setPendingTrack(trackId);
				return;
			}

			// Construct path
			const src = `/sounds/${trackId}.mp3`;

			// Check if same src is already playing
			if (globalAmbience?.src.endsWith(src) && !globalAmbience.paused) {
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

			audio.play().catch((e) => {
				console.warn("Audio play failed (waiting for interaction):", e);
			});

			globalAmbience = audio;
		},
		[isInitialized],
	);

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
