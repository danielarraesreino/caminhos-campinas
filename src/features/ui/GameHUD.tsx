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
	} = useGameContext();

	// Efeito de bordo pulsante para alto estigma
	const stigmaAlert = socialStigma > 80;

	return (
		<>
			{stigmaAlert && (
				<div className="fixed inset-0 pointer-events-none border-4 border-red-900/20 animate-pulse z-[60]" />
			)}

			<div className="fixed top-0 left-0 w-full bg-slate-950/90 backdrop-blur-md text-slate-300 p-3 z-50 border-b border-slate-800 flex items-center justify-between pointer-events-auto shadow-2xl">
				{/* Esquerda: Biometria Urbana */}
				<div className="flex items-center gap-8 px-4">
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

				{/* Centro: Status de Ferramenta */}
				<div className="hidden lg:flex items-center gap-6 text-[10px] font-mono tracking-widest uppercase opacity-60">
					{workTool.type ? (
						<div className="flex items-center gap-2">
							<Package className="h-3 w-3" />
							<span>{workTool.type.replace("_", " ")} [{workTool.condition}%]</span>
						</div>
					) : (
						<span className="italic text-slate-500">Sem ferramenta de produção</span>
					)}
					<div className="h-4 w-[1px] bg-slate-800" />
					<div className="flex items-center gap-2">
						<span className="text-blue-500">DIG: {Math.round(dignity)}%</span>
					</div>
				</div>

				{/* Direita: Economia e Tempo */}
				<div className="flex items-center gap-6 px-4">
					<div className="flex flex-col items-end gap-1">
						<div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
							<Wallet className="h-4 w-4" />
							<span>R$ {money.toFixed(2)}</span>
						</div>
						<div className="flex items-center gap-2 font-mono text-[10px] text-slate-500">
							<Clock className="h-3 w-3" />
							<span>DIA {day} • {time.toString().padStart(2, "0")}:00</span>
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
		<div className="flex items-center gap-3 group">
			<div className={`p-1.5 rounded bg-slate-900 border ${isAlarm ? 'border-red-900/50' : 'border-slate-800'}`}>
				<Icon className={`h-4 w-4 ${isAlarm ? 'text-red-500 animate-pulse' : 'text-slate-500'}`} />
			</div>
			<div className="flex flex-col">
				<span className="text-[9px] font-bold text-slate-600 tracking-tighter leading-none mb-1">{label}</span>
				<div className="flex items-center gap-2">
					<div className="h-1 w-12 bg-slate-900 rounded-full overflow-hidden">
						<div
							className={`h-full transition-all duration-700 ${isAlarm ? 'bg-red-600' : 'bg-slate-600'}`}
							style={{ width: `${type === "NORMAL" ? value : value}%` }}
						/>
					</div>
					<span className={`text-[10px] font-mono leading-none ${isAlarm ? 'text-red-400' : 'text-slate-400'}`}>
						{Math.round(value)}
					</span>
				</div>
			</div>
		</div>
	);
}
