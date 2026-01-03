"use client";
import {
	AlertTriangle,
	Droplets,
	Heart,
	Home,
	Shield,
	Users,
	Utensils,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CENSUS_REALITY } from "@/data/census-reality";
import {
	runCensusSimulation,
	type SimAgent,
} from "@/features/dashboard/SimulationEngine";

export default function ImpactPage() {
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

			{/* SEÇÃO NOVA: Auditoria Sociotécnica (Solicitada pelo Censo 2024) */}
			<div className="mt-12 border-t border-slate-800 pt-12">
				<h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
					<span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />A
					Realidade Invisível
				</h2>
				<p className="text-slate-400 mb-8 max-w-3xl">
					Auditoria cruzada: Dados oficiais do Censo Pop Rua 2024 vs. Mitos
					Sociais. A tecnologia e a violência institucional operam como
					barreiras invisíveis.
				</p>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{/* CARD 1: Exclusão Digital */}
					<div className="bg-slate-900/50 p-6 rounded-2xl border border-red-900/30 ring-1 ring-red-900/10">
						<h3 className="text-lg font-bold text-red-200 mb-6 flex items-center gap-2">
							<div className="p-2 bg-red-950 rounded-lg">
								<AlertTriangle className="w-4 h-4 text-red-500" />
							</div>
							Barreira Digital (Acesso Negado)
						</h3>

						<div className="space-y-6">
							<div className="relative pt-2">
								<div className="flex justify-between text-xs uppercase tracking-widest font-bold mb-2">
									<span className="text-slate-400">Sem Celular</span>
									<span className="text-white">
										{CENSUS_REALITY.digitalExclusion.noPhone}%
									</span>
								</div>
								<div className="h-2 bg-slate-800 rounded-full overflow-hidden">
									<div
										className="h-full bg-red-600 rounded-full"
										style={{
											width: `${CENSUS_REALITY.digitalExclusion.noPhone}%`,
										}}
									/>
								</div>
							</div>

							<div className="relative pt-2">
								<div className="flex justify-between text-xs uppercase tracking-widest font-bold mb-2">
									<span className="text-slate-400">Tem Celular, Sem Dados</span>
									<span className="text-white">
										{CENSUS_REALITY.digitalExclusion.noData}%
									</span>
								</div>
								<div className="h-2 bg-slate-800 rounded-full overflow-hidden">
									<div
										className="h-full bg-orange-500 rounded-full"
										style={{
											width: `${CENSUS_REALITY.digitalExclusion.noData}%`,
										}}
									/>
								</div>
								<p className="text-[10px] text-orange-400/80 mt-2 leading-relaxed">
									A exigência de agendamento online (Poupatempo/CRAS) bloqueia
									45% (Sem dados) + 20% (Sem aparelho) ={" "}
									<strong>65% da população</strong>.
								</p>
							</div>
						</div>
					</div>

					{/* CARD 2: Violência Institucional */}
					<div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
						<h3 className="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2">
							<div className="p-2 bg-slate-800 rounded-lg">
								<Shield className="w-4 h-4 text-blue-400" />
							</div>
							Quem agride na rua?
						</h3>

						<div className="flex items-end justify-center gap-4 h-[140px] mb-4">
							<div className="w-full flex flex-col items-center gap-2 group">
								<span className="text-2xl font-black text-red-500">
									{CENSUS_REALITY.violenceSource.publicAgents}%
								</span>
								<div
									className="w-full bg-red-900/50 border border-red-500 rounded-t-lg transition-all group-hover:bg-red-900/80"
									style={{
										height: `${CENSUS_REALITY.violenceSource.publicAgents}%`,
									}}
								/>
								<span className="text-[10px] uppercase font-bold text-center text-slate-400">
									Agentes do Estado
									<br />
									(PM, GM)
								</span>
							</div>

							<div className="w-full flex flex-col items-center gap-2 group">
								<span className="text-2xl font-black text-slate-500">
									{CENSUS_REALITY.violenceSource.civilians}%
								</span>
								<div
									className="w-full bg-slate-800 border border-slate-600 rounded-t-lg transition-all group-hover:bg-slate-700"
									style={{
										height: `${CENSUS_REALITY.violenceSource.civilians}%`,
									}}
								/>
								<span className="text-[10px] uppercase font-bold text-center text-slate-400">
									Sociedade Civil
								</span>
							</div>
						</div>
						<p className="text-xs text-slate-500 mt-4 text-center">
							ODS 16 Violado: A instituição que deveria proteger é a principal
							autora da violência.
						</p>
					</div>

					{/* CARD 3: Causa Raiz (Mito vs Realidade) */}
					<div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
						<h3 className="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2">
							<div className="p-2 bg-slate-800 rounded-lg">
								<Heart className="w-4 h-4 text-purple-400" />
							</div>
							Por que estão na rua?
						</h3>

						<div className="space-y-4">
							<div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
								<div className="flex justify-between items-center mb-2">
									<span className="text-sm font-bold text-purple-300">
										Conflitos Familiares
									</span>
									<span className="text-xl font-black text-white">
										{CENSUS_REALITY.causes.familyConflict}%
									</span>
								</div>
								<div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
									<div
										style={{
											width: `${CENSUS_REALITY.causes.familyConflict}%`,
										}}
										className="h-full bg-purple-500"
									/>
								</div>
							</div>

							<div className="bg-slate-800/30 p-4 rounded-xl border border-slate-800 opacity-70">
								<div className="flex justify-between items-center mb-2">
									<span className="text-sm font-bold text-slate-400">
										Álcool/Drogas
									</span>
									<span className="text-xl font-black text-slate-400">
										~30%
									</span>
								</div>
								<div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
									<div
										style={{ width: "30%" }}
										className="h-full bg-slate-600"
									/>
								</div>
							</div>

							<div className="text-xs text-slate-400 italic bg-purple-900/20 p-3 rounded-lg border border-purple-500/20">
								"Aporofobia se baseia no mito do vício. A realidade é o
								rompimento de vínculos."
							</div>
						</div>
					</div>
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
