"use client";

import {
	Activity,
	Battery,
	Brain,
	Clock,
	Gamepad2,
	MapPin,
	Megaphone,
	Mic,
	Package,
	Shield,
	User,
	Volume2,
	VolumeX,
	Wallet,
	Wifi,
	WifiOff,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useGameContext } from "@/contexts/GameContext";
import { useAudioSystem } from "@/hooks/useAudioSystem";
import { CofreDrawer } from "./CofreDrawer";
import { InteractiveStatus } from "./InteractiveStatus";

export function GameHUD({
	onToggleChat,
	onToggleMenu,
	onToggleVoice,
	onToggleLocations,
}: {
	onToggleChat?: () => void;
	onToggleMenu?: () => void;
	onToggleVoice?: () => void;
	onToggleLocations?: () => void;
}) {
	const [isOnline, setIsOnline] = useState(true);
	const [isMuted, setIsMuted] = useState(false);
	const [isCofreOpen, setIsCofreOpen] = useState(false);
	const { setVolume, initAudio } = useAudioSystem();

	// 🔊 AUDIO FIRST: Inicializar estado mute do localStorage
	useEffect(() => {
		if (typeof window === "undefined") return;
		const savedMute = localStorage.getItem("caminhos_audio_muted");
		if (savedMute === "true") {
			setIsMuted(true);
			setVolume(0);
		} else {
			initAudio(); // Inicializa áudio se não estiver mudo
		}
	}, [setVolume, initAudio]);

	// 🔊 AUDIO FIRST: Toggle mute e persistir
	const handleToggleMute = () => {
		const newMuted = !isMuted;
		setIsMuted(newMuted);
		setVolume(newMuted ? 0 : 0.5);
		localStorage.setItem("caminhos_audio_muted", String(newMuted));
		if (!newMuted) {
			initAudio(); // Garante inicialização do áudio ao desmutar
		}
	};

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
		money,
		time,
		socialStigma,
		phoneBattery,
		pdu,
		addBuff,
		removeBuff,
		avatar,
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
						data-testid="stat-saude"
						icon={Activity}
						value={health}
						max={100}
						colorClass="text-emerald-500"
						label="SAÚDE"
						details="Sua vitalidade física. Mantenha acima de 30% para evitar desmaios e doenças."
					/>
					<InteractiveStatus
						data-testid="stat-mente"
						icon={Brain}
						value={sanity}
						max={100}
						colorClass="text-violet-500"
						label="MENTE"
						details="Sua saúde mental. Níveis baixos podem causar alucinações e limitar opções de diálogo."
					/>
					<InteractiveStatus
						data-testid="stat-caixa"
						icon={Wallet}
						value={money}
						isCurrency
						colorClass="text-amber-400"
						label="CAIXA"
						details="Seus recursos financeiros disponíveis para alimentação, transporte e serviços."
					/>
				</div>

				{/* CENTER: DEMO MODE INDICATOR */}
				{process.env.NODE_ENV !== "production" && (
					<div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-gradient-to-r from-purple-900/80 to-pink-900/80 px-3 py-1 rounded-full border border-purple-500/50 shadow-lg shadow-purple-900/50">
						<Gamepad2 className="w-3.5 h-3.5 text-purple-300" />
						<span className="text-purple-200 font-bold text-[10px] uppercase tracking-wider">
							Modo Demo
						</span>
						<div className="group relative">
							<button
								type="button"
								className="text-purple-300 hover:text-purple-100 transition-colors"
								aria-label="Informações sobre Modo Demo"
							>
								<span className="text-xs">ℹ️</span>
							</button>
							<div className="hidden group-hover:block absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-slate-900 border border-purple-500/50 rounded-lg p-3 shadow-xl z-50">
								<p className="text-xs text-slate-300 leading-relaxed">
									<strong className="text-purple-300">Modo Demo Ativo:</strong>
									<br />• Confisco desativado
									<br />• Decay de sanidade reduzido em 50%
									<br />• Tempo de jogo mais lento (30s/tick)
								</p>
							</div>
						</div>
					</div>
				)}

				{/* RIGHT: RESOURCES & TIME */}
				<div className="flex items-center gap-3 font-mono">
					<div
						data-testid="hud-time"
						className="flex items-center gap-1.5 bg-slate-900/50 px-2 py-1 rounded-md border border-slate-800"
					>
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
							data-testid="hud-battery"
							className={`flex items-center gap-1 ${phoneBattery < 20 ? "text-red-500 animate-pulse" : "text-slate-400"}`}
						>
							<Battery className="w-3.5 h-3.5" />
							<span>{phoneBattery}%</span>
						</div>
						{/* 🔊 AUDIO FIRST: Botão Mute/Unmute */}
						<button
							type="button"
							onClick={handleToggleMute}
							className={`ml-1 p-2 min-w-[32px] min-h-[32px] rounded-md transition-all flex items-center justify-center ${
								isMuted
									? "text-red-400 hover:bg-red-900/30"
									: "text-emerald-400 hover:bg-emerald-900/30"
							}`}
							aria-label={
								isMuted ? "Ativar som do jogo" : "Desativar som do jogo"
							}
						>
							{isMuted ? (
								<VolumeX className="w-5 h-5" aria-hidden="true" />
							) : (
								<Volume2 className="w-5 h-5" aria-hidden="true" />
							)}
						</button>
					</div>

					{/* AVATAR - Right Side */}
					{avatar && (
						<div className="flex items-center gap-2">
							<div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-700 bg-slate-800 flex items-center justify-center">
								{avatar.avatarImage ? (
									<Image
										src={avatar.avatarImage}
										alt={avatar.name || "Avatar"}
										width={48}
										height={48}
										className="object-cover w-full h-full"
										onError={(e) => {
											// Fallback to User icon if image fails
											e.currentTarget.style.display = "none";
										}}
									/>
								) : (
									<User className="w-6 h-6 text-slate-500" />
								)}
							</div>
						</div>
					)}
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
					className="h-12 w-12 rounded-full bg-slate-100 hover:bg-white shadow-lg shadow-white/10 border border-zinc-400 transition-transform active:scale-95"
					onClick={onToggleLocations}
					aria-label="Explorar Locais"
				>
					<MapPin className="h-5 w-5 text-zinc-950" />
				</Button>

				<Button
					size="icon"
					className="h-12 w-12 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-600 shadow-lg transition-transform active:scale-95 relative"
					aria-label="Cofre Digital: Visualizar meus documentos salvos"
					onClick={() => setIsCofreOpen(true)}
				>
					<div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
					<Shield className="h-6 w-6 text-blue-400" />
				</Button>

				<CofreDrawer
					isOpen={isCofreOpen}
					onClose={() => setIsCofreOpen(false)}
				/>

				<Button
					size="icon"
					className="h-12 w-12 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-600 shadow-lg transition-transform active:scale-95 flex items-center justify-center p-0"
					onClick={onToggleMenu}
					aria-label="Abrir Guia de Recursos de Apoio"
				>
					<Package className="h-5 w-5 text-slate-300" />
				</Button>
			</div>
		</div>
	);
}

import type { PDUState } from "@/types/GameState";

function PDUWidget({ pdu }: { pdu: PDUState }) {
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
