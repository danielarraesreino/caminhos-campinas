"use client";

import { useEffect, useState } from "react";
import { useGameContext } from "@/contexts/GameContext";
import { AudioDirector } from "@/features/audio/AudioDirector";
import { ImpactReport } from "@/features/dashboard/ImpactReport";
import { useModalQueue } from "@/contexts/ModalQueueContext";
import {
	checkGameOver,
	type GameOverResult,
} from "@/features/game-loop/gameOverConditions";
import { useGameLoop } from "@/features/game-loop/useGameLoop";
import { LocationList } from "@/features/locations/LocationList";
import { SurvivalMap } from "@/features/survival-map/SurvivalMap";
import { AvatarCreation } from "@/features/ui/AvatarCreation";
import { DilemmaModal } from "@/features/ui/DilemmaModal";
import { EffectsLayer } from "@/features/ui/EffectsLayer";
import { EffectsOverlay } from "@/features/ui/EffectsOverlay";
import { GameChat } from "@/features/ui/GameChat";
import { GameHUD } from "@/features/ui/GameHUD";

import { OnboardingTutorial } from "@/features/ui/OnboardingTutorial";
import { VoiceReporter } from "@/features/ui/VoiceReporter";
import { useAudioDirector } from "@/hooks/useAudioDirector";
import { useEventEngine } from "@/hooks/useEventEngine";

export default function GamePage() {
	useGameLoop();
	useAudioDirector(); // [NEW] Immersive Audio System
	const { activeDilemma, resolveDilemma, clearActiveDilemma, triggerDilemma } =
		useEventEngine();
	const gameState = useGameContext();
	const { criticalHealth, sanity, resetGame } = gameState;
	const [gameOverResult, setGameOverResult] = useState<GameOverResult | null>(
		null,
	);
	const [isChatOpen, setIsChatOpen] = useState(false);
	const [isVoiceOpen, setIsVoiceOpen] = useState(false);
	const [isLocationsOpen, setIsLocationsOpen] = useState(false);
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
		// [FIX] Guard against redundant updates to prevent infinite loops
		const shouldBePaused = showTutorial;

		if (showTutorial && !gameState.isPaused) {
			gameState.setPaused(true);
		} else if (!showTutorial && !activeDilemma && gameState.isPaused) {
			gameState.setPaused(false);
		}
	}, [showTutorial, activeDilemma, gameState.isPaused, gameState.setPaused]);

	// [FIX] Ensure Chat closes when a Dilemma starts (so the Modal isn't hidden behind the Chat)
	useEffect(() => {
		if (activeDilemma) {
			setIsChatOpen(false);
		}
	}, [activeDilemma]);

	useEffect(() => {
		const result = checkGameOver(gameState);
		if (result.isGameOver && !gameOverResult) {
			setGameOverResult(result);
		}

		// [NEW] Handle Endings (Manual Triggers from Dilemma Action)
		if (gameState.activeDilemmaId === "CREDITS_SCREEN" && !gameOverResult) {
			setGameOverResult({
				isGameOver: true,
				reason: "VITÓRIA_SOCIAL",
				narrative: `VOCÊ VENCEU O SILÊNCIO.

Você não apenas sobreviveu, você resistiu e criou.
A rua ainda é dura, mas você tem chaves, voz e aliados.

"Quem tem boca, vai à Roma. Quem tem voz, muda o mundo."

Obrigado por jogar Caminhos.`,
				statistics: {
					daysSurvived: gameState.day,
					moneyEarned: gameState.money,
					dignityFinal: gameState.dignity,
					socialStigmaFinal: gameState.socialStigma,
				},
			});
		} else if (
			gameState.activeDilemmaId === "RESTART_GAME" &&
			!gameOverResult
		) {
			setGameOverResult({
				isGameOver: true,
				reason: "FIM_CICLO",
				narrative: `O CICLO RECOMEÇA.

"A rua é um moinho... vai te moendo até queimar."
Muitos saem, mas a gravidade da exclusão puxa de volta.

Você volta mais experiente. Dessa vez, será diferente?`,
				statistics: {
					daysSurvived: gameState.day,
					moneyEarned: gameState.money,
					dignityFinal: gameState.dignity,
					socialStigmaFinal: gameState.socialStigma,
				},
			});
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

	// [NEW] Use Modal Queue to check if audio is blocking visual modals
	const { audioPlaying } = useModalQueue();

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
						onToggleVoice={() => setIsVoiceOpen(true)}
						onToggleLocations={() => setIsLocationsOpen(true)}
					/>
					<EffectsOverlay />
					<EffectsLayer />
				</div>
			</div>

			{/* CAMADA 50: Modais de Decisão e Chat (Bloqueantes ou Interativos) */}
			{/* WALKIE-TALKIE MODE: Block visual modal while audio is playing */}
			{activeDilemma && !audioPlaying && (
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

			{isVoiceOpen && (
				<div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
					<VoiceReporter onClose={() => setIsVoiceOpen(false)} />
				</div>
			)}

			<AudioDirector />

			{isLocationsOpen && (
				<div className="fixed inset-0 z-[150] flex items-end justify-center sm:items-center p-4 bg-black/50 backdrop-blur-sm">
					<div className="w-full h-[80vh] md:w-[500px] md:h-[600px] bg-zinc-950 border border-zinc-800 rounded-t-2xl md:rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 relative">
						<header className="p-4 border-b border-zinc-900 flex justify-between items-center bg-zinc-950/50 backdrop-blur-md sticky top-0 z-10">
							<h2 className="text-zinc-100 font-bold uppercase tracking-widest text-xs">
								Atlas de Realidade
							</h2>
							<button
								type="button"
								className="text-zinc-500 hover:text-white transition-colors"
								onClick={() => setIsLocationsOpen(false)}
							>
								FECHAR
							</button>
						</header>
						<div className="flex-1 overflow-y-auto mt-4">
							<LocationList />
						</div>
					</div>
				</div>
			)}

			{/* CAMADA 60: Game Over (Prioridade Máxima) */}
			{gameOverResult?.isGameOver && (
				<div className="absolute inset-0 z-[160] bg-slate-950">
					<ImpactReport
						onRestart={handleRestart}
						gameOverResult={gameOverResult}
					/>
				</div>
			)}
		</main>
	);
}
