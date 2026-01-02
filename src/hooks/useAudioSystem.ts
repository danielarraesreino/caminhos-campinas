"use client";

import { useCallback, useEffect, useState } from "react";

// Global Audio State (Module Level)
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
}

// Track Mapping
const TRACK_MAP: Record<string, string> = {
	rain_heavy: "rain_heavy",
	chuva: "rain_heavy",
	traffic: "traffic",
	transito: "traffic",
	click: "click",
	clique: "click",
};

export function useAudioSystem(): AudioSystemCallbacks {
	const [pendingTrack, setPendingTrack] = useState<string | null>(null);
	const [isInitialized, setIsInitialized] = useState(false);
	const [, setLocalVolume] = useState(globalVolume);

	const initAudio = useCallback(() => {
		if (isInitialized) return;
		setIsInitialized(true);
	}, [isInitialized]);

	const stopAmbience = useCallback((options?: { fade?: boolean }) => {
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

	// Effect to play pending track once initialized
	useEffect(() => {
		if (isInitialized && pendingTrack) {
			const mappedId = TRACK_MAP[pendingTrack] || pendingTrack;
			const src = `/sounds/${mappedId}.mp3`;

			if (globalAmbience?.src.endsWith(src) && !globalAmbience.paused) {
				setPendingTrack(null);
				return;
			}

			stopAmbience();

			try {
				const audio = new Audio(src);
				audio.loop = true;
				audio.volume = globalVolume;
				audio
					.play()
					.catch((e) => console.warn("Pending audio play failed:", e));
				globalAmbience = audio;
			} catch (err) {
				console.error("Audio init error:", err);
			}
			setPendingTrack(null);
		}
	}, [isInitialized, pendingTrack, stopAmbience]);

	const playAmbience = useCallback(
		(trackId: string, options?: { fade?: boolean }) => {
			if (!isInitialized) {
				setPendingTrack(trackId);
				return;
			}

			const mappedId = TRACK_MAP[trackId] || trackId;
			const src = `/sounds/${mappedId}.mp3`;

			if (globalAmbience?.src.endsWith(src) && !globalAmbience.paused) {
				return;
			}

			stopAmbience(options);

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
				console.error("Audio play runtime error:", err);
			}
		},
		[isInitialized, stopAmbience],
	);

	const playSfx = useCallback((trackId: string) => {
		try {
			const mappedId = TRACK_MAP[trackId] || trackId;
			const audio = new Audio(`/sounds/${mappedId}.mp3`);
			audio.volume = globalVolume;
			audio.play().catch((e) => console.warn("SFX fail:", e));
		} catch (err) {
			console.error("SFX runtime error:", err);
		}
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
