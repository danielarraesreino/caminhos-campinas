# Código Crítico - Caminhos Campinas

Abaixo estão os arquivos centrais onde a lógica do jogo e os problemas mais frequentes residem.

## 1. Game Page (`src/app/jogar/page.tsx`)
Controla a renderização do jogo, estado de "Game Over", e integração dos sistemas (Áudio, Mapa, Dilemas).

```tsx
// src/app/jogar/page.tsx
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
			{/* WALKIE-TALKIE MODE: AudioGuard handles strict blocking */}
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
```

## 2. Event Engine (`src/hooks/useEventEngine.ts`)
Gerencia o disparo e resolução de dilemas narrativos, aplicando efeitos ao estado do jogo.

```typescript
// src/hooks/useEventEngine.ts
import { useCallback, useEffect, useRef } from "react";
import { useGameContext } from "@/contexts/GameContext";
import { STORY_ARCS } from "@/data/story-arcs";
import { GAME_DILEMMAS } from "@/features/game-loop/dilemmas";

export function useEventEngine() {
	const {
		activeDilemmaId,
		workTool,
		modifyStat,
		addMoney,
		advanceTime,
		markDilemmaResolved,
		setActiveDilemma,
		addBuff,
		removeBuff,
		setWorkTool,
		addToInventory,
		removeFromInventory,
		inventory,
		initPDU,
		updatePduStage,
		completePduStage,
		updateDocuments,
		setEmployedFormal,
		setFlag,
		activeArcId,
		history,
	} = useGameContext();

	const activeDilemma = GAME_DILEMMAS.find((d) => d.id === activeDilemmaId);

	// [NEW] Force first dilemma of selected arc if new game
	useEffect(() => {
		if (activeArcId && history.length === 0 && !activeDilemmaId) {
			// Convert arc ID to STORY_ARCS key format
			const arcKey = activeArcId.toUpperCase().replace(/-/g, "_");
			const arc = STORY_ARCS[arcKey];

			if (arc?.dilemmaSequence && arc.dilemmaSequence.length > 0) {
				const firstDilemma = arc.dilemmaSequence[0];
				console.log(
					`[EventEngine] Iniciando arco "${arc.name}" com primeiro dilema: ${firstDilemma}`,
				);
				setActiveDilemma(firstDilemma);
			}
		}
	}, [activeArcId, history.length, activeDilemmaId, setActiveDilemma]);

	// Limpeza de Dilemas obsoletos ou IDs que não existem na versão atual
	useEffect(() => {
		if (
			activeDilemmaId &&
			!activeDilemma &&
			activeDilemmaId !== "CREDITS_SCREEN" &&
			activeDilemmaId !== "RESTART_GAME"
		) {
			console.warn(
				`[EventEngine] Dilema obsoleto detectado (${activeDilemmaId}). Limpando estado...`,
			);
			setActiveDilemma(null);
		}
	}, [activeDilemmaId, activeDilemma, setActiveDilemma]);

	const lastTriggerRef = useRef<number>(0);

	const clearActiveDilemma = useCallback(
		() => setActiveDilemma(null),
		[setActiveDilemma],
	);

	const triggerDilemma = useCallback(
		(dilemmaId: string) => {
			const now = Date.now();
			if (now - lastTriggerRef.current < 2000) {
				console.warn(
					`[EventEngine] Throttled dilemma '${dilemmaId}' (too fast)`,
				);
				return;
			}
			lastTriggerRef.current = now;
			setActiveDilemma(dilemmaId);
		},
		[setActiveDilemma],
	);

	const resolveDilemma = useCallback(
		(optionIndex: number, outcome: "success" | "failure" = "success") => {
			if (!activeDilemma) return;

			const option = activeDilemma.options[optionIndex];
			if (!option) return;

			// Determine which effect to apply
			let effectToApply = option.effect || {};
			if (outcome === "failure" && option.effect_failure) {
				// biome-ignore lint/suspicious/noExplicitAny: Dynamic effect structure
				effectToApply = (option.effect_failure as any) || {};
			}

			// 1. Aplicar stats básicos
			Object.entries(effectToApply).forEach(([key, value]) => {
				if (
					typeof value === "number" &&
					key !== "timeAdvance" &&
					key !== "money" &&
					key !== "addBuff" &&
					key !== "removeBuff" &&
					key !== "inventoryAdd" &&
					key !== "inventoryRemove" &&
					key !== "workToolUpdate"
				) {
					// biome-ignore lint/suspicious/noExplicitAny: key indexing
					modifyStat(key as any, value);
				}
			});

			// 2. Efeitos Especializados
			if (effectToApply.money) addMoney(effectToApply.money);
			if (effectToApply.timeAdvance) advanceTime(effectToApply.timeAdvance);
			if (effectToApply.inventoryAdd)
				addToInventory(effectToApply.inventoryAdd);

			if (effectToApply.clearInventory) {
				// Esvaziar inventário
				inventory.forEach((item: { id: string }) => {
					removeFromInventory(item.id);
				});
			}

			if (effectToApply.inventoryRemove) {
				if (Array.isArray(effectToApply.inventoryRemove)) {
					effectToApply.inventoryRemove.forEach((id: string) => {
						removeFromInventory(id);
					});
				} else if (typeof effectToApply.inventoryRemove === "string") {
					removeFromInventory(effectToApply.inventoryRemove);
				}
			}

			// 3. Efeitos Sociais Campinas
			if (effectToApply.addBuff) addBuff(effectToApply.addBuff);
			if (effectToApply.removeBuff) removeBuff(effectToApply.removeBuff);
			if (effectToApply.workToolUpdate) {
				setWorkTool({
					...workTool,
					...effectToApply.workToolUpdate,
					// biome-ignore lint/suspicious/noExplicitAny: dynamic spread
				} as any);
			}

			if (effectToApply.documentsUpdate) {
				updateDocuments(effectToApply.documentsUpdate);
			}

			if (effectToApply.addiction_risk) {
				modifyStat("addiction", effectToApply.addiction_risk);
			}

			if (effectToApply.trust_state) {
				modifyStat("trust", effectToApply.trust_state);
			}

			if (effectToApply.cycle_repeat) {
				// Simula o ciclo de retorno: Avança 3 meses (90 dias), perde inventário e dinheiro
				// 90 dias * 24 horas = 2160 horas
				advanceTime(2160);
				modifyStat("money", -10000); // Zera dinheiro (supondo max < 10000 ou lógica de zerar)
				// Actually easier to just modifyStat negative max or check context.
				// Context doesn't have setMoney. But addMoney handles negatives?
				// addMoney implementation: Math.max(0, state.money + payload). So removing enormous amount sets to 0. Correct.

				inventory.forEach((item: { id: string }) => {
					removeFromInventory(item.id);
				});
			}

			if (effectToApply.employed_formal !== undefined) {
				setEmployedFormal(effectToApply.employed_formal);
			}

			// 4. [NEW] Action Logic (Flags & Quests)
			if (option.action === "SET_FLAG" && option.flag) {
				setFlag(option.flag, true);

				// TRIGGER PDU UPDATE if flag is quest starter
				if (option.flag === "quest_rg_started") {
					initPDU("TRABALHO"); // Example: Document path leads to work
					// Or just notify? Ideally we use PDU state.
					// Let's assume initPDU handles the toast natively or we rely on UI state changes.
				}
			}

			// 5. [NEW] PDU Logic (Explicit)
			if (option.pduAction) {
				const { type, value } = option.pduAction;
				if (type === "INIT") {
					initPDU(value as any);
				} else if (type === "NEXT_STAGE") {
					updatePduStage(value);
				} else if (type === "COMPLETE_STAGE") {
					completePduStage(value);
				}
			}

			// Finalizar evento
			markDilemmaResolved(activeDilemma.id);

			// Chain Logic: If there is a next dilemma, trigger it immediately
			if (option.nextDilemmaId) {
				setActiveDilemma(option.nextDilemmaId);
			} else {
				setActiveDilemma(null);
			}
		},
		[
			activeDilemma,
			modifyStat,
			addMoney,
			advanceTime,
			addToInventory,
			addBuff,
			removeBuff,
			setWorkTool,
			workTool,
			markDilemmaResolved,
			setActiveDilemma,
			initPDU,
			updatePduStage,
			completePduStage,
			updateDocuments,
			inventory,
			removeFromInventory,
			setEmployedFormal,
			setFlag,
		],
	);

	return {
		activeDilemma,
		resolveDilemma,
		clearActiveDilemma,
		triggerDilemma,
	};
}
```

## 3. Auth Configuration (`src/auth.ts`)
Configuração de autenticação (NextAuth) com Google e Login Anônimo.

```typescript
// src/auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
	providers: [
		Google({
			clientId: process.env.AUTH_GOOGLE_ID || process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.AUTH_GOOGLE_SECRET || process.env.GOOGLE_CLIENT_SECRET,
			authorization: {
				params: {
					scope:
						"openid email profile https://www.googleapis.com/auth/drive.file",
				},
			},
		}),
		Credentials({
			name: "Anônimo",
			credentials: {},
			async authorize() {
				// Retorna um usuário anônimo
				return {
					id: `anon-${Math.random().toString(36).substr(2, 9)}`,
					name: "Visitante",
					email: "anonimo@caminhoscampinas.com.br",
				};
			},
		}),
	],
	trustHost: true,
	secret: process.env.AUTH_SECRET,
	callbacks: {
		authorized: async ({ auth }) => {
			return !!auth;
		},
		async session({ session, token }) {
			if (token.sub) {
				session.user.id = token.sub;
			}
			return session;
		},
	},
	pages: {
		signIn: "/login",
	},
});
```
