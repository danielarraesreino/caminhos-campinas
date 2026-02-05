"use client";

import { useEffect, useState } from "react";
import { useGameContext } from "@/contexts/GameContext";
import type { Dilemma } from "@/features/game-loop/dilemma-types";
import { GAME_DILEMMAS } from "@/features/game-loop/dilemmas";

export function GameEffectsLayer() {
	// Subscribing to game state
	const { health, sanity, phoneBattery, activeDilemmaId, activeBuffs } =
		useGameContext();
	const [isLowPowerMode, setIsLowPowerMode] = useState(false);

	// Detect low power devices or user preference (simplified)
	useEffect(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			setIsLowPowerMode(true);
		}
	}, []);

	// Look up active dilemma for immediate sensory feedback
	// We use require to avoid circular dependencies if any, or just import top level.
	// Ideally import GAME_DILEMMAS from "@/features/game-loop/dilemmas"
	// But let's use a dynamic import or just assume it's available.
	// For now, let's use a safe lookup if we can export it or just import.
	// Since this is a client component, we should import.
	// Note: If DilemmaManager is server-side only, we might have issues?
	// No, dilemmas.ts is shared.

	// We need to fetch the dilemma details. Since we don't have it in context, we resolve it.
	// In a real optimized app, context should pass the object.
	// For now, we import the static list.
	const activeDilemma = activeDilemmaId
		? GAME_DILEMMAS.find((d: Dilemma) => d.id === activeDilemmaId)
		: null;

	// Check if SEM_BATERIA buff is active
	const _isBatteryDead = activeBuffs?.includes("SEM_BATERIA");

	// Thresholds & Triggers
	const isLowHealth = health < 30;
	const isLowSanity = sanity < 20; // Lowered from 30 to prevent readability issues on Dashboard

	// Director Overrides (Visuals happen even if stats aren't low yet, to signal danger)
	const isHealthCrisis =
		activeDilemma?.aspect === "HEALTH" && activeDilemma?.intensity === "HIGH";
	const isSecurityCrisis =
		(activeDilemma?.aspect === "SECURITY" ||
			activeDilemma?.aspect === "WORK") &&
		activeDilemma?.intensity === "HIGH";
	const isMentalCrisis =
		(activeDilemma?.aspect === "FAMILY" ||
			activeDilemma?.aspect === "SOCIAL") &&
		activeDilemma?.intensity === "HIGH";

	const showRedPulse = isLowHealth || isHealthCrisis || isSecurityCrisis;
	const showGrayscale = isLowSanity || isMentalCrisis;

	if (!showRedPulse && !showGrayscale) return null;

	return (
		<div className="fixed inset-0 z-0 pointer-events-none overflow-hidden transition-opacity duration-1000 ease-in-out">
			{/* LOW HEALTH / DANGER VIGNETTE - Red Pulsing */}
			{showRedPulse && (
				<div
					className={`absolute inset-0 border-[6vw] border-red-900/40 rounded-[3rem] opacity-50 ${isLowPowerMode ? "" : "animate-pulse"}`}
					style={{
						boxShadow: "inset 0 0 100px rgba(150, 0, 0, 0.5)",
					}}
				/>
			)}

			{/* LOW SANITY / DEPRESSION VIGNETTE - Desaturation/Blur */}
			{showGrayscale && (
				<div
					className={`absolute inset-0 transition-all duration-1000 ${
						isLowPowerMode
							? "bg-gray-900/30 mix-blend-saturation" // Low power: simpler overlay
							: "backdrop-grayscale-[0.8] backdrop-blur-[2px]" // High power: filters
					}`}
				/>
			)}
		</div>
	);
}
