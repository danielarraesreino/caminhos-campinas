"use client";

import { BatteryWarning } from "lucide-react";
import { useGameContext } from "@/contexts/GameContext";

export function EffectsOverlay() {
	const { buffs } = useGameContext();

	// Check if SEM_BATERIA buff is active
	const isBatteryDead = buffs.includes("SEM_BATERIA");

	if (!isBatteryDead) return null;

	return (
		<div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-40 w-[90%] max-w-md pointer-events-none animate-in slide-in-from-bottom-5 fade-in duration-500">
			<div className="bg-red-950/90 border border-red-500/50 backdrop-blur-md rounded-xl p-4 flex items-center gap-4 text-white shadow-[0_0_30px_rgba(220,38,38,0.3)]">
				<div className="p-3 bg-red-500/20 rounded-full animate-pulse">
					<BatteryWarning className="w-8 h-8 text-red-500" />
				</div>
				<div>
					<h3 className="font-bold text-red-200">Sem bateria</h3>
					<p className="text-sm text-red-300">
						Você está digitalmente invisível. Não é possível usar o Chat ou ver
						recursos no mapa.
					</p>
				</div>
			</div>
		</div>
	);
}
