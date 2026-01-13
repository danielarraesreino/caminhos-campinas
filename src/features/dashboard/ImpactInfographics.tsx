"use client";

import { Check, Share2 } from "lucide-react";
import { useMemo, useState } from "react";
import {
	Bar,
	BarChart,
	Cell,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { NGO_ESTIMATES } from "@/data/census-reality";

/**
 * Data Storytelling - Infográficos de Impacto Social
 * Dados visuais que chocam e mobilizam. Printáveis para redes sociais.
 */
export function ImpactInfographics() {
	// Gráfico 1: A Economia da Exclusão
	const costData = useMemo(
		() => [
			{
				name: "Aluno Ensino Médio",
				value: NGO_ESTIMATES.hiddenIncentives.costComparison.studentPerMonth,
				color: "#3b82f6", // blue
			},
			{
				name: "Internação (CT)",
				value: NGO_ESTIMATES.hiddenIncentives.costComparison.tcPerMonth,
				color: "#ef4444", // red
			},
		],
		[],
	);

	// Gráfico 2: Quem Trabalha
	const workData = useMemo(
		() => [
			{ name: "Trabalham", value: 70.9, color: "#22c55e" },
			{ name: "Não trabalham", value: 29.1, color: "#64748b" },
		],
		[],
	);

	// Gráfico 3: Gatilho da Rua
	const causeData = useMemo(
		() => [
			{ name: "Conflitos Familiares", value: 71.5, color: "#a855f7" },
			{ name: "Drogas/Álcool", value: 60.3, color: "#f59e0b" },
			{ name: "Desemprego", value: 15.1, color: "#6366f1" },
			{ name: "Perda de Moradia", value: 7.1, color: "#14b8a6" },
		],
		[],
	);

	// State to track which graph is currently showing success feedback
	const [sharedId, setSharedId] = useState<string | null>(null);

	const handleShare = async (id: string, title: string, text: string) => {
		if (navigator.share) {
			try {
				await navigator.share({ title, text, url: window.location.href });
			} catch (e) {
				console.log("Share cancelled");
			}
		} else {
			// Fallback: copy to clipboard
			await navigator.clipboard.writeText(
				`${title}\n${text}\n${window.location.href}`,
			);
			// Show inline feedback instead of blocking alert
			setSharedId(id);
			setTimeout(() => {
				if (sharedId === id) setSharedId(null);
			}, 2000);
		}
	};

	return (
		<div className="space-y-8">
			<h2 className="text-2xl font-bold text-white flex items-center gap-3">
				<span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />A
				Realidade em Gráficos
			</h2>
			<p className="text-slate-400 text-sm max-w-2xl">
				Dados que desmontam o senso comum. Compartilhe nas redes para amplificar
				a denúncia.
			</p>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* GRÁFICO 1: Economia da Exclusão */}
				<div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 backdrop-blur-sm">
					<div className="flex justify-between items-start mb-4">
						<h3 className="font-bold text-white text-lg">
							💰 A Economia da Exclusão
						</h3>
						<button
							type="button"
							onClick={() =>
								handleShare(
									"graph1",
									"A Economia da Exclusão",
									`Sabia que Campinas paga 4x mais para internar (R$ 1.350) do que para educar (R$ 316)? O modelo atual custa caro e não resolve. Apoie o Housing First! #CaminhosCampinas #HousingFirst`,
								)
							}
							className={`p-2 rounded-lg transition-colors ${sharedId === "graph1" ? "bg-green-500/20 text-green-400" : "hover:bg-slate-700 text-slate-400"}`}
						>
							{sharedId === "graph1" ? (
								<Check className="w-4 h-4" />
							) : (
								<Share2 className="w-4 h-4" />
							)}
						</button>
					</div>

					<ResponsiveContainer width="100%" height={180}>
						<BarChart data={costData} layout="vertical">
							<XAxis type="number" hide />
							<YAxis
								type="category"
								dataKey="name"
								width={100}
								tick={{ fill: "#94a3b8", fontSize: 11 }}
							/>
							<Tooltip
								formatter={(value) => [`R$ ${value ?? 0}`, "Custo/mês"]}
								contentStyle={{ background: "#1e293b", border: "none" }}
							/>
							<Bar dataKey="value" radius={[0, 4, 4, 0]}>
								{costData.map((entry, index) => (
									<Cell key={`cell-${index}`} fill={entry.color} />
								))}
							</Bar>
						</BarChart>
					</ResponsiveContainer>

					<div className="mt-4 p-3 bg-red-950/30 rounded-lg border border-red-900/30">
						<p className="text-xs text-red-300">
							<strong>Incentivo Perverso:</strong> O sistema paga{" "}
							<span className="text-white font-bold">4x mais</span> para
							remediar do que para prevenir.
						</p>
					</div>
				</div>

				{/* GRÁFICO 2: Quem Trabalha */}
				<div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 backdrop-blur-sm">
					<div className="flex justify-between items-start mb-4">
						<h3 className="font-bold text-white text-lg">
							💪 Quem Realmente Trabalha?
						</h3>
						<button
							type="button"
							onClick={() =>
								handleShare(
									"graph2",
									"O Mito da Vadiagem",
									"Não é preguiça, é falta de oportunidade. 70% da população de rua TRABALHA. O que falta é a chance, não a vontade. Jogue e entenda: caminhos-campinas.vercel.app #CaminhosCampinas",
								)
							}
							className={`p-2 rounded-lg transition-colors ${sharedId === "graph2" ? "bg-green-500/20 text-green-400" : "hover:bg-slate-700 text-slate-400"}`}
						>
							{sharedId === "graph2" ? (
								<Check className="w-4 h-4" />
							) : (
								<Share2 className="w-4 h-4" />
							)}
						</button>
					</div>

					<ResponsiveContainer width="100%" height={180}>
						<PieChart>
							<Pie
								data={workData}
								cx="50%"
								cy="50%"
								innerRadius={45}
								outerRadius={70}
								paddingAngle={3}
								dataKey="value"
								label={({ name, value }) => `${value}%`}
								labelLine={false}
							>
								{workData.map((entry, index) => (
									<Cell key={`cell-${index}`} fill={entry.color} />
								))}
							</Pie>
							<Tooltip
								formatter={(value) => [`${value ?? 0}%`, ""]}
								contentStyle={{ background: "#1e293b", border: "none" }}
							/>
						</PieChart>
					</ResponsiveContainer>

					<div className="flex justify-center gap-4 mt-2 text-xs">
						<span className="flex items-center gap-1">
							<span className="w-3 h-3 bg-green-500 rounded-full" />
							Trabalham (70,9%)
						</span>
						<span className="flex items-center gap-1 text-slate-400">
							<span className="w-3 h-3 bg-slate-500 rounded-full" />
							Não (29,1%)
						</span>
					</div>

					<div className="mt-4 p-3 bg-green-950/30 rounded-lg border border-green-900/30">
						<p className="text-xs text-green-300">
							<strong>Quebrando o estigma:</strong> A maioria é força de
							trabalho ativa, mas{" "}
							<span className="text-white font-bold">informal</span>.
						</p>
					</div>
				</div>

				{/* GRÁFICO 3: Gatilho da Rua */}
				<div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 backdrop-blur-sm">
					<div className="flex justify-between items-start mb-4">
						<h3 className="font-bold text-white text-lg">
							💔 O Gatilho da Rua
						</h3>
						<button
							type="button"
							onClick={() =>
								handleShare(
									"graph3",
									"A Rua Começa em Casa",
									"71,5% foram para a rua por conflitos familiares. O buraco é afetivo antes de ser químico. A droga entra onde o vínculo rompeu. #CaminhosCampinas #SaúdeMental",
								)
							}
							className={`p-2 rounded-lg transition-colors ${sharedId === "graph3" ? "bg-green-500/20 text-green-400" : "hover:bg-slate-700 text-slate-400"}`}
						>
							{sharedId === "graph3" ? (
								<Check className="w-4 h-4" />
							) : (
								<Share2 className="w-4 h-4" />
							)}
						</button>
					</div>

					<ResponsiveContainer width="100%" height={180}>
						<BarChart data={causeData} layout="vertical">
							<XAxis type="number" domain={[0, 100]} hide />
							<YAxis
								type="category"
								dataKey="name"
								width={90}
								tick={{ fill: "#94a3b8", fontSize: 10 }}
							/>
							<Tooltip
								formatter={(value) => [`${value ?? 0}%`, ""]}
								contentStyle={{ background: "#1e293b", border: "none" }}
							/>
							<Bar dataKey="value" radius={[0, 4, 4, 0]}>
								{causeData.map((entry, index) => (
									<Cell key={`cell-${index}`} fill={entry.color} />
								))}
							</Bar>
						</BarChart>
					</ResponsiveContainer>

					<div className="mt-4 p-3 bg-purple-950/30 rounded-lg border border-purple-900/30">
						<p className="text-xs text-purple-300">
							<strong>A rua começa em casa:</strong> O rompimento de vínculos
							supera a droga como causa.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
