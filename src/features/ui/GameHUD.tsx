"use client";

import {
	Activity,
	Battery,
	Brain,
	Clock,
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

export function GameHUD({
	onToggleChat,
	onToggleMenu,
}: {
	onToggleChat?: () => void;
	onToggleMenu?: () => void;
}) {
	const [imgError, setImgError] = useState(false);
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
		money,
		time,
		day,
		socialStigma,
		workTool,
		avatar,
		phoneBattery,
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
		<div className="w-full h-full flex flex-col justify-between p-4 pointer-events-none">
			{stigmaAlert && (
				<div className="fixed inset-0 pointer-events-none border-[8px] border-red-600/50 animate-pulse z-30" />
			)}

			<div className="fixed top-0 left-0 w-full z-50 pointer-events-none">
				<CitizenshipTree />
			</div>

			<header className="pointer-events-auto bg-gradient-to-b from-black/90 to-transparent pb-6 pt-2 px-2 -mx-4 -mt-4 flex flex-col gap-2 mt-[60px]">
				<div className="flex w-full justify-between items-center px-2">
					<div className="flex items-center gap-4">
						{avatar?.avatarImage && !imgError ? (
							<div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-slate-600 shadow-lg flex-none group hover:scale-105 transition-transform">
								<Image
									src={avatar.avatarImage}
									alt={avatar.name}
									fill
									sizes="(max-width: 768px) 100vw, 33vw"
									className="object-cover"
									onError={() => setImgError(true)}
								/>
								<div className="absolute bottom-0 left-0 w-full bg-black/70 p-1 text-center">
									<span className="text-[10px] font-bold text-white truncate block uppercase tracking-wider">
										{avatar.name.split(" ")[0]}
									</span>
								</div>
							</div>
						) : (
							<div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center border-2 border-slate-700">
								<User className="w-8 h-8 text-slate-500" />
							</div>
						)}

						<div className="flex items-center gap-2">
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
							<div className="w-[1px] h-8 bg-slate-700" />
							<div className="flex flex-col items-center">
								<span className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">
									CONEXÃO
								</span>
								<div className="flex items-center gap-2 font-mono text-xl font-bold">
									{isOnline ? (
										<Wifi className="w-5 h-5 text-emerald-400" />
									) : (
										<WifiOff className="w-5 h-5 text-red-500 animate-pulse" />
									)}
								</div>
							</div>
							<div className="w-[1px] h-8 bg-slate-700" />
							<div className="flex flex-col items-center">
								<span className="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-bold">
									BATERIA
								</span>
								<div
									className={`flex items-center gap-2 font-mono text-xl font-bold ${phoneBattery < 20 ? "text-red-500 animate-pulse" : "text-emerald-400"}`}
								>
									<Battery className="w-5 h-5" />
									{phoneBattery}%
								</div>
							</div>
						</div>
					</div>
				</div>
			</header>

			<div className="flex-1" />

			<div className="pointer-events-auto flex flex-col items-end gap-3 pb-safe-offset w-fit ml-auto">
				<Button
					size="icon"
					className="h-14 w-14 rounded-full bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-900/50 border-2 border-blue-400 transition-transform active:scale-95"
					onClick={onToggleChat}
					disabled={phoneBattery <= 0}
				>
					<Mic className="h-6 w-6 text-white" />
				</Button>

				<Button
					size="icon"
					variant="secondary"
					className="h-10 w-10 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-600 transition-transform active:scale-95"
					onClick={onToggleMenu}
					title="Guia de Recursos"
				>
					<Package className="h-5 w-5 text-slate-300" />
				</Button>
			</div>
		</div>
	);
}

function StatCard({
	icon: Icon,
	value,
	label,
	color,
	type,
	alertThreshold,
	max = 100,
}: {
	icon: any;
	value: number;
	label: string;
	color: "emerald" | "violet" | "amber";
	type: "asc" | "desc";
	alertThreshold?: number;
	max?: number;
}) {
	const colorMap = {
		emerald: {
			bg: "bg-emerald-950/40",
			border: "border-emerald-500/30",
			icon: "text-emerald-500",
			text: "text-white",
			bar: "bg-emerald-500",
		},
		violet: {
			bg: "bg-violet-950/40",
			border: "border-violet-500/30",
			icon: "text-violet-500",
			text: "text-white",
			bar: "bg-violet-500",
		},
		amber: {
			bg: "bg-amber-950/40",
			border: "border-amber-500/30",
			icon: "text-amber-500",
			text: "text-white",
			bar: "bg-amber-500",
		},
	};
	const theme = colorMap[color];
	const isCritical =
		type === "desc" ? value < 30 : alertThreshold && value > alertThreshold;
	const containerClasses = isCritical
		? "border-red-500 bg-red-950/50 animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.4)]"
		: `${theme.bg} ${theme.border}`;

	return (
		<div
			className={`flex flex-col justify-center items-center w-20 h-20 rounded-xl border-2 backdrop-blur-sm transition-all ${containerClasses}`}
		>
			<div className="flex items-center gap-1.5 mb-1">
				<Icon
					className={`w-4 h-4 ${isCritical ? "text-red-500" : theme.icon}`}
				/>
				<span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
					{label}
				</span>
			</div>
			<span className={`text-2xl font-black ${theme.text} leading-none mb-2`}>
				{Math.round(value)}
			</span>
			<div className="w-12 h-1.5 bg-slate-900/80 rounded-full overflow-hidden">
				<div
					className={`h-full rounded-full transition-all duration-700 ${isCritical ? "bg-red-500" : theme.bar}`}
					style={{
						width: `${Math.max(0, Math.min(100, (value / max) * 100))}%`,
					}}
				/>
			</div>
		</div>
	);
}
