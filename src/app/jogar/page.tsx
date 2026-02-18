"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useGameContext } from "@/contexts/GameContext";
import { useModalQueue } from "@/contexts/ModalQueueContext";
import { AudioDirector } from "@/features/audio/AudioDirector";
import { ImpactReport } from "@/features/dashboard/ImpactReport";
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

import { VoiceReporter } from "@/features/ui/VoiceReporter";
import { useAudioDirector } from "@/hooks/useAudioDirector";
import { useEventEngine } from "@/hooks/useEventEngine";

export default function GamePage() {
	// [NEW] Capture arc parameter from URL
	const searchParams = useSearchParams();
	const arcParam = searchParams?.get("arc");

	useGameLoop();
	useAudioDirector(); // [NEW] Immersive Audio System
	const { activeDilemma, resolveDilemma, clearActiveDilemma, triggerDilemma } =
		useEventEngine();
	const gameState = useGameContext();
	const { criticalHealth, sanity, resetGame, setActiveArc } = gameState;
	const [gameOverResult, setGameOverResult] = useState<GameOverResult | null>(
		null,
	);
	const [isChatOpen, setIsChatOpen] = useState(false);
	const [isVoiceOpen, setIsVoiceOpen] = useState(false);
	const [isLocationsOpen, setIsLocationsOpen] = useState(false);
	// [NEW] Estado local para travar o loop de Game Over
	const [isProcessingGameOver, setIsProcessingGameOver] = useState(false);

	// [FIX] Move hooks to the top level to avoid Rules of Hooks violations (Previous render vs Next render)

	// [NEW] ModalQueue integration
	const { processQueue, canShowModal } = useModalQueue();

	// Unpause when dilemma closes
	useEffect(() => {
		if (!activeDilemma && gameState.isPaused) {
			gameState.setPaused(false);
		}
	}, [activeDilemma, gameState.isPaused, gameState.setPaused]);

	// [NEW] Set active arc from URL parameter
	useEffect(() => {
		if (arcParam && !gameState.activeArcId) {
			console.log(`[GamePage] Setting active arc from URL: ${arcParam}`);
			setActiveArc(arcParam);
		}
	}, [arcParam, gameState.activeArcId, setActiveArc]);

	// [NEW] Process Modal Queue
	useEffect(() => {
		if (!activeDilemma && canShowModal()) {
			const nextDilemma = processQueue();
			if (nextDilemma) {
				triggerDilemma(nextDilemma.id);
			}
		}
	}, [activeDilemma, canShowModal, processQueue, triggerDilemma]);

	// [DEBUG] External Trigger for Dilemmas (e.g., from Console)
	useEffect(() => {
		const handleTrigger = (event: Event) => {
			const customEvent = event as CustomEvent;
			if (customEvent.detail?.id) {
				console.log(
					`[GamePage] Manual trigger received: ${customEvent.detail.id}`,
				);
				triggerDilemma(customEvent.detail.id);
			}
		};

		window.addEventListener("trigger-dilemma", handleTrigger);
		return () => window.removeEventListener("trigger-dilemma", handleTrigger);
	}, [triggerDilemma]);

	// [FIX] Ensure Chat closes when a Dilemma starts (so the Modal isn't hidden behind the Chat)
	useEffect(() => {
		if (activeDilemma) {
			setIsChatOpen(false);
		}
	}, [activeDilemma]);

	// [SUBSTITUIÇÃO] useEffect de Game Over corrigido
	useEffect(() => {
		// [FIX] Guard 1: Prevenir re-entrância
		if (isProcessingGameOver || gameOverResult?.isGameOver) {
			return;
		}

		// [FIX] Guard 2: Verificar condições de vitória manual primeiro
		if (gameState.activeDilemmaId === "CREDITS_SCREEN") {
			setIsProcessingGameOver(true);
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
			return;
		}

		// [FIX] Guard 3: Verificar derrota por stats APENAS se avatar existe
		if (gameState.avatar) {
			const result = checkGameOver(gameState);
			if (result.isGameOver) {
				setIsProcessingGameOver(true);
				setGameOverResult(result);
			}
		}
	}, [
		// [FIX] Dependências específicas, não o objeto gameState inteiro
		gameState.activeDilemmaId,
		gameState.avatar,
		gameState.day,
		gameState.money,
		gameState.dignity,
		gameState.socialStigma,
		gameOverResult,
		isProcessingGameOver,
		gameState,
	]);

	// [FIX] Remover useEffect conflitante de morte (já unificado acima)

	// Dead state reset check from previous step
	// [REMOVIDO] useEffect conflitante de reset por morte
	// A lógica agora está centralizada no useEffect acima

	const handleRestart = () => {
		// [FIX] Limpeza Completa e Atômica
		setIsProcessingGameOver(false);
		setGameOverResult(null);
		clearActiveDilemma();

		setTimeout(() => {
			resetGame();
		}, 100);
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

	// Efeitos visuais de degradação (baseado nas regras de design "Realismo Sóbrio") [2]

	return (
		// MUDANÇA 1: h-[100dvh] garante que cabe na tela real do celular sem scroll
		<main
			className="relative w-full h-[100dvh] bg-slate-900 overflow-hidden"
			aria-label="Ambiente de Jogo"
		>
			<h1 className="sr-only">Caminhos Campinas - Jornada de Sobrevivência</h1>

			{/* World Container - applies degradation only to the game world, not UI overlays */}
			<div className={`absolute inset-0 z-0 ${degradationClasses}`}>
				{/* CAMADA 0: Mapa (Fundo) */}
				<div className="absolute inset-0 z-0">
					<SurvivalMap />
				</div>

				{/* CAMADA 40: HUD e Controles (Sobre o mapa, mas sob modais) */}
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

			{/* CAMADA 50: DilemmaModal (Prioridade sobre HUD) */}
			{activeDilemma && (
				<div className="fixed inset-0 z-50">
					<DilemmaModal
						dilemma={activeDilemma}
						onResolve={resolveDilemma}
						onClose={clearActiveDilemma}
						onOpenChat={() => setIsChatOpen(true)}
					/>
				</div>
			)}

			{/* CAMADA 60: Chat (Fecha quando dilema abre) */}
			{isChatOpen && !activeDilemma && (
				<div className="fixed inset-0 z-60 flex items-end justify-center sm:items-center p-4 bg-black/50 backdrop-blur-sm">
					<div className="w-full h-[60vh] md:w-[400px] md:h-[500px] bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 relative">
						<button
							type="button"
							className="absolute top-2 right-2 p-3 min-w-[44px] min-h-[44px] z-10 text-slate-400 hover:text-white flex items-center justify-center font-bold"
							onClick={() => setIsChatOpen(false)}
							aria-label="Fechar chat de ação"
						>
							X
						</button>
						<GameChat onDilemmaTriggered={triggerDilemma} />
					</div>
				</div>
			)}

			{/* CAMADA 70: VoiceReporter */}
			{isVoiceOpen && (
				<div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
					<VoiceReporter onClose={() => setIsVoiceOpen(false)} />
				</div>
			)}

			<AudioDirector />

			{/* CAMADA 80: LocationList (Atlas) */}
			{isLocationsOpen && (
				<div className="fixed inset-0 z-80 flex items-end justify-center sm:items-center p-4 bg-black/50 backdrop-blur-sm">
					<div className="w-full h-[80vh] md:w-[500px] md:h-[600px] bg-zinc-950 border border-zinc-800 rounded-t-2xl md:rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-5 relative">
						<header className="p-4 border-b border-zinc-900 flex justify-between items-center bg-zinc-950/50 backdrop-blur-md sticky top-0 z-10">
							<h2 className="text-zinc-100 font-bold uppercase tracking-widest text-xs">
								Atlas de Realidade
							</h2>
							<button
								type="button"
								className="text-zinc-500 hover:text-white transition-colors px-4 py-2 min-h-[40px] text-[10px] font-black uppercase tracking-widest"
								onClick={() => setIsLocationsOpen(false)}
								aria-label="Fechar Atlas de Realidade"
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

			{/* CAMADA 100: Game Over (Prioridade Máxima) */}
			{gameOverResult?.isGameOver && (
				<div className="fixed inset-0 z-100 bg-slate-950">
					<ImpactReport
						onRestart={handleRestart}
						gameOverResult={gameOverResult}
					/>
				</div>
			)}
		</main>
	);
}
