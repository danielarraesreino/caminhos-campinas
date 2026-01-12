"use client";

import { AlertTriangle, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { NGO_ESTIMATES } from "@/data/census-reality";

/**
 * Toggle que revela a diferença entre dados oficiais e estimativas das ONGs.
 * Implementa a visão "Freakonomics" sobre incentivos ocultos na coleta de dados.
 */
export function HiddenDataToggle() {
	const [showNGOData, setShowNGOData] = useState(false);

	const { population, methodologyCritique, hiddenIncentives } = NGO_ESTIMATES;

	return (
		<div className="bg-gradient-to-br from-slate-900 to-slate-950 p-6 rounded-2xl border border-slate-700">
			{/* Toggle Header */}
			<div className="flex items-center justify-between mb-6">
				<h3 className="text-lg font-bold text-white flex items-center gap-2">
					<AlertTriangle className="w-5 h-5 text-yellow-500" />
					Realidade Paralela
				</h3>

				<button
					type="button"
					onClick={() => setShowNGOData(!showNGOData)}
					className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all ${
						showNGOData
							? "bg-purple-600 text-white"
							: "bg-slate-800 text-slate-300 hover:bg-slate-700"
					}`}
				>
					{showNGOData ? (
						<>
							<Eye className="w-4 h-4" />
							Visão ONGs
						</>
					) : (
						<>
							<EyeOff className="w-4 h-4" />
							Dados Oficiais
						</>
					)}
				</button>
			</div>

			{/* Population Comparison */}
			<div className="grid grid-cols-2 gap-4 mb-6">
				<div
					className={`p-4 rounded-xl border transition-all ${
						!showNGOData
							? "bg-blue-950/50 border-blue-500/50"
							: "bg-slate-800/50 border-slate-700 opacity-60"
					}`}
				>
					<span className="text-xs text-slate-400 uppercase tracking-wider">
						Censo Oficial
					</span>
					<p className="text-3xl font-black text-blue-400 mt-1">
						{population.official.toLocaleString("pt-BR")}
					</p>
					<span className="text-[10px] text-slate-500">FEAC 2024</span>
				</div>

				<div
					className={`p-4 rounded-xl border transition-all ${
						showNGOData
							? "bg-purple-950/50 border-purple-500/50 ring-2 ring-purple-500/30"
							: "bg-slate-800/50 border-slate-700 opacity-60"
					}`}
				>
					<span className="text-xs text-slate-400 uppercase tracking-wider">
						Estimativa ONGs
					</span>
					<p className="text-3xl font-black text-purple-400 mt-1">
						~{population.estimated.toLocaleString("pt-BR")}
					</p>
					<span className="text-[10px] text-purple-400/80">
						+{population.invisiblePopulation} invisíveis
					</span>
				</div>
			</div>

			{/* Revelation Panel */}
			{showNGOData && (
				<div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
					{/* Methodology Critique */}
					<div className="bg-red-950/30 p-4 rounded-xl border border-red-900/50">
						<h4 className="text-sm font-bold text-red-300 mb-2">
							{methodologyCritique.title}
						</h4>
						<ul className="text-xs text-slate-300 space-y-1">
							{methodologyCritique.issues.map((issue, i) => (
								<li key={i} className="flex gap-2">
									<span className="text-red-400">✗</span>
									{issue}
								</li>
							))}
						</ul>
						<p className="text-[10px] text-slate-500 mt-2">
							Fonte: {methodologyCritique.source}
						</p>
					</div>

					{/* Hidden Incentives */}
					<div className="bg-yellow-950/30 p-4 rounded-xl border border-yellow-900/50">
						<h4 className="text-sm font-bold text-yellow-300 mb-2">
							💰 {hiddenIncentives.title}
						</h4>
						<div className="flex gap-4 text-xs text-slate-300">
							<div>
								<span className="text-slate-500">Aluno/mês:</span>
								<span className="font-bold ml-1">
									R$ {hiddenIncentives.costComparison.studentPerMonth}
								</span>
							</div>
							<div>
								<span className="text-slate-500">CT/mês:</span>
								<span className="font-bold ml-1 text-yellow-400">
									R$ {hiddenIncentives.costComparison.tcPerMonth}
								</span>
							</div>
						</div>
						<p className="text-[10px] text-yellow-400/80 mt-2">
							{hiddenIncentives.critique}
						</p>
					</div>

					{/* Trusted Sources */}
					<div className="text-[10px] text-slate-500 text-center mt-4">
						Fontes:{" "}
						{NGO_ESTIMATES.trustedSources.map((s) => s.name).join(" • ")}
					</div>
				</div>
			)}

			{/* Default State Explanation */}
			{!showNGOData && (
				<p className="text-xs text-slate-500 text-center">
					Clique em "Visão ONGs" para revelar a população invisível.
				</p>
			)}
		</div>
	);
}
