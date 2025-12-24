"use client";

import { ArrowLeft, MessageCircle, X } from "lucide-react";
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
	const [isChatOpen, setIsChatOpen] = useState(false);

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
			<main className="flex-1 flex flex-col overflow-hidden relative">
				{/* Full Screen Map */}
				<section className="w-full h-full relative z-0">
					<SurvivalMap />
				</section>

				{/* Floating Action Button */}
				<div className="absolute bottom-6 right-6 z-20">
					<button
						type="button"
						onClick={() => setIsChatOpen(!isChatOpen)}
						className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-full shadow-lg border-2 border-slate-900 transition-transform hover:scale-110 flex items-center justify-center"
						aria-label="Abrir Chat de Ação"
					>
						{isChatOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
					</button>
				</div>

				{/* Chat Overlay */}
				{isChatOpen && (
					<div className="absolute bottom-24 right-6 w-[90vw] md:w-[400px] h-[60vh] md:h-[500px] bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-20 overflow-hidden flex flex-col animate-in slide-in-from-bottom-5">
						<GameChat />
					</div>
				)}
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
