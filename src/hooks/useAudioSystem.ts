"use client";

import { useCallback, useRef, useState } from "react";

// Global Audio State (Module Level) for Singleton behavior across component unmounts
let globalAmbience: HTMLAudioElement | null = null;
let globalVolume = 0.5;
let fadeInterval: NodeJS.Timeout | null = null;

const FADE_STEP_MS = 50;
const DEFAULT_FADE_DURATION = 1000;

interface AudioSystemCallbacks {
	playAmbience: (trackId: string, options?: { fade?: boolean }) => void;
	playSfx: (trackId: string) => void;
	stopAmbience: (options?: { fade?: boolean }) => void;
	setVolume: (volume: number) => void;
	initAudio: () => void;
	isPlaying: boolean;
}

// Track Mapping
const TRACK_MAP: Record<string, string> = {
	// Existentes
	rain_heavy: "rain_heavy",
	chuva: "rain_heavy",
	traffic: "traffic",
	transito: "traffic",
	click: "click",
	clique: "click",

	// NOVOS - Atmosfera Narrativa (com fallbacks)
	heartbeat: "rain_heavy",
	phone_ring: "click",
	bureaucracy: "traffic",
	street_noise: "traffic",
	despair: "rain_heavy",
};

export function useAudioSystem(): AudioSystemCallbacks {
	// [FIX] Use Refs for internal tracking to stay out of render cycle
	const currentAmbienceRef = useRef<string | null>(null);
	// We still use some state for UI reactivity if needed, but carefully
	const [isPlaying, setIsPlaying] = useState(false);
	const [isInitialized, setIsInitialized] = useState(false);

	const initAudio = useCallback(() => {
		if (isInitialized) return;
		setIsInitialized(true);
	}, [isInitialized]);

	const stopAmbience = useCallback((options?: { fade?: boolean }) => {
		currentAmbienceRef.current = null;

		// Guard: Only update state if it changes
		setIsPlaying((prev) => (prev ? false : prev));

		if (!globalAmbience) return;

		if (options?.fade) {
			if (fadeInterval) clearInterval(fadeInterval);

			const audio = globalAmbience;
			const steps = DEFAULT_FADE_DURATION / FADE_STEP_MS;
			const stepVol = audio.volume / steps;

			fadeInterval = setInterval(() => {
				if (audio.volume > stepVol) {
					audio.volume -= stepVol;
				} else {
					audio.volume = 0;
					audio.pause();
					if (fadeInterval) clearInterval(fadeInterval);
					if (globalAmbience === audio) globalAmbience = null;
				}
			}, FADE_STEP_MS);
		} else {
			globalAmbience.pause();
			globalAmbience = null;
		}
	}, []);

	const playAmbience = useCallback(
		(trackId: string, options?: { fade?: boolean }) => {
			if (!isInitialized) return;

			// [FIX] Guard: Block duplicate calls for same track
			if (currentAmbienceRef.current === trackId) {
				// Ensure global matches reality (recovery)
				if (globalAmbience && !globalAmbience.paused) return;
			}

			currentAmbienceRef.current = trackId;
			setIsPlaying((prev) => (!prev ? true : prev));

			const mappedId = TRACK_MAP[trackId] || trackId;
			const src = `/sounds/${mappedId}.wav`;

			// Check actual audio element
			if (globalAmbience?.src.endsWith(src) && !globalAmbience.paused) {
				return;
			}

			// Stop previous
			if (globalAmbience) {
				// Instant stop of previous if switching, or let stopAmbience handle it?
				// To force switch, we stop current logic.
				if (fadeInterval) clearInterval(fadeInterval);
				globalAmbience.pause();
			}

			try {
				const audio = new Audio(src);
				audio.loop = true;

				if (options?.fade) {
					audio.volume = 0;
					audio.play().catch(() => {});

					const steps = DEFAULT_FADE_DURATION / FADE_STEP_MS;
					const stepVol = globalVolume / steps;
					let currentVol = 0;

					const interval = setInterval(() => {
						if (currentVol < globalVolume) {
							currentVol = Math.min(globalVolume, currentVol + stepVol);
							audio.volume = currentVol;
						} else {
							clearInterval(interval);
						}
					}, FADE_STEP_MS);
				} else {
					audio.volume = globalVolume;
					audio.play().catch((e) => {
						console.warn("Audio play failed:", e);
					});
				}
				globalAmbience = audio;
			} catch (err) {
				console.warn("Audio play runtime error:", err);
			}
		},
		[isInitialized],
	);

	const playSfx = useCallback((trackId: string) => {
		try {
			const mappedId = TRACK_MAP[trackId] || trackId;
			const audio = new Audio(`/sounds/${mappedId}.wav`);
			audio.volume = globalVolume;
			audio
				.play()
				.catch((e) => console.warn("SFX fail (user interaction required):", e));
		} catch (err) {
			console.warn("SFX runtime error:", err);
		}
	}, []);

	const setVolume = useCallback((vol: number) => {
		globalVolume = vol;
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
		isPlaying,
	};
}
