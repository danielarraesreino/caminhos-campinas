import type { LucideIcon } from "lucide-react";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";

interface InteractiveStatusProps {
	value: number;
	max?: number;
	label: string;
	details: string;
	icon: LucideIcon;
	colorClass: string;
	isCurrency?: boolean;
	riskThreshold?: number;
}

export function InteractiveStatus({
	value,
	max = 100,
	label,
	details,
	icon: Icon,
	colorClass,
	isCurrency = false,
	riskThreshold = 30,
}: InteractiveStatusProps) {
	// Determinar cor baseada no risco ou usar a cor padrão
	// Se for moeda, geralmente não tem "risco" de cor vermelha (ou tem se for pouco dinheiro?)
	// Vamos manter simples: se não for currency e value < riskThreshold, usa vermelho.
	// Mas o colorClass passado já deve ser a cor do ícone "normal".

	const isCritical = !isCurrency && value < riskThreshold;
	const displayColor = isCritical ? "text-red-500" : colorClass;
	const progressColor = isCritical
		? "bg-red-600"
		: colorClass.replace("text-", "bg-");

	const displayValue = isCurrency
		? `R$ ${value.toFixed(0)}`
		: `${Math.round(value)}%`;

	const progressValue = isCurrency ? 100 : (value / max) * 100; // Moeda não tem barra de progresso usualmente, ou é cheia?

	return (
		<Popover>
			{/* O Trigger é o elemento clicável na tela principal */}
			<PopoverTrigger asChild>
				<button
					type="button"
					className="flex flex-col items-center gap-1 group w-14 focus:outline-none"
					aria-label={label}
					data-testid={`stat-${label.toLowerCase()}`}
				>
					<div className="flex items-center gap-1">
						<Icon
							className={`h-4 w-4 ${displayColor} transition-transform group-active:scale-95`}
						/>
						<span
							className={`text-[10px] font-bold ${isCurrency ? "text-emerald-400" : "text-slate-200"}`}
						>
							{displayValue}
						</span>
					</div>

					{!isCurrency && (
						<Progress
							value={progressValue}
							className="h-1 w-full bg-slate-800"
							indicatorClassName={progressColor}
						/>
					)}
					<span className="sr-only">
						{label}: {displayValue}. Clique para ver detalhes.
					</span>
				</button>
			</PopoverTrigger>

			{/* O Content é o "Layer" explicativo que aparece */}
			<PopoverContent
				side="bottom"
				className="w-64 bg-slate-950 border-slate-800 text-slate-200 text-xs p-3 shadow-xl z-50 rounded-xl"
			>
				<div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-900">
					<Icon className={`h-4 w-4 ${displayColor}`} />
					<h4 className="font-bold text-sm uppercase text-white">
						{label}: {displayValue}
					</h4>
				</div>

				<p className="text-slate-400 leading-relaxed">{details}</p>

				{isCritical && (
					<div className="mt-2 text-red-400 border-l-2 border-red-500 pl-2 text-[10px] animate-pulse font-bold">
						⚠️ Nível Crítico! Procure ajuda imediatamente.
					</div>
				)}
			</PopoverContent>
		</Popover>
	);
}
