"use client";

import { useCallback, useEffect, useRef } from "react";
import { useGameContext } from "@/contexts/GameContext";
import { STORY_ARCS } from "@/data/story-arcs";
import { useAudioSystem } from "@/hooks/useAudioSystem";

export function useAudioDirector() {
	const {
		activeArcId,
		activeDilemmaId,
		isPaused,
		health,
		sanity,
		time,
		hasHydrated,
	} = useGameContext();
	const { playAmbience, stopAmbience, setVolume } = useAudioSystem();

	// [FIX] Refs para prevenir loop - NÃO use estado aqui
	const lastArcRef = useRef<string | null>(null);
	const lastDilemmaRef = useRef<string | null>(null);
	const lastTrackRef = useRef<string | null>(null);
	const lastVolumeRef = useRef<number>(-1);
	const isPlayingRef = useRef(false);
	const audioInitializedRef = useRef(false);

	// [FIX] Memoize playAmbience para não recrear a cada render
	const playAmbienceMemo = useCallback(
		(trackId: string) => {
			if (isPlayingRef.current && lastTrackRef.current === trackId) return;
			isPlayingRef.current = true;
			lastTrackRef.current = trackId;
			playAmbience(trackId, { fade: true });
		},
		[playAmbience],
	);

	useEffect(() => {
		if (!hasHydrated) return;

		// [FIX] Guard 1: Não fazer nada se pausado
		if (isPaused) {
			stopAmbience({ fade: true });
			isPlayingRef.current = false;
			lastTrackRef.current = null;
			return;
		}

		// [FIX] Guard 3: Prevenir execução no primeiro render (hydration)
		if (!audioInitializedRef.current) {
			audioInitializedRef.current = true;
			// Allow first run to proceed
		}

		// Logic to determine track
		let targetTrack = "traffic"; // Default
		const hour = (time || 0) % 24;
		const isNight = hour >= 19 || hour < 6;

		// 1. Arc Override
		if (activeArcId) {
			// Convert slug to key if needed, or lookup directly
			const arcKey = activeArcId.toUpperCase().replace(/-/g, "_");
			const arc = STORY_ARCS[arcKey];
			if (arc?.audioProfile?.ambience) {
				targetTrack = arc.audioProfile.ambience;
			}
		}

		// 2. Mental State Override
		if ((sanity ?? 100) < 30) {
			targetTrack = "rain_heavy";
		} else if (isNight && targetTrack === "traffic") {
			targetTrack = "rain_heavy"; // Night default
		}

		// 3. Dilemma Specific (highest priority)
		// If we had dilemma details, we'd check them here.
		// For now, let's assume dilemma doesn't override unless necessary.

		// [FIX] Apenas atualizar se houver mudança real de TRILHA
		if (targetTrack !== lastTrackRef.current) {
			playAmbienceMemo(targetTrack);
		}

		// Update Refs for guards
		lastArcRef.current = activeArcId || null;
		lastDilemmaRef.current = activeDilemmaId || null;

		// Volume Logic
		let targetVolume = isNight ? 0.4 : 0.6;
		if ((health ?? 100) < 20) targetVolume = 0.3;
		if ((sanity ?? 100) < 30) targetVolume = 0.8;

		if (Math.abs(lastVolumeRef.current - targetVolume) > 0.05) {
			setVolume(targetVolume);
			lastVolumeRef.current = targetVolume;
		}

		// Cleanup
		return () => {
			// Não parar áudio no cleanup para evitar flicker entre renders
		};
	}, [
		// [FIX] Dependências mínimas e estáveis
		isPaused,
		activeArcId,
		activeDilemmaId,
		hasHydrated,
		playAmbienceMemo,
		stopAmbience,
		setVolume,
		health,
		sanity,
		time,
	]);
}
