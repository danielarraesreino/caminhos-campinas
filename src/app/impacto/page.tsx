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
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useGameContext } from "@/contexts/GameContext";
import { CENSUS_REALITY } from "@/data/census-reality";
import { HiddenDataToggle } from "@/features/dashboard/HiddenDataToggle";
import { ImpactInfographics } from "@/features/dashboard/ImpactInfographics";
import { ODSExplainer } from "@/features/dashboard/ODSExplainer";
import {
	runCensusSimulation,
	type SimAgent,
} from "@/features/dashboard/SimulationEngine";

export default function ImpactPage() {
	const { socialThermometer } = useGameContext();
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
		<main className="min-h-screen bg-black text-white p-8 pt-24 relative overflow-hidden" aria-label="Painel de Impacto Social">
			{/* Background Image - Realismo Sóbrio */}
			<div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
				<Image
					src="/images/sobrio/impacto.png"
					alt="Fundo Dashboard - Realismo Sóbrio"
					fill
					priority
					className="object-cover"
					quality={85}
				/>
				<div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/95 to-black" />
			</div>
			<div className="relative z-10">
				<header className="mb-12">
					<div className="space-y-4">
						<h1 className="text-5xl font-black uppercase tracking-tighter text-white">
							Painel de Inteligência Social
						</h1>
						<p className="text-slate-400 text-xl max-w-2xl leading-relaxed">
							O "Abismo de Números": Contrastando a realidade das ruas com os
							indicadores oficiais de Campinas através da tecnologia cívica.
						</p>
					</div>
					{/* ALERTA DE EMERGÊNCIA */}
					<div className="mb-12 bg-red-950/50 border-2 border-red-500 p-6 rounded-2xl flex items-center gap-6 animate-pulse">
						<div className="bg-red-500 p-4 rounded-full shadow-lg shadow-red-500/50">
							<AlertTriangle className="w-8 h-8 text-white" aria-label="Alerta de emergência" />
						</div>
						<div>
							<h2 className="text-2xl font-black uppercase tracking-tighter text-white">
								Estado de Emergência Habitacional
							</h2>
							<p className="text-red-200">
								Campinas possui um déficit real de <strong>938 vagas</strong> de
								acolhimento. A invisibilidade é uma falha deliberada do sistema.
							</p>
						</div>
					</div>
				</header>

				{/* KPIs de Impacto */}
				<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
					<KpiCard
						title="População Mapeada"
						value="1.300+"
						icon={<Users className="text-blue-400" />}
						desc="Oficial (Censo 2024)"
					/>
					<KpiCard
						title="Déficit Habitacional"
						value="938"
						icon={<Home className="text-red-400" />}
						desc="Vagas Faltantes (SAMIM)"
						alert
					/>
					<KpiCard
						title="Risco de Fome"
						value={`${CENSUS_REALITY.odsScorecard.ods2.value}`}
						icon={<Utensils className="text-orange-400" />}
						desc={`Alertas Hoje: ${socialThermometer.fome}`}
					/>
					<KpiCard
						title="Crise Sanitária"
						value={`${stats.sanitationCrisis}%`}
						icon={<Droplets className="text-purple-400" />}
						desc={`Alertas Hoje: ${socialThermometer.higiene}`}
						alert
					/>
					<KpiCard
						title="Violência Estatal"
						value={`${CENSUS_REALITY.violenceSource.publicAgents}%`}
						icon={<Shield className="text-pink-400" />}
						desc={`Alertas Hoje: ${socialThermometer.violencia}`}
						alert
					/>
					<KpiCard
						title="Saúde Pop Rua"
						value="3 Equipes"
						icon={<Heart className="text-emerald-400" />}
						desc={`Alertas Hoje: ${socialThermometer.saude}`}
					/>
				</div>

				{/* NOVA SEÇÃO: Guerra dos Números - Subnotificação */}
				<div className="mb-12 bg-gradient-to-br from-purple-950/50 to-slate-900 p-8 rounded-3xl border border-purple-800/50">
					<h2 className="text-2xl font-bold mb-2 flex items-center gap-3">
						<Users className="w-6 h-6 text-purple-400" aria-hidden="true" />
						Guerra dos Números: A Escala da Invisibilidade
					</h2>
					<p className="text-slate-300 mb-8 max-w-2xl">
						O Censo oficial captura uma "fotografia" de dias específicos. A
						realidade da rua é um "filme" em movimento constante.
					</p>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						{/* Barra: Censo Oficial */}
						<div className="space-y-4">
							<div className="flex justify-between items-end">
								<span className="text-sm text-slate-300 uppercase font-bold tracking-wider">
									Censo Oficial (FEAC 2024)
								</span>
								<span className="text-3xl font-black text-blue-400">
									{CENSUS_REALITY.populationContrast.official}
								</span>
							</div>
							<div className="h-8 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
								<div
									className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-1000"
									style={{
										width: `${(CENSUS_REALITY.populationContrast.official / CENSUS_REALITY.populationContrast.estimated) * 100}%`,
									}}
								/>
							</div>
							<p className="text-xs text-slate-400">
								{CENSUS_REALITY.populationContrast.methodology}
							</p>
						</div>

						{/* Barra: Estimativa Coletivos */}
						<div className="space-y-4">
							<div className="flex justify-between items-end">
								<span className="text-sm text-slate-300 uppercase font-bold tracking-wider">
									Estimativa Coletivos
								</span>
								<span className="text-3xl font-black text-purple-400">
									~{CENSUS_REALITY.populationContrast.estimated}
								</span>
							</div>
							<div className="h-8 bg-slate-800 rounded-full overflow-hidden border-2 border-dashed border-purple-500/50">
								<div
									className="h-full bg-gradient-to-r from-purple-600 to-purple-400 rounded-full"
									style={{ width: "100%" }}
								/>
							</div>
							<p className="text-xs text-purple-400/80">
								{CENSUS_REALITY.populationContrast.limitation}
							</p>
						</div>
					</div>

					{/* Multiplicador */}
					<div className="mt-8 p-4 bg-slate-900/50 rounded-xl border border-slate-700 flex items-center justify-between">
						<div>
							<span className="text-sm text-slate-400">
								Fator de Subnotificação
							</span>
							<p className="text-4xl font-black text-white">
								{CENSUS_REALITY.populationContrast.multiplier}x
							</p>
						</div>
						<div className="text-right text-xs text-slate-400 max-w-sm">
							<p className="mb-1">
								Fontes: {CENSUS_REALITY.populationContrast.sources.join(" • ")}
							</p>
							<p className="text-yellow-400/80">
								⚠️ ~
								{CENSUS_REALITY.populationContrast.estimated -
									CENSUS_REALITY.populationContrast.official}{" "}
								pessoas invisíveis para as políticas públicas
							</p>
						</div>
					</div>
				</div>

				{/* FREAKONOMICS: Realidade Paralela Toggle */}
				<div className="mb-12">
					<HiddenDataToggle />
				</div>

				{/* DATA STORYTELLING: Infográficos de Impacto */}
				<div className="mb-12">
					<ImpactInfographics />
				</div>

				{/* Visualização da Lacuna (Supply vs Demand) */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<div className="bg-slate-900 p-6 rounded-2xl border border-slate-700">
						<h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-blue-400">
							<Home className="w-5 h-5" />O Abismo dos Números: Capacidade de
							Acolhimento
						</h2>

						{/* Gráfico de Barras: O Abismo */}
						<div className="space-y-8 mt-4">
							<div className="space-y-2">
								<div className="flex justify-between items-end">
									<span className="text-sm text-slate-400 font-bold uppercase tracking-wider">
										Demanda (1.300+)
									</span>
									<span className="text-2xl font-black text-red-500">100%</span>
								</div>
								<div className="h-6 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
									<div className="h-full bg-red-600 w-full shadow-[0_0_20px_rgba(239,68,68,0.3)]"></div>
								</div>
							</div>

							<div className="space-y-2">
								<div className="flex justify-between items-end">
									<span className="text-sm text-slate-400 font-bold uppercase tracking-wider">
										Oferta (362 Vagas)
									</span>
									<span className="text-2xl font-black text-emerald-500">
										27.8%
									</span>
								</div>
								<div className="h-6 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
									<div className="h-full bg-emerald-500 w-[27.8%] shadow-[0_0_20px_rgba(16,185,129,0.3)]"></div>
								</div>
								<p className="text-right text-red-500 font-black text-lg uppercase tracking-tighter mt-2">
									Déficit de 938 Prontuários sem Teto
								</p>
							</div>
						</div>
					</div>

					{/* Insight Qualitativo */}
					<div className="bg-slate-900 p-6 rounded-2xl border border-slate-700">
						<h2 className="text-xl font-bold mb-4">Análise de Inteligência</h2>
						{/* Texto clareado de slate-300 para slate-200 */}
						<ul className="space-y-4 text-sm text-slate-200">
							<li className="flex gap-3">
								<span className="text-purple-400 font-bold">
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

				{/* TERMÔMETRO SOCIAL: Alertas Críticos (Solicitado: Prompt 3) */}
				<div className="mb-12">
					<h2 className="text-xl font-bold mb-6 flex items-center gap-2">
						<AlertTriangle className="w-5 h-5 text-red-500 animate-pulse" />
						Termômetro Social: O que a rua está dizendo hoje?
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<ThermometerCard
							label="Fome / Segurança Alimentar"
							count={socialThermometer.fome}
							trend={socialThermometer.fome > 5 ? "up" : "stable"}
						/>
						<ThermometerCard
							label="Crise Sanitária / Higiene"
							count={socialThermometer.higiene}
							trend={socialThermometer.higiene > 5 ? "up" : "stable"}
						/>
						<ThermometerCard
							label="Violência Institucional"
							count={socialThermometer.violencia}
							trend={socialThermometer.violencia > 5 ? "up" : "stable"}
						/>
					</div>
				</div>

				{/* SEÇÃO NOVA: Auditoria Sociotécnica (Solicitada pelo Censo 2024) */}
				<div className="mt-12 border-t border-slate-800 pt-12">
					<h2 className="text-3xl font-bold mb-2 flex items-center gap-3">
						<span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />A
						Realidade Invisível
					</h2>
					{/* Texto clareado */}
					<p className="text-slate-200 mb-8 max-w-3xl">
						Auditoria cruzada: Dados oficiais do Censo Pop Rua 2024 vs. Mitos
						Sociais. A tecnologia e a violência institucional operam como
						barreiras invisíveis.
					</p>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{/* CARD 1: Exclusão Digital */}
						{/* Removido transparência bg-slate-900/50 -> bg-slate-900 */}
						<div className="bg-slate-900 p-6 rounded-2xl border border-red-900/50 ring-1 ring-red-900/20">
							<h3 className="text-lg font-bold text-red-200 mb-6 flex items-center gap-2">
								<div className="p-2 bg-red-950 rounded-lg">
									<AlertTriangle className="w-4 h-4 text-red-500" />
								</div>
								Barreira Digital (Acesso Negado)
							</h3>

							<div className="space-y-6">
								<div className="relative pt-2">
									<div className="flex justify-between text-xs uppercase tracking-widest font-bold mb-2">
										{/* slate-300 -> slate-200 */}
										<span className="text-slate-200">Sem Celular</span>
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
										{/* slate-300 -> slate-200 */}
										<span className="text-slate-200">Tem Celular, Sem Dados</span>
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
						<div className="bg-slate-900 p-6 rounded-2xl border border-slate-700">
							<h3 className="text-lg font-bold text-slate-200 mb-6 flex items-center gap-2">
								<div className="p-2 bg-slate-800 rounded-lg">
									<Shield className="w-4 h-4 text-blue-400" />
								</div>
								Quem agride na rua?
							</h3>

							<div className="flex items-end justify-center gap-4 h-[140px] mb-4">
								<div className="w-full flex flex-col items-center gap-2 group">
									<span className="text-2xl font-black text-red-400">
										{CENSUS_REALITY.violenceSource.publicAgents}%
									</span>
									<div
										className="w-full bg-red-900/50 border border-red-500 rounded-t-lg transition-all group-hover:bg-red-900/80"
										style={{
											height: `${CENSUS_REALITY.violenceSource.publicAgents}%`,
										}}
									/>
									<span className="text-[10px] uppercase font-bold text-center text-slate-300">
										Agentes do Estado
										<br />
										(PM, GM)
									</span>
								</div>

								<div className="w-full flex flex-col items-center gap-2 group">
									<span className="text-2xl font-black text-slate-400">
										{CENSUS_REALITY.violenceSource.civilians}%
									</span>
									<div
										className="w-full bg-slate-800 border border-slate-600 rounded-t-lg transition-all group-hover:bg-slate-700"
										style={{
											height: `${CENSUS_REALITY.violenceSource.civilians}%`,
										}}
									/>
									<span className="text-[10px] uppercase font-bold text-center text-slate-300">
										Sociedade Civil
									</span>
								</div>
							</div>
							{/* slate-500 -> slate-300 */}
							<p className="text-xs text-slate-300 mt-4 text-center">
								ODS 16 Violado: A instituição que deveria proteger é a principal
								autora da violência.
							</p>
						</div>

						{/* CARD 3: Causa Raiz (Mito vs Realidade) */}
						<div className="bg-slate-900 p-6 rounded-2xl border border-slate-700">
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
										{/* slate-400 -> slate-300 */}
										<span className="text-sm font-bold text-slate-300">
											Álcool/Drogas
										</span>
										<span className="text-xl font-black text-slate-300">
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

								<div className="text-xs text-slate-300 italic bg-purple-900/20 p-3 rounded-lg border border-purple-500/20">
									"Aporofobia se baseia no mito do vício. A realidade é o
									rompimento de vínculos."
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* ODS Explainer - Contexto Global */}
				<div className="mt-12">
					<ODSExplainer />
				</div>
			</div>
		</main>
	);
}

