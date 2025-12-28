"use client";

import { Battery, BatteryWarning } from "lucide-react";
import { useEffect, useState } from "react";
import { useGameContext } from "@/contexts/GameContext";

export function BatteryIndicator() {
	const [level, setLevel] = useState<number | null>(null);
	const [charging, setCharging] = useState(false);
	const { addBuff, removeBuff } = useGameContext();

	useEffect(() => {
		// biome-ignore lint/suspicious/noExplicitAny: experimental browser api
		if (typeof navigator !== "undefined" && !(navigator as any).getBattery)
			return;

		// biome-ignore lint/suspicious/noExplicitAny: experimental browser api
		(navigator as any).getBattery().then((battery: any) => {
			const updateBattery = () => {
				const lvl = battery.level * 100;
				setLevel(lvl);
				setCharging(battery.charging);

				// Aplica a mecânica de Exclusão Digital
				if (lvl < 5 && !battery.charging) {
					addBuff("SEM_BATERIA"); // Bloqueia Mapa/Chat
				} else {
					removeBuff("SEM_BATERIA");
				}
			};

			updateBattery();
			battery.addEventListener("levelchange", updateBattery);
			battery.addEventListener("chargingchange", updateBattery);
		});
	}, [addBuff, removeBuff]);

	if (level === null) return null;

	return (
		<div
			className={`flex items-center gap-1 text-xs font-mono px-2 py-1 rounded border 
      ${level < 20 ? "text-red-500 border-red-900 bg-red-950/30 animate-pulse" : "text-emerald-500 border-emerald-900 bg-black"}`}
		>
			{level < 20 ? <BatteryWarning size={14} /> : <Battery size={14} />}
			<span>{Math.round(level)}%</span>
			{charging && <span className="text-yellow-400">⚡</span>}
		</div>
	);
}
