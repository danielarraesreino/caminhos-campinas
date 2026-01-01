"use client";

import {
	Activity,
	Brain,
	Clock,
	Menu,
	Mic, // New Icon
	Package,
	ShieldAlert,
	Unlock,
	User,
	Wallet,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useGameContext } from "@/contexts/GameContext";
import { CitizenshipTree } from "./CitizenshipTree";
import { VoiceReporter } from "./VoiceReporter";
import { Button } from "@/components/ui/button";

export function GameHUD({
	onToggleChat,
	onToggleMenu,
}: { onToggleChat?: () => void; onToggleMenu?: () => void }) {
	const [imgError, setImgError] = useState(false);
	const [isReporterOpen, setIsReporterOpen] = useState(false);
	const {
		health,
		sanity,
		money,
		time,
		day,
		socialStigma,
		workTool,
		// dignity,
		avatar,
		forceUnlock,
	} = useGameContext();

	// Efeito de bordo pulsante para alto estigma
	const stigmaAlert = socialStigma > 80;

	return (
		<div className="w-full h-full flex flex-col justify-between p-4 pointer-events-none">
			{stigmaAlert && (
				<div className="fixed inset-0 pointer-events-none border-[8px] border-red-600/50 animate-pulse z-30" />
			)}

			{/* Citizenship Tree (PDU) - Top Bar */}
			<div className="fixed top-0 left-0 w-full z-50 pointer-events-auto">
				<CitizenshipTree />
			</div>

			{/* TOPO: Barra de Status (Com gradiente para leitura) */}
			<header className="pointer-events-auto bg-gradient-to-b from-black/90 to-transparent pb-6 pt-2 px-2 -mx-4 -mt-4 flex flex-col gap-2 mt-[60px] md:mt-[60px]">
				<div className="flex w-full justify-between items-center px-2">
					{/* LEFT: Avatar & Identity */}
					<div className="flex items-center gap-4 md:gap-6">
						{avatar?.avatarImage && !imgError ? (
							<div className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border-2 border-slate-600 shadow-lg flex-none group hover:scale-105 transition-transform">
								<Image
									src={avatar.avatarImage}
									alt={avatar.name}
									fill
									sizes="(max-width: 768px) 100vw, 33vw"
									className="object-cover"
									onError={() => setImgError(true)}
								/>
								{/* Name Tag Overlay */}
								<div className="absolute bottom-0 left-0 w-full bg-black/70 p-1 text-center">
									<span className="text-[10px] md:text-xs font-bold text-white truncate block uppercase tracking-wider">
										{avatar.name.split(" ")[0]}
									</span>
								</div>
							</div>
						) : (
							<div className="w-16 h-16 md:w-20 md:h-20 bg-slate-800 rounded-2xl flex items-center justify-center border-2 border-slate-700">
								<User className="w-8 h-8 text-slate-500" />
							</div>
						)}

						{/* Status Stats - Large Cards */}
						<div className="flex items-center gap-2 md:gap-4">
							<StatCard
								icon={Activity}
								value={health}
								label="SAÚDE"
								color="emerald"
								type="desc"
							/>
							<StatCard
								icon={Brain}
								value={sanity}
								label="MENTE"
								color="violet"
								type="desc"
							/>
							<StatCard
								icon={ShieldAlert}
								value={socialStigma}
								label="ESTIGMA"
								color="amber"
								type="asc"
								alertThreshold={70}
							/>
						</div>
					</div>

					{/* CENTER: Context Info (Desktops only) */}
					<div className="hidden xl:flex flex-col items-center justify-center opacity-80">
						<div className="bg-slate-900/50 px-6 py-2 rounded-xl border border-slate-800 flex items-center gap-6">
							<div className="flex flex-col items-center">
								<span className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">
									DIA {day}
								</span>
								<div className="flex items-center gap-2 text-white font-mono text-xl font-bold">
									<Clock className="w-5 h-5 text-blue-400" />
									{time.toString().padStart(2, "0")}:00
								</div>
							</div>
							<div className="w-[1px] h-8 bg-slate-700" />
							<div className="flex flex-col items-center">
								<span className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">
									CAIXA
								</span>
								<div className="flex items-center gap-2 text-green-400 font-mono text-xl font-bold">
									<Wallet className="w-5 h-5" />
									R$ {money.toFixed(2)}
								</div>
							</div>
						</div>
						{workTool.type && (
							<div className="mt-1 flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest">
								<Package className="w-3 h-3" />
								{workTool.type.replace("_", " ")} ({workTool.condition}%)
							</div>
						)}
					</div>
				</div>

				<div className="flex justify-between items-center text-xs font-mono text-slate-300 px-4 md:hidden">
					<span>
						D{day} {time.toString().padStart(2, "0")}:00
					</span>
					<span className="text-emerald-400 font-bold">
						R$ {money.toFixed(2)}
					</span>
				</div>
			</header>

			{/* MEIO: Área livre para visualização do mapa */}
			<div className="flex-1" />

			{/* RODAPÉ: Floating Action Buttons (FAB) */}
			{/* MUDANÇA 3: Posicionamento bottom-4 right-4 em coluna */}
			<div className="pointer-events-auto flex flex-col items-end gap-3 pb-safe-offset w-fit ml-auto">
				{/* Botão de Chat/Ação (Principal) */}
				{/* biome-ignore lint/a11y/useButtonType: shadcn button handles type */}
				<Button
					size="icon"
					className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-900/50 border-2 border-blue-400 transition-transform active:scale-95"
					onClick={onToggleChat}
				>
					<Mic className="h-6 w-6 text-white" />
				</Button>

				{/* Botão de Menu/Inventário (Secundário) */}
				{/* biome-ignore lint/a11y/useButtonType: shadcn button handles type */}
				<Button
					size="icon"
					variant="secondary"
					className="h-10 w-10 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-600 transition-transform active:scale-95"
					onClick={onToggleMenu}
				>
					<Menu className="h-5 w-5 text-slate-300" />
				</Button>
			</div>

			{/* Voice Reporter Modal / Overlay */}
			{isReporterOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in pointer-events-auto">
					<div className="relative w-full max-w-md">
						<button
							type="button"
							onClick={() => setIsReporterOpen(false)}
							className="absolute -top-12 right-0 text-white hover:text-gray-300"
						>
							Fechar [X]
						</button>
						<VoiceReporter />
					</div>
				</div>
			)}
		</div>
	);
}

