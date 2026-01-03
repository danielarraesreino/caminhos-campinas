"use client";

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

import { EffectsOverlay } from "@/features/ui/EffectsOverlay";
import { GameChat } from "@/features/ui/GameChat";
import { GameHUD } from "@/features/ui/GameHUD";
import { GameOverModal } from "@/features/ui/GameOverModal";
import { OnboardingTutorial } from "@/features/ui/OnboardingTutorial";

import { useEventEngine } from "@/hooks/useEventEngine";

export default function GamePage() {
	useGameLoop();
	const { activeDilemma, resolveDilemma, clearActiveDilemma, triggerDilemma } =
		useEventEngine();
	const gameState = useGameContext();
	const { criticalHealth, sanity, resetGame } = gameState;
	const [gameOverResult, setGameOverResult] = useState<GameOverResult | null>(
		null,
	);
	const [isChatOpen, setIsChatOpen] = useState(false);
	const [showTutorial, setShowTutorial] = useState(false);

	useEffect(() => {
		// Check if tutorial was seen
		const tutorialSeen = localStorage.getItem("pop_rua_tutorial_seen");
		if (!tutorialSeen) {
			setShowTutorial(true);
			gameState.setPaused(true);
		}
	}, [gameState.setPaused]);

	// Unpause when tutorial closes (only if no dilemma is active)
	useEffect(() => {
		if (!showTutorial && !activeDilemma) {
			gameState.setPaused(false);
		} else if (showTutorial) {
			gameState.setPaused(true);
		}
	}, [showTutorial, activeDilemma, gameState.setPaused]);

	useEffect(() => {
		const result = checkGameOver(gameState);
		if (result.isGameOver && !gameOverResult) {
			setGameOverResult(result);
		}
	}, [gameState, gameOverResult]);

	// Dead state reset check from previous step
	useEffect(() => {
		if (gameState.avatar && (gameState.health <= 0 || gameState.sanity <= 0)) {
			resetGame();
		}
	}, [gameState.avatar, gameState.health, gameState.sanity, resetGame]);

	const handleRestart = () => {
		setGameOverResult(null);
		resetGame();
	};

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

	// Efeitos visuais de degradação (baseado nas regras de design "Realismo Sóbrio") [2]
	const degradationClasses = [
		criticalHealth
			? "grayscale-50 border-[10px] border-red-900/30 ring-inset ring-8 ring-red-900/20"
			: "",
		sanity < 20 ? "blur-[0.5px]" : "",
	]
		.filter(Boolean)
		.join(" ");

	return (
		// MUDANÇA 1: h-[100dvh] garante que cabe na tela real do celular sem scroll
		<main className="relative w-full h-[100dvh] bg-slate-900 overflow-hidden">
			<OnboardingTutorial
				isOpen={showTutorial}
				onClose={() => setShowTutorial(false)}
			/>

			{/* World Container - applies degradation only to the game world, not UI overlays */}
			<div className={`absolute inset-0 z-0 ${degradationClasses}`}>
				{/* CAMADA 0: Mapa (Fundo) */}
				<div className="absolute inset-0 z-0">
					<SurvivalMap />
				</div>

				{/* CAMADA 40: HUD e Controles (Sobre o mapa, mas sob modais) */}
				{/* O HUD agora encapsula a barra superior e os botões flutuantes */}
				<div className="relative z-40 w-full h-full pointer-events-none">
					<GameHUD
						onToggleChat={() => setIsChatOpen(!isChatOpen)}
						onToggleMenu={() => window.open("/recursos", "_blank")}
					/>
					<EffectsOverlay />
				</div>
			</div>

			{/* CAMADA 50: Modais de Decisão e Chat (Bloqueantes ou Interativos) */}
			{activeDilemma && (
				<DilemmaModal
					dilemma={activeDilemma}
					onResolve={resolveDilemma}
					onClose={clearActiveDilemma}
					onOpenChat={() => setIsChatOpen(true)}
				/>
			)}

			{isChatOpen && (
				<div className="fixed inset-0 z-[150] flex items-end justify-center sm:items-center p-4 bg-black/50 backdrop-blur-sm">
					<div className="w-full h-[60vh] md:w-[400px] md:h-[500px] bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 relative">
						<button
							type="button"
							className="absolute top-2 right-2 p-2 z-10 text-slate-400 hover:text-white"
							onClick={() => setIsChatOpen(false)}
						>
							[X]
						</button>
						<GameChat onDilemmaTriggered={triggerDilemma} />
					</div>
				</div>
			)}

			{/* CAMADA 60: Game Over (Prioridade Máxima) */}
			{gameOverResult?.isGameOver && (
				<GameOverModal
					gameOverResult={gameOverResult}
					onRestart={handleRestart}
				/>
			)}
		</main>
	);
}
