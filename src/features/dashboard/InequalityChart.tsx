import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { useMemo } from "react";
import type { TelemetryEvent } from "@/services/telemetry";

interface InequalityChartProps {
	data: TelemetryEvent[];
}

export function InequalityChart({ data }: InequalityChartProps) {
	const stats = useMemo(() => {
		// Group A: Mulheres Negras
		const groupA = data.filter((e) => {
			const m = e.metadata as Record<string, unknown>;
			return (
				m.demographic_gender === "mulher" && m.demographic_ethnicity === "preta"
			);
		});

		// Group B: Homens Brancos
		const groupB = data.filter((e) => {
			const m = e.metadata as Record<string, unknown>;
			return (
				m.demographic_gender === "homem" && m.demographic_ethnicity === "branca"
			);
		});

		const calculateRefusalRate = (events: TelemetryEvent[]) => {
			if (events.length === 0) return 0;
			const refusals = events.filter((e) => {
				const m = e.metadata as Record<string, unknown>;
				const outcome = (m.outcome as string) || "";
				// Keywords for refusal/barrier
				return (
					outcome.includes("BARRAD") ||
					outcome.includes("RECUSA") ||
					outcome.includes("DEGRADACAO")
				);
			}).length;
			return Math.round((refusals / events.length) * 100);
		};

		return {
			groupA: {
				count: groupA.length,
				refusalRate: calculateRefusalRate(groupA),
			},
			groupB: {
				count: groupB.length,
				refusalRate: calculateRefusalRate(groupB),
			},
		};
	}, [data]);

	if (stats.groupA.count === 0 && stats.groupB.count === 0) return null;

	return (
		<div className="bg-[#0c0c0f] border border-slate-800 p-8 rounded-3xl shadow-xl space-y-6">
			<div className="flex items-center gap-3 mb-6">
				<div className="bg-red-500/10 p-2 rounded-lg">
					<AlertTriangle className="text-red-500" size={24} />
				</div>
				<div>
					<h3 className="text-lg font-black text-white uppercase tracking-tight">
						Índice de Barreiras Institucionais (ODS 10)
					</h3>
					<p className="text-xs text-slate-500 font-mono tracking-widest">
						COMPARATIVO DE ACESSO POR PERFIL DEMOGRÁFICO
					</p>
				</div>
			</div>

			<div className="space-y-8">
				{/* Visual Bar Group A */}
				<div className="space-y-2">
					<div className="flex justify-between text-sm font-bold text-slate-300">
						<span>Mulheres Negras (Vulnerabilidade Alta)</span>
						<span className="text-red-400">
							{stats.groupA.refusalRate}% Negação
						</span>
					</div>
					{/* biome-ignore lint/style/noInlineStyle: dynamic width */}
					<div className="h-4 bg-slate-800 rounded-full overflow-hidden relative">
						<div
							className="absolute top-0 left-0 h-full bg-red-600 transition-all duration-1000 ease-out"
							style={{ width: `${stats.groupA.refusalRate}%` }}
						/>
					</div>
					<p className="text-[10px] text-slate-600 uppercase">
						Base: {stats.groupA.count} eventos registrados
					</p>
				</div>

				{/* Visual Bar Group B */}
				<div className="space-y-2">
					<div className="flex justify-between text-sm font-bold text-slate-300">
						<span>Homens Brancos (Referência)</span>
						<span
							className={
								stats.groupB.refusalRate > 30
									? "text-orange-400"
									: "text-emerald-400"
							}
						>
							{stats.groupB.refusalRate}% Negação
						</span>
					</div>
					{/* biome-ignore lint/style/noInlineStyle: dynamic width */}
					<div className="h-4 bg-slate-800 rounded-full overflow-hidden relative">
						<div
							className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out ${stats.groupB.refusalRate > 30 ? "bg-orange-500" : "bg-emerald-500"}`}
							style={{ width: `${stats.groupB.refusalRate}%` }}
						/>
					</div>
					<p className="text-[10px] text-slate-600 uppercase">
						Base: {stats.groupB.count} eventos registrados
					</p>
				</div>
			</div>

			<div className="pt-6 border-t border-slate-800/50">
				<div className="flex items-start gap-3">
					<CheckCircle2 size={16} className="text-blue-500 mt-0.5" />
					<p className="text-xs text-slate-400 leading-relaxed font-sans">
						<strong>Análise de Big Data Social:</strong> A discrepância entre as
						taxas de negação evidencia falhas na capilaridade dos serviços para
						grupos vulneráveis, indicando racismo institucional ou falta de
						adaptação de equipamentos públicos (Ex: Vagas femininas).
					</p>
				</div>
			</div>
		</div>
	);
}