// Subcomponente de Cartão de Status
function StatCard({
	icon: Icon,
	value,
	label,
	color,
	type,
	alertThreshold,
	max = 100,
}: {
	// biome-ignore lint/suspicious/noExplicitAny: generic icon component
	icon: any;
	value: number;
	label: string;
	color: "emerald" | "violet" | "amber";
	type: "asc" | "desc"; // asc: quanto maior pior (ex: risco), desc: quanto maior melhor (ex: saude)
	alertThreshold?: number;
	max?: number;
}) {
	// Definir cores baseadas no prop 'color'
	const colorMap = {
		emerald: {
			bg: "bg-emerald-950/40",
			border: "border-emerald-500/30",
			icon: "text-emerald-500",
			text: "text-white",
			bar: "bg-emerald-500",
			glow: "shadow-emerald-900/20",
		},
		violet: {
			bg: "bg-violet-950/40",
			border: "border-violet-500/30",
			icon: "text-violet-500",
			text: "text-white",
			bar: "bg-violet-500",
			glow: "shadow-violet-900/20",
		},
		amber: {
			bg: "bg-amber-950/40",
			border: "border-amber-500/30",
			icon: "text-amber-500",
			text: "text-white",
			bar: "bg-amber-500",
			glow: "shadow-amber-900/20",
		},
	};

	const theme = colorMap[color];

	// Lógica de alerta crítico
	const isCritical =
		type === "desc" ? value < 30 : alertThreshold && value > alertThreshold;

	// Se crítico, muda para vermelho/alerta
	const containerClasses = isCritical
		? "border-red-500 bg-red-950/50 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.4)]"
		: `${theme.bg} ${theme.border} ${theme.glow}`;

	const iconColor = isCritical ? "text-red-500" : theme.icon;
	const barColor = isCritical ? "bg-red-500" : theme.bar;

	return (
		<div
			className={`
			flex flex-col justify-center items-center w-20 md:w-24 h-20 md:h-22 rounded-xl border-2 backdrop-blur-sm transition-all
			${containerClasses}
		`}
		>
			<div className="flex items-center gap-1.5 mb-1">
				<Icon className={`w-4 h-4 md:w-5 md:h-5 ${iconColor}`} />
				<span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
					{label}
				</span>
			</div>

			<span
				className={`text-2xl md:text-3xl font-black ${theme.text} leading-none mb-2`}
			>
				{Math.round(value)}
			</span>

			{/* Progress Bar Mini */}
			<div className="w-12 h-1.5 bg-slate-900/80 rounded-full overflow-hidden">
				<div
					className={`h-full rounded-full transition-all duration-700 ${barColor}`}
					style={{
						width: `${Math.max(0, Math.min(100, (value / max) * 100))}%`,
					}}
				/>
			</div>
		</div>
	);
}
