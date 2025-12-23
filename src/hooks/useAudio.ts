import { useCallback, useEffect, useRef } from "react";

// Tipos
export type AudioTrackId = string;

interface AudioOptions {
	volume?: number;
	loop?: boolean;
	fadeInDuration?: number; // em ms
	fadeOutDuration?: number; // em ms
	crossFade?: boolean; // Se deve fazer crossfade com o anterior
}

const FADE_STEP_MS = 50;
const DEFAULT_FADE_DURATION = 2000;

export function useAudio() {
	const currentAmbienceRef = useRef<HTMLAudioElement | null>(null);
	const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

	const stopAll = useCallback((fadeOutDuration = DEFAULT_FADE_DURATION) => {
		if (fadeIntervalRef.current) {
			clearInterval(fadeIntervalRef.current);
		}

		const audio = currentAmbienceRef.current;
		if (!audio) return;

		// Simple fade out
		const stepTime = FADE_STEP_MS;
		const steps = fadeOutDuration / stepTime;
		const stepVol = audio.volume / steps;

		fadeIntervalRef.current = setInterval(() => {
			if (audio.volume > stepVol) {
				audio.volume -= stepVol;
			} else {
				audio.volume = 0;
				audio.pause();
				if (fadeIntervalRef.current) {
					clearInterval(fadeIntervalRef.current);
				}
				currentAmbienceRef.current = null;
			}
		}, stepTime);
	}, []);

	const playAmbience = useCallback(
		(trackId: AudioTrackId, options: AudioOptions = {}) => {
			const src = `/sounds/${trackId}.mp3`;

			// If same track is playing, do nothing
			if (
				currentAmbienceRef.current?.src.endsWith(src) &&
				!currentAmbienceRef.current.paused
			) {
				return;
			}

			// Stop current with crossfade if requested
			if (currentAmbienceRef.current) {
				stopAll(options.fadeOutDuration || DEFAULT_FADE_DURATION);
			}

			const audio = new Audio(src);
			audio.loop = options.loop ?? true;
			audio.volume = 0; // Start silent for fade in

			// Cleanup on end if not looping
			if (!audio.loop) {
				audio.onended = () => {
					currentAmbienceRef.current = null;
				};
			}

			currentAmbienceRef.current = audio;

			audio.play().catch((e) => {
				console.warn("Audio play failed (user interaction needed?):", e);
			});

			// Fade in
			const targetVolume = options.volume ?? 0.5;
			const fadeInDuration = options.fadeInDuration ?? DEFAULT_FADE_DURATION;
			const stepTime = FADE_STEP_MS;
			const steps = fadeInDuration / stepTime;
			const stepVol = targetVolume / steps;

			let currentVol = 0;
			const interval = setInterval(() => {
				if (!currentAmbienceRef.current) {
					clearInterval(interval);
					return;
				}

				if (currentVol < targetVolume) {
					currentVol = Math.min(targetVolume, currentVol + stepVol);
					currentAmbienceRef.current.volume = currentVol;
				} else {
					clearInterval(interval);
				}
			}, stepTime);
		},
		[stopAll],
	);

	const playSfx = useCallback((trackId: AudioTrackId, volume = 1.0) => {
		const audio = new Audio(`/sounds/${trackId}.mp3`);
		audio.volume = Math.min(volume, 1);
		audio.play().catch(() => {}); // Fire and forget
	}, []);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (currentAmbienceRef.current) {
				currentAmbienceRef.current.pause();
				currentAmbienceRef.current = null;
			}
			if (fadeIntervalRef.current) {
				clearInterval(fadeIntervalRef.current);
			}
		};
	}, []);

	return { playAmbience, stopAll, playSfx };
}
