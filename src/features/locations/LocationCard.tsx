"use client";

import { Clock, ShieldCheck, Siren, Sofa } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Location } from "@/types/GameState";

interface LocationCardProps {
	location: Location;
	onClick: () => void;
}

/**
 * [REALISMO SÓBRIO] Converte valores numéricos para labels qualitativos
 * Mantém a imersão narrativa evitando números brutos
 */
const getSecurityLevel = (
	stigmaMultiplier: number,
): { label: string; className: string } => {
	if (stigmaMultiplier >= 1.5)
		return { label: "Baixa", className: "text-zinc-400" };
	if (stigmaMultiplier >= 1.0)
		return { label: "Média", className: "text-zinc-400" };
	return { label: "Alta", className: "text-zinc-300" };
};

const getComfortLevel = (
	sanityDrain: number,
): { label: string; className: string } => {
	if (sanityDrain <= -2) return { label: "Baixo", className: "text-zinc-400" };
	if (sanityDrain <= -1) return { label: "Médio", className: "text-zinc-400" };
	return { label: "Alto", className: "text-zinc-300" };
};

export function LocationCard({ location, onClick }: LocationCardProps) {
	// Determine risk level label based on the first risk probability
	const mainRisk = location.risks[0];
	const riskLevel =
		mainRisk?.probability > 0.3
			? "Alto"
			: mainRisk?.probability > 0.1
				? "Médio"
				: "Baixo";

	const security = getSecurityLevel(location.stigmaMultiplier);
	const comfort = getComfortLevel(location.sanityDrainBase);

	return (
		<button
			type="button"
			onClick={onClick}
			aria-label={`Visualizar detalhes de ${location.name}. Risco ${riskLevel}. Segurança ${security.label}. Conforto ${comfort.label}.`}
			className="w-full text-left bg-zinc-900 border border-zinc-800 rounded-xl p-4 transition-all active:scale-[0.98] hover:bg-zinc-800 group shadow-lg focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-zinc-950"
		>
			<div className="flex justify-between items-start mb-2">
				<h3 className="font-bold text-zinc-100 text-lg group-hover:text-white transition-colors">
					{location.name}
				</h3>
				<Badge
					variant="outline"
					className="bg-zinc-950 text-zinc-400 border-zinc-800 font-mono text-[10px] uppercase tracking-wider"
				>
					Risco {riskLevel}
				</Badge>
			</div>

			<p className="text-zinc-400 text-sm line-clamp-2 mb-4 leading-relaxed italic">
				"{location.description}"
			</p>

			<div className="flex flex-wrap gap-4 items-center">
				{/* Indicadores Qualitativos - Segurança e Conforto */}
				<div
					className="flex items-center gap-1.5 font-mono text-xs"
					aria-hidden="true"
				>
					<ShieldCheck size={14} className="text-zinc-600" />
					<span className={security.className}>Segurança {security.label}</span>
				</div>

				<div
					className="flex items-center gap-1.5 font-mono text-xs"
					aria-hidden="true"
				>
					<Sofa size={14} className="text-zinc-600" />
					<span className={comfort.className}>Conforto {comfort.label}</span>
				</div>

				{/* Indicadores Contextuais */}
				{location.risks.some((r) => r.id === "abordagem_policial") && (
					<div
						className="flex items-center gap-1.5 text-zinc-500 font-mono text-xs"
						aria-hidden="true"
					>
						<Siren size={14} className="text-zinc-600" />
						<span>Vigilância</span>
					</div>
				)}

				{location.resources.some((r) => r.timeRequired > 1.5) && (
					<div
						className="flex items-center gap-1.5 text-zinc-500 font-mono text-xs"
						aria-hidden="true"
					>
						<Clock size={14} className="text-zinc-600" />
						<span>Demorado</span>
					</div>
				)}
			</div>
		</button>
	);
}
