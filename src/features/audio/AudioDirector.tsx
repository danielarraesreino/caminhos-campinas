"use client";

import { Mic, SkipForward, Volume2, VolumeX } from "lucide-react";
import { useEffect, useState } from "react";
import { useGameContext } from "@/contexts/GameContext";
import { useNarration } from "@/contexts/NarrationContext";
import { detectActiveArc } from "@/data/story-arcs";
import type { Dilemma } from "@/features/game-loop/dilemma-types";

export function AudioDirector() {
	const { activeDilemmaId, hasHydrated } = useGameContext();
	const [activeDilemma, setActiveDilemma] = useState<Dilemma | null>(null);
	const { isNarrating, currentText, clearNarrationQueue } = useNarration();
	const [isMuted, setIsMuted] = useState(false);
	const [audioProgress, setAudioProgress] = useState(0);

	// AudioDirector now delegates narration to NarrationContext
	// but can still show progress for the current text if needed.
	// Progress simulation can be moved to context or kept here if we track duration.
	useEffect(() => {
		if (isNarrating && currentText) {
			const estimatedDuration = (currentText.length / 15) * 1000;
			const startTime = Date.now();
			const interval = setInterval(() => {
				const elapsed = Date.now() - startTime;
				const p = Math.min(99, (elapsed / estimatedDuration) * 100);
				setAudioProgress(p);
			}, 100);
			return () => clearInterval(interval);
		}
		setAudioProgress(0);
	}, [isNarrating, currentText]);

	// Load dilemma data when ID changes (UI only)
	useEffect(() => {
		if (!activeDilemmaId || !hasHydrated) {
			setActiveDilemma(null);
			return;
		}

		try {
			const allDilemmas =
				require("@/features/game-loop/dilemmas").GAME_DILEMMAS;
			const found = allDilemmas.find((d: Dilemma) => d.id === activeDilemmaId);
			if (found) {
				setActiveDilemma(found);
			}
		} catch (e) {
			console.error("Failed to load dilemma for audio UI:", e);
		}
	}, [activeDilemmaId, hasHydrated]);

	// Detect active Story Arc
	const activeArc = detectActiveArc(activeDilemmaId);

	// Cleanup
	useEffect(() => {
		return () => {
			clearNarrationQueue();
		};
	}, [clearNarrationQueue]);

	const handleSkip = () => {
		clearNarrationQueue();
		setAudioProgress(100);
	};

	const toggleMute = () => {
		setIsMuted(!isMuted);
		if (!isMuted) {
			clearNarrationQueue();
		}
	};

	// If no active dilemma, don't render anything
	if (!activeDilemma) return null;

	return (
		<div className="fixed bottom-0 left-0 w-full z-[3000] p-4 pointer-events-none flex justify-center">
			{/* Walkie-Talkie UI Container */}
			<div
				className={`
				pointer-events-auto
				bg-neutral-900/95 border-t-4 border-amber-500
				w-full max-w-lg rounded-t-xl shadow-2xl
				transform transition-all duration-500 ease-out
				${isNarrating ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"}
			`}
			>
				{/* Progress Bar (Visual Timer) */}
				<div className="w-full h-1 bg-neutral-800">
					<div
						className="h-full bg-amber-500 transition-all duration-200 ease-linear"
						style={{ width: `${audioProgress}%` }}
					/>
				</div>

				<div className="p-4 flex items-center gap-4">
					{/* Speaker Icon / Animation */}
					<div className="relative w-12 h-12 flex-shrink-0 flex items-center justify-center bg-neutral-800 rounded-full border border-neutral-700">
						{isNarrating ? (
							<div className="absolute inset-0 rounded-full animate-ping bg-amber-500/20" />
						) : null}
						<Mic
							className={`text-amber-500 ${isNarrating ? "animate-pulse" : ""}`}
							size={24}
						/>
					</div>

					{/* Text / Status */}
					<div className="flex-1 min-w-0">
						<h3 className="text-amber-500 font-mono text-xs uppercase tracking-widest mb-1">
							TRANSMISSÃO DE RÁDIO
						</h3>
						{activeArc && (
							<div className="text-xs text-amber-600 font-mono uppercase tracking-wider mb-1">
								📖 {activeArc.name}
							</div>
						)}
						<p className="text-neutral-300 text-sm font-medium truncate">
							{activeDilemma.narrator || "Narrador"} falando...
						</p>
					</div>

					{/* Controls */}
					<div className="flex items-center gap-2">
						<button
							onClick={toggleMute}
							className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-full transition-colors"
							type="button"
						>
							{isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
						</button>

						<button
							onClick={handleSkip}
							className="
								flex items-center gap-2 px-4 py-2 
								bg-neutral-800 hover:bg-neutral-700 
								text-white text-xs font-bold uppercase rounded-lg 
								border border-neutral-700 transition-colors
							"
							type="button"
						>
							<SkipForward size={14} />
							Pular
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
