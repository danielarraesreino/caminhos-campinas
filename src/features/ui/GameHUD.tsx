"use client";

import {
	Activity,
	Brain,
	ShieldAlert,
	Clock,
	Wallet,
	Package,
} from "lucide-react";
import { useGameContext } from "@/contexts/GameContext";
import Image from "next/image";

export function GameHUD() {
	const {
		health,
		hunger,
		sanity,
		money,
		time,
		day,
		socialStigma,
		workTool,
		dignity,
		avatar,
	} = useGameContext();

	// Efeito de bordo pulsante para alto estigma
	const stigmaAlert = socialStigma > 80;

	return (
		<>
			{stigmaAlert && (
				<div className="fixed inset-0 pointer-events-none border-4 border-red-900/20 animate-pulse z-[60]" />
			)}

			<div className="fixed top-0 left-0 w-full bg-black/95 text-slate-400 p-2 z-50 border-b border-slate-900 flex items-center justify-between pointer-events-auto shadow-[0_0_30px_rgba(0,0,0,1)]">
				{/* Esquerda: Identidade e Biometria Urbana */}
				<div className="flex items-center gap-6 px-4">
					{avatar?.avatarImage && (
						<div className="relative w-10 h-10 rounded-lg overflow-hidden border border-slate-800 shadow-lg flex-none group">
							<Image
								src={avatar.avatarImage}
								alt={avatar.name}
								fill
								className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
							/>
							<div className="absolute inset-0 bg-blue-900/10 mix-blend-overlay"></div>
						</div>
					)}
					<div className="flex items-center gap-6">
						<BiometricItem
							icon={Activity}
							value={health}
							label="BIO"
							status={health < 30 ? "CRITICAL" : "OK"}
						/>
						<BiometricItem
							icon={Brain}
							value={sanity}
							label="PSI"
							status={sanity < 30 ? "CRITICAL" : "OK"}
						/>
						<BiometricItem
							icon={ShieldAlert}
							value={socialStigma}
							label="RISK"
							type="INVERTED"
							status={socialStigma > 70 ? "CRITICAL" : "OK"}
						/>
					</div>
				</div>

				{/* Centro: Status de Ferramenta */}
				<div className="hidden lg:flex items-center gap-6 text-[9px] font-mono tracking-[0.2em] uppercase opacity-40">
					{workTool.type ? (
						<div className="flex items-center gap-2">
							<Package className="h-3 w-3" />
							<span>{workTool.type.replace("_", " ")} // {workTool.condition}%</span>
						</div>
					) : (
						<span className="italic text-slate-800">NO_PRODUCTION_TOOL</span>
					)}
					<div className="h-4 w-[1px] bg-slate-900" />
					<div className="flex items-center gap-2 border border-slate-900 px-2 py-0.5">
						<span className="text-slate-400">DGN: {Math.round(dignity)}%</span>
					</div>
				</div>

				{/* Direita: Economia e Tempo */}
				<div className="flex items-center gap-6 px-4">
					<div className="flex flex-col items-end">
						<div className="flex items-center gap-2 text-white font-mono text-xs border-b border-slate-900 pb-0.5 mb-0.5">
							<Wallet className="h-3 w-3 text-slate-600" />
							<span>BRL {money.toFixed(2)}</span>
						</div>
						<div className="flex items-center gap-2 font-mono text-[9px] text-slate-600 tracking-tighter uppercase">
							<Clock className="h-3 w-3" />
							<span>D{day} // {time.toString().padStart(2, "0")}:00</span>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

function BiometricItem({
	icon: Icon,
	value,
	label,
	status,
	type = "NORMAL",
}: {
	icon: any;
	value: number;
	label: string;
	status: "OK" | "CRITICAL";
	type?: "NORMAL" | "INVERTED";
}) {
	const isAlarm = status === "CRITICAL";

	return (
		<div className="flex items-center gap-2 group">
			<div className={`p-1 border ${isAlarm ? 'border-red-900/50 bg-red-950/20' : 'border-slate-900 bg-black'}`}>
				<Icon className={`h-3.5 w-3.5 ${isAlarm ? 'text-red-600 animate-pulse' : 'text-slate-700'}`} />
			</div>
			<div className="flex flex-col">
				<div className="flex items-center justify-between gap-4">
					<span className="text-[8px] font-mono font-bold text-slate-600 tracking-wider leading-none">{label}</span>
					<span className={`text-[9px] font-mono leading-none ${isAlarm ? 'text-red-600' : 'text-slate-500'}`}>
						{Math.round(value)}
					</span>
				</div>
				<div className="h-0.5 w-16 bg-slate-950 mt-1">
					<div
						className={`h-full transition-all duration-1000 ${isAlarm ? 'bg-red-800' : 'bg-slate-700'}`}
						style={{ width: `${type === "NORMAL" ? value : value}%` }}
					/>
				</div>
			</div>
		</div>
	);
}
