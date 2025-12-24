"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useGameContext } from "@/contexts/GameContext";
import {
	checkGameOver,
	type GameOverResult,
} from "@/features/game-loop/gameOverConditions";
import { useGameLoop } from "@/features/game-loop/useGameLoop";
import { SurvivalMap } from "@/features/survival-map/SurvivalMap";
import { AvatarCreation } from "@/features/ui/AvatarCreation";
import { DilemmaModal } from "@/features/ui/DilemmaModal";
import { GameChat } from "@/features/ui/GameChat";
import { GameHUD } from "@/features/ui/GameHUD";
import { GameOverModal } from "@/features/ui/GameOverModal";
import { SurvivalToggle } from "@/features/ui/SurvivalToggle";
import { useAudioSystem } from "@/hooks/useAudioSystem";
import { useEventEngine } from "@/hooks/useEventEngine";

export default function GamePage() {
	// Initialize Game Loop (Time progression)
	const { isRaining } = useGameLoop();

	// Audio System
	const { playAmbience, stopAmbience, initAudio } = useAudioSystem();

	// Initialize Audio on first interaction
	useEffect(() => {
		const handleInteraction = () => {
			initAudio();
			window.removeEventListener("click", handleInteraction);
			window.removeEventListener("keydown", handleInteraction);
		};

		window.addEventListener("click", handleInteraction);
		window.addEventListener("keydown", handleInteraction);

		return () => {
			window.removeEventListener("click", handleInteraction);
			window.removeEventListener("keydown", handleInteraction);
		};
	}, [initAudio]);

	// Atmospheric Audio (Rain)
	useEffect(() => {
		if (isRaining) {
			playAmbience("rain_heavy"); // Using the ID defined in dilemmas or just a standard name
		} else {
			// If not raining, maybe play city noise or silence?
			// For now, stop rain.
			// But checking if we should stop *all* ambience or just rain?
			// stopAmbience stops current.
			// If we have other ambience logic later, we might need check.
			// For now, simple logic.
			// Wait, if a dilemma is open, it handles its own audio via DilemmaModal.
			// If dilemma closes, does it resume rain?
			// DilemmaModal stops all on close.
			// If isRaining is true, this effect might need to re-trigger?
			// Effect dependency [isRaining] only triggers on change.
			// If Dilemma stops audio, we might need a way to resume 'base' ambience.
			// But for MVP, let's just trigger on rain change.
			if (!isRaining) {
				stopAmbience();
			}
		}
	}, [isRaining, playAmbience, stopAmbience]);

	// Initialize Event Engine (Dilemmas)
	const { activeDilemma, resolveDilemma, clearActiveDilemma } =
		useEventEngine();

	const gameState = useGameContext();
	const { criticalHealth, sanity, resetGame } = gameState;

	// Game Over State
	const [gameOverResult, setGameOverResult] = useState<GameOverResult | null>(
		null,
	);

	// Check for Game Over conditions every time state changes
	useEffect(() => {
		const result = checkGameOver(gameState);
		if (result.isGameOver && !gameOverResult) {
			setGameOverResult(result);
		}
	}, [gameState, gameOverResult]);

	// Handle restart from Game Over
	const handleRestart = () => {
		setGameOverResult(null);
		resetGame();
	};

	const degradationClasses = [
		criticalHealth
			? "grayscale-50 border-[10px] border-red-900/30 ring-inset ring-8 ring-red-900/20"
			: "",
		sanity < 20 ? "blur-[0.5px]" : "",
	]
		.filter(Boolean)
		.join(" ");

	// Redirect to Avatar Creation if no avatar exists
	if (!gameState.avatar) {
		return (
			<div className="flex items-center justify-center min-h-screen bg-slate-900 p-4">
				<AvatarCreation
					onComplete={() => {
						// Avatar is set in context, re-render will show game
					}}
					onBack={() => {
						window.location.href = "/";
					}}
				/>
			</div>
		);
	}

	return (
		<div
			className={`flex flex-col h-screen bg-slate-900 overflow-hidden transition-all duration-1000 ${degradationClasses}`}
		>
			{/* HUD Strip (Top Fixed) */}
			<GameHUD />

			{/* Header (Secondary under HUD) */}
			<header className="flex-none h-14 bg-slate-950/80 border-b border-slate-900 flex items-center justify-between px-4 z-40 mt-24">
				<div className="flex items-center gap-4">
					<Link
						href="/"
						className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
					>
						<ArrowLeft className="w-5 h-5" />
					</Link>
					<h1 className="font-bold text-slate-100 text-sm uppercase tracking-widest opacity-70">
						Setor de <span className="text-blue-500">Sobrevivência</span>
					</h1>
				</div>

				<SurvivalToggle />
			</header>

			{/* Main Game Area */}
			<main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
				{/* Left Column: Map */}
				<section className="h-[40%] md:h-full md:w-1/2 border-b md:border-b-0 md:border-r border-slate-900 relative z-0">
					<SurvivalMap />
				</section>

				{/* Right Column: Chat */}
				<section className="h-[60%] md:h-full md:w-1/2 bg-slate-950">
					<GameChat />
				</section>
			</main>

			{/* Dilemma Modal */}
			<DilemmaModal
				dilemma={activeDilemma || null}
				onResolve={resolveDilemma}
				onClose={clearActiveDilemma}
			/>

			{/* Game  Over Modal */}
			{gameOverResult?.isGameOver && (
				<GameOverModal
					gameOverResult={gameOverResult}
					onRestart={handleRestart}
				/>
			)}
		</div>
	);
}