// ATUALIZAÇÃO 1: Cores de texto mais claras (slate-200) e bg sólido (bg-slate-900)
// ATUALIZAÇÃO 2: Bordas mais visíveis (border-slate-700)
function KpiCard({
	title,
	value,
	icon,
	desc,
	alert = false,
}: {
	title: string;
	value: string;
	icon: React.ReactNode;
	desc: string;
	alert?: boolean;
}) {
	return (
		<div
			className={`p-6 rounded-xl border ${alert ? "bg-red-950/40 border-red-500/50" : "bg-slate-900 border-slate-700"}`}
		>
			<div className="flex items-center justify-between mb-4">
				<div>
					{/* slate-200 e uppercasetracking-wider */}
					<h3 className="text-slate-200 text-sm font-semibold uppercase tracking-wider">
						{title}
					</h3>
					<p className="text-4xl font-bold mt-2 text-white drop-shadow-md">
						{value}
					</p>
				</div>
				<div className="p-3 bg-slate-800 border border-slate-600 rounded-full" aria-hidden="true">
					{icon}
				</div>
			</div>
			<div className="mt-4">
				{/* slate-300 */}
				<p className="text-slate-300 text-sm font-medium">{desc}</p>
			</div>
		</div>
	);
}

function ThermometerCard({
	label,
	count,
	trend,
}: {
	label: string;
	count: number;
	trend: "up" | "stable";
}) {
	return (
		// bg-slate-900 border-slate-700
		<div className="bg-slate-900 border border-slate-700 p-4 rounded-xl flex items-center justify-between hover:border-red-500/30 transition-colors">
			<div>
				{/* slate-300 */}
				<h4 className="text-slate-200 font-bold text-sm">{label}</h4>
				{/* slate-500 -> slate-300 */}
				<span className="text-xs text-slate-300">Relatos confirmados</span>
			</div>
			<div className="text-right">
				<span className="text-2xl font-black text-white block">{count}</span>
				{trend === "up" && (
					<span className="text-[10px] text-red-400 font-bold uppercase">
						↑ Subindo
					</span>
				)}
			</div>
		</div>
	);
}
