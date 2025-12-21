"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SurvivalMap } from "@/features/survival-map/SurvivalMap";
import { DilemmaModal } from "@/features/ui/DilemmaModal";
import { GameChat } from "@/features/ui/GameChat";
import { GameHUD } from "@/features/ui/GameHUD";
import { SurvivalToggle } from "@/features/ui/SurvivalToggle";
import { useEventEngine } from "@/hooks/useEventEngine";
import { useGameContext } from "@/contexts/GameContext";
import { useGameLoop } from "@/features/game-loop/useGameLoop";

export default function GamePage() {
	// Initialize Game Loop (Time progression)
	useGameLoop();

	// Initialize Event Engine (Dilemmas)
	const { activeDilemma, resolveDilemma, clearActiveDilemma } =
		useEventEngine();

	const { criticalHealth, sanity } = useGameContext();

	const degradationClasses = [
		criticalHealth
			? "grayscale-50 border-[10px] border-red-900/30 ring-inset ring-8 ring-red-900/20"
			: "",
		sanity < 20 ? "blur-[0.5px]" : "",
	]
		.filter(Boolean)
		.join(" ");

	return (
		<div
			className={`flex flex-col h-screen bg-slate-900 overflow-hidden transition-all duration-1000 ${degradationClasses}`}
		>
			{/* HUD Strip (Top Fixed) */}
			<GameHUD />

			{/* Header (Secondary under HUD) */}
			<header className="flex-none h-14 bg-slate-950/80 border-b border-slate-900 flex items-center justify-between px-4 z-40 mt-10">
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
		</div>
	);
}
