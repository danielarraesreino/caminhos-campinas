"use client";

import {
	Activity,
	Battery,
	Brain,
	Clock,
	Megaphone,
	Mic,
	Package,
	ShieldAlert,
	User,
	Wallet,
	Wifi,
	WifiOff,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useGameContext } from "@/contexts/GameContext";
import { CitizenshipTree } from "./CitizenshipTree";
import { InteractiveStatus } from "./InteractiveStatus";

export function GameHUD({
	onToggleChat,
	onToggleMenu,
	onToggleVoice,
}: {
	onToggleChat?: () => void;
	onToggleMenu?: () => void;
	onToggleVoice?: () => void;
}) {
	const [isOnline, setIsOnline] = useState(true);

	useEffect(() => {
		if (typeof window === "undefined") return;
		setIsOnline(navigator.onLine);
		const handleOnline = () => setIsOnline(true);
		const handleOffline = () => setIsOnline(false);
		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);
		return () => {
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);
		};
	}, []);

	const {
		health,
		sanity,
		hunger, // Added hunger as requested by user
		energy, // Added energy for completeness
		money,
		time,
		day,
		socialStigma,
		phoneBattery,
		pdu,
		addBuff,
		removeBuff,
	} = useGameContext();

	const stigmaAlert = socialStigma > 80;

	useEffect(() => {
		if (phoneBattery < 5) {
			addBuff("SEM_BATERIA");
		} else {
			removeBuff("SEM_BATERIA");
		}
	}, [phoneBattery, addBuff, removeBuff]);

	return (
		<div className="w-full h-full pointer-events-none flex flex-col justify-between">
			{/* ALERT OVERLAY */}
			{stigmaAlert && (
				<div className="fixed inset-0 pointer-events-none border-[4px] border-red-600/50 animate-pulse z-30" />
			)}

			{/* TOP BAR - COMPACT HUD */}
			<header className="fixed top-0 left-0 w-full z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-3 py-2 flex items-center justify-between text-xs shadow-xl pointer-events-auto transition-all duration-300">
				{/* LEFT: VITAL SIGNS */}
				<div className="flex items-center gap-3">
					<InteractiveStatus
						icon={Activity}
						value={health}
						max={100}
						colorClass="text-emerald-500"
						label="SAÚDE"
						details="Sua vitalidade física. Mantenha acima de 30% para evitar desmaios e doenças."
					/>
					<InteractiveStatus
						icon={Brain}
						value={sanity}
						max={100}
						colorClass="text-violet-500"
						label="MENTE"
						details="Sua saúde mental. Níveis baixos podem causar alucinações e limitar opções de diálogo."
					/>
					<InteractiveStatus
						icon={Wallet}
						value={money}
						isCurrency
						colorClass="text-amber-400"
						label="CAIXA"
						details="Seus recursos financeiros disponíveis para alimentação, transporte e serviços."
					/>
				</div>

				{/* RIGHT: RESOURCES & TIME */}
				<div className="flex items-center gap-3 font-mono">
					<div className="flex items-center gap-1.5 bg-slate-900/50 px-2 py-1 rounded-md border border-slate-800">
						<Clock className="w-3.5 h-3.5 text-blue-400" />
						<span className="text-white font-bold">
							{time.toString().padStart(2, "0")}:00
						</span>
					</div>

					<div className="flex items-center gap-1.5 opacity-80">
						{isOnline ? (
							<Wifi className="w-3.5 h-3.5 text-emerald-500" />
						) : (
							<WifiOff className="w-3.5 h-3.5 text-red-500" />
						)}
						<div
							className={`flex items-center gap-1 ${phoneBattery < 20 ? "text-red-500 animate-pulse" : "text-slate-400"}`}
						>
							<Battery className="w-3.5 h-3.5" />
							<span>{phoneBattery}%</span>
						</div>
					</div>
				</div>
			</header>

			{/* PDU WIDGET - FLOATING BELOW HEADER */}
			<div className="mt-14 pointer-events-auto px-2">
				<PDUWidget pdu={pdu} />
			</div>

			{/* BOTTOM ACTIONS - FLOATING DOCK */}
			<div className="pointer-events-auto fixed bottom-6 right-4 flex flex-col gap-3 z-50">
				<Button
					size="icon"
					className="h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/50 border border-blue-400 transition-transform active:scale-95"
					onClick={onToggleChat}
					disabled={phoneBattery <= 0}
					aria-label="Abrir Chat de Ação"
				>
					<Mic className="h-5 w-5 text-white" />
				</Button>

				<Button
					size="icon"
					className="h-12 w-12 rounded-full bg-amber-600 hover:bg-amber-500 shadow-lg shadow-amber-900/50 border border-amber-400 transition-transform active:scale-95"
					onClick={onToggleVoice}
					disabled={phoneBattery <= 0}
					aria-label="Reportar Ocorrência"
				>
					<Megaphone className="h-5 w-5 text-white" />
				</Button>

				<Button
					size="icon"
					variant="secondary"
					className="h-10 w-10 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-600 shadow-lg transition-transform active:scale-95"
					onClick={onToggleMenu}
					title="Guia de Recursos"
				>
					<Package className="h-4 w-4 text-slate-300" />
				</Button>
			</div>
		</div>
	);
}

function PDUWidget({ pdu }: { pdu: any }) {
	if (!pdu?.isActive || !pdu?.objective) return null;

	// Simple Progress Calculation
	const totalStages = 5; // Average length
	const currentProgress =
		((pdu.completedStages?.length || 0) / totalStages) * 100;

	return (
		<div className="mx-0 mt-0 pointer-events-auto animate-in slide-in-from-top fade-in duration-500">
			<div className="bg-slate-900/80 border border-slate-700/50 rounded-lg p-2.5 shadow-lg flex items-center justify-between backdrop-blur-md max-w-sm">
				<div className="flex items-center gap-2">
					<div className="bg-blue-600 p-1.5 rounded-md shadow-inner">
						<Package className="text-white w-3 h-3" />
					</div>
					<div>
						<div className="flex items-center gap-1.5">
							<span className="text-[9px] text-blue-300 font-bold uppercase tracking-widest leading-none">
								META ATUAL
							</span>
						</div>
						<div className="text-white font-bold text-xs leading-tight mt-0.5">
							{pdu.objective}
						</div>
					</div>
				</div>

				<div className="flex flex-col items-end gap-0.5 ml-3">
					<span className="text-[9px] text-blue-300 font-mono leading-none">
						{Math.round(currentProgress)}%
					</span>
					<div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden">
						<div
							className="h-full bg-blue-500 rounded-full transition-all duration-1000"
							style={{ width: `${Math.max(5, currentProgress)}%` }}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

// StatCard component removed in favor of StatusIcon (compact mode)
