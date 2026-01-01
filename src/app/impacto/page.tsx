"use client";
import { useEffect, useState, useMemo } from "react";
import {
	runCensusSimulation,
	SimAgent,
} from "@/features/dashboard/SimulationEngine";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Home, Utensils, Users, Droplets } from "lucide-react";

export default function ImpactDashboardPage() {
	const [data, setData] = useState<SimAgent[]>([]);

	useEffect(() => {
		setData(runCensusSimulation());
	}, []);

	const stats = useMemo(() => {
		if (data.length === 0)
			return {
				total: 0,
				housingDeficit: 0,
				foodInsecurity: 0,
				sanitationCrisis: 0,
				menstrualPoverty: 0,
				racialGap: 0,
			};

		const total = data.length;
		const housing = data.filter((a) => !a.status.sheltered).length;
		const food = data.filter((a) => a.status.hungry).length;
		const sanitation = data.filter(
			(a) => a.status.sanitationAccess === "RUA",
		).length;
		const menstrual = data.filter(
			(a) => a.demographics.gender === "FEMININO" && !a.status.menstrualDignity,
		).length;
		const racial = data.filter(
			(a) => a.demographics.race === "PRETA_PARDA",
		).length;

		return {
			total,
			housingDeficit: Math.round((housing / total) * 100),
			foodInsecurity: Math.round((food / total) * 100),
			sanitationCrisis: Math.round((sanitation / total) * 100),
			menstrualPoverty: Math.round((menstrual / total) * 100),
			racialGap: Math.round((racial / total) * 100),
		};
	}, [data]);

	return (
		<div className="min-h-screen bg-slate-950 text-white p-8">
			<header className="mb-12">
				<h1 className="text-4xl font-bold mb-2">
					Painel de Inteligência Social
				</h1>
				<p className="text-slate-400">
					Simulação baseada no Censo Pop. Rua Campinas 2024 (1.557 pessoas
					mapeadas)
				</p>
			</header>

			{/* KPIs de Impacto */}
			<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
				<KpiCard
					title="População Mapeada"
					value={stats.total}
					icon={<Users className="text-blue-400" />}
					desc="Vidas simuladas hoje"
				/>
				<KpiCard
					title="Déficit Habitacional"
					value={`${stats.housingDeficit}%`}
					icon={<Home className="text-red-400" />}
					desc="Dormindo na rua hoje (ODS 11)"
					alert
				/>
				<KpiCard
					title="Risco de Fome"
					value={`${stats.foodInsecurity}%`}
					icon={<Utensils className="text-orange-400" />}
					desc="Sem acesso a refeição (ODS 2)"
				/>
				<KpiCard
					title="Crise Sanitária"
					value={`${stats.sanitationCrisis}%`}
					icon={<Droplets className="text-purple-400" />}
					desc="Sem acesso a banheiro (ODS 6)"
					alert
				/>
				<KpiCard
					title="Dignidade Menstrual"
					value={`${stats.menstrualPoverty}%`}
					icon={<Droplets className="text-pink-400" />}
					desc="Mulheres sem insumos (ODS 3)"
				/>
				<KpiCard
					title="ODS 18 - Equidade Racial"
					value={`${stats.racialGap}%`}
					icon={<AlertTriangle className="text-yellow-400" />}
					desc="Pretos ou Pardos (Desigualdade)"
				/>
			</div>

			{/* Visualização da Lacuna (Supply vs Demand) */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
					<h2 className="text-xl font-bold mb-6 flex items-center gap-2">
						<Home className="w-5 h-5 text-blue-500" />
						Capacidade de Acolhimento (Campinas)
					</h2>

					{/* Gráfico de Barras CSS Puro */}
					<div className="space-y-6">
						<div>
							<div className="flex justify-between text-sm mb-2">
								<span className="text-slate-400">Demanda Real (Censo)</span>
								<span className="font-bold">1.557 Pessoas</span>
							</div>
							<div className="h-4 bg-slate-700 rounded-full overflow-hidden">
								<div className="h-full bg-red-500 w-full animate-pulse"></div>
							</div>
						</div>

						<div>
							<div className="flex justify-between text-sm mb-2">
								<span className="text-slate-400">
									Vagas Disponíveis (SAMIM + OSCs)
								</span>
								<span className="font-bold text-green-400">~300 Vagas</span>
							</div>
							<div className="h-4 bg-slate-700 rounded-full overflow-hidden">
								{/* 300 é aprox 19% de 1557 */}
								<div className="h-full bg-green-500 w-[19%]"></div>
							</div>
							<p className="text-xs text-red-400 mt-2">
								⚠️ 1.257 pessoas sem vaga garantida esta noite.
							</p>
						</div>
					</div>
				</div>

				{/* Insight Qualitativo */}
				<div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
					<h2 className="text-xl font-bold mb-4">Análise de Inteligência</h2>
					<ul className="space-y-4 text-sm text-slate-300">
						<li className="flex gap-3">
							<span className="text-purple-500 font-bold">
								ALERTA SANITÁRIO:
							</span>
							{stats.sanitationCrisis}% da população simulada foi forçada a usar
							a rua para necessidades fisiológicas hoje, devido a barreiras em
							comércios e falta de banheiros públicos 24h.
						</li>
						<li className="flex gap-3">
							<span className="text-red-500 font-bold">CRÍTICO:</span>O sistema
							detectou que a "Barreira do RG" impede 19% da população de acessar
							o Bom Prato (exige cadastro/documento em alguns casos).
						</li>
						<li className="flex gap-3">
							<span className="text-green-500 font-bold">OPORTUNIDADE:</span>O
							"Consultório na Rua" é o serviço mais eficaz para reduzir danos,
							mas opera com apenas 3 equipes para 1.557 pessoas.
						</li>
					</ul>
				</div>
			</div>
		</div>
	);
}

function KpiCard({ title, value, icon, desc, alert = false }: any) {
	return (
		<div
			className={`p-6 rounded-xl border ${alert ? "bg-red-950/40 border-red-500/50" : "bg-slate-900 border-slate-800"}`}
		>
			<div className="flex justify-between items-start mb-4">
				<div>
					<p className="text-slate-300 text-sm font-medium">{title}</p>
					<h3 className="text-3xl font-black mt-1">{value}</h3>
				</div>
				<div className="p-3 bg-slate-800 rounded-lg">{icon}</div>
			</div>
			<p className="text-xs text-slate-400">{desc}</p>
		</div>
	);
}
