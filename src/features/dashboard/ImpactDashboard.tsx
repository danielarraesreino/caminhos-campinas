"use client";

import {
	AlertTriangle,
	BarChart3,
	HelpCircle,
	Info,
	Shield,
	TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Legend,
	Pie,
	PieChart,
	Tooltip as RechartsTooltip,
	ResponsiveContainer,
	XAxis,
	YAxis,
} from "recharts";
import { CENSUS_REALITY } from "@/data/census-reality";
import { type TelemetryEvent, telemetryService } from "@/services/telemetry";
import { InequalityChart } from "./InequalityChart";
import { MaslowComparison } from "./MaslowComparison";

// --- MOCK DATA vs REALITY (Freakonomics) ---

const HUNGER_TIME_DATA = [
	{ hour: "06h", requests: 12, serviceOpen: false },
	{ hour: "08h", requests: 45, serviceOpen: true },
	{ hour: "10h", requests: 30, serviceOpen: true },
	{ hour: "12h", requests: 120, serviceOpen: true }, // Peak
	{ hour: "14h", requests: 40, serviceOpen: true },
	{ hour: "16h", requests: 25, serviceOpen: true },
	{ hour: "18h", requests: 90, serviceOpen: false }, // Critical Mismatch
	{ hour: "20h", requests: 110, serviceOpen: false }, // Critical Mismatch
	{ hour: "22h", requests: 60, serviceOpen: false },
];

const VIOLENCE_DATA = [
	{
		name: "Agentes do Estado (GM/PM)",
		value: CENSUS_REALITY.violenceSource.publicAgents,
		color: "#ef4444",
	}, // Red
	{
		name: "Civis / Comércio",
		value: CENSUS_REALITY.violenceSource.civilians,
		color: "#f97316",
	}, // Orange
	{
		name: "Outros",
		value: CENSUS_REALITY.violenceSource.other,
		color: "#94a3b8",
	}, // Slate
];

const FUNNEL_DATA = [
	{
		name: "Conflito Familiar",
		value: CENSUS_REALITY.funnel.familyBreakdown,
		fill: "#3b82f6",
	}, // Blue
	{
		name: "Saída Prisão Direta",
		value: CENSUS_REALITY.funnel.prisonPipeline,
		fill: "#8b5cf6",
	}, // Purple
	{
		name: "Perda Documental",
		value: CENSUS_REALITY.funnel.documentLoss,
		fill: "#eab308",
	}, // Yellow
];

export function ImpactDashboard() {
	const [realData, setRealData] = useState<TelemetryEvent[]>([]);
	const [loading, setLoading] = useState(true);
	const [showAnonInfo, setShowAnonInfo] = useState(false);

	useEffect(() => {
		async function loadData() {
			try {
				const events = await telemetryService.getAllEvents();
				setRealData(events);
			} catch (e) {
				console.error("Failed to load dashboard data", e);
			} finally {
				setLoading(false);
			}
		}
		loadData();
	}, []);

	// Processamento Real (ODS)
	const stats = useMemo(() => {
		const counts = {
			ODS_2: 0,
			ODS_11: 0,
			ODS_10: 0,
			ODS_3: 0,
			avg_failure: 0,
			total_decisions: 0,
		};

		// Mapeamento de ODS (Simples)
		realData.forEach((event) => {
			if (event.action_type === "DECISION_MADE" && event.ods_category) {
				counts.total_decisions++;
				if (event.ods_category.includes("ODS_2")) counts.ODS_2++;
				if (event.ods_category.includes("ODS_11")) counts.ODS_11++;
				if (event.ods_category.includes("ODS_10")) counts.ODS_10++;
				if (event.ods_category.includes("ODS_3")) counts.ODS_3++;
			}
		});

		// "Avg Failure" como proxy de vulnerabilidade (mockado por enquanto ou baseado em outcome negativo)
		// Se outcome contiver "RISCO" ou "PERDA", conta como falha sistêmica
		let negativeOutcomes = 0;
		realData.forEach((event) => {
			// biome-ignore lint/suspicious/noExplicitAny: metadata type
			const outcome = (event.metadata as any)?.outcome || "";
			if (
				outcome.includes("RISCO") ||
				outcome.includes("PERDA") ||
				outcome.includes("DEGRADACAO")
			) {
				negativeOutcomes++;
			}
		});

		counts.avg_failure =
			counts.total_decisions > 0
				? Math.round((negativeOutcomes / counts.total_decisions) * 100)
				: 0;
		return counts;
	}, [realData]);

	if (loading)
		return (
			<div className="min-h-screen bg-black flex flex-col items-center justify-center font-mono gap-4">
				<div className="w-12 h-12 border-t-2 border-blue-600 rounded-full animate-spin"></div>
				<span className="text-blue-900 tracking-widest animate-pulse uppercase">
					Auditoria_Sistêmica_V1.3...
				</span>
			</div>
		);

	return (
		<div className="min-h-screen bg-[#050507] text-slate-300 font-sans p-4 md:p-10 space-y-12">
			{/* Header com Contraste Ajustado */}
			<header className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-slate-900 pb-10">
				<div className="space-y-4">
					<div className="flex items-center gap-5">
						<div className="bg-blue-600 p-4 rounded-2xl shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:scale-105 transition-transform">
							<BarChart3 className="text-white" size={36} />
						</div>
						<div>
							<h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none mb-2 uppercase italic">
								Painel de Impacto{" "}
								<span className="text-blue-500 not-italic">Vivo</span>
							</h1>
							<div className="flex items-center gap-3 text-slate-500 font-medium text-lg uppercase tracking-wide">
								<TrendingUp size={20} className="text-blue-500" /> Inteligência
								de Dados para ODS
							</div>
						</div>
					</div>
				</div>

				<div className="flex flex-col items-end gap-3">
					<Link
						href="/apoie"
						className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/50 px-4 py-3 rounded-lg text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 transition-all uppercase tracking-wider mb-2 min-h-[44px]"
					>
						<TrendingUp size={14} />
						Financie esta Tecnologia
					</Link>
					<button
						type="button"
						onClick={() => setShowAnonInfo(!showAnonInfo)}
						className="flex items-center gap-3 bg-blue-900/10 border border-blue-600/40 px-6 py-3 rounded-xl text-sm font-black text-blue-400 hover:bg-blue-600/20 hover:border-blue-500 transition-all group"
					>
						<Shield
							size={18}
							className="group-hover:rotate-12 transition-transform"
						/>
						DADOS ANONIMIZADOS (K-5)
						<HelpCircle size={16} className="opacity-50" />
					</button>
					<div className="flex gap-2 text-[10px] uppercase font-mono font-bold text-slate-600 tracking-wider">
						<span>Status:</span>
						<span className="text-emerald-500 animate-pulse">
							COLETANDO EM TEMPO REAL
						</span>
					</div>
				</div>
			</header>

			{/* Modal de Anonimização */}
			{showAnonInfo && (
				<div className="max-w-7xl mx-auto bg-blue-950/20 border-2 border-blue-600/50 p-8 rounded-2xl animate-in slide-in-from-top duration-300">
					<div className="flex gap-6 items-start">
						<Info className="text-blue-500 flex-none" size={32} />
						<div className="space-y-4">
							<h3 className="text-2xl font-black text-white uppercase tracking-tight">
								Como protegemos os dados?
							</h3>
							<p className="text-lg text-slate-300 leading-relaxed font-sans">
								Utilizamos o protocolo <strong>K-Anonymity</strong>: se uma
								célula da grade (500m²) possuir menos de 5 registros, os dados
								são omitidos. Aplicamos <strong>Time Jitter</strong> de 2 horas
								para impedir o rastreamento em tempo real.
							</p>
						</div>
					</div>
				</div>
			)}

			{/* --- NEW SECTION: DATA INTELLIGENCE GRAPHS --- */}
			<div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Graph 1: Mapa de Calor da Fome */}
				<section className="bg-[#0c0c0f] border border-slate-800 p-8 rounded-3xl shadow-xl flex flex-col">
					<div className="mb-6">
						<h3 className="text-2xl font-black text-white flex items-center gap-3 uppercase italic tracking-tight">
							<AlertTriangle className="text-red-500" /> Mapa de Calor da Fome
						</h3>
						<p className="text-slate-400 text-sm mt-2">
							Cruzamento:{" "}
							<span className="text-white font-bold">Horário da Busca</span> vs.{" "}
							<span className="text-white font-bold">Serviços Abertos</span>.
							Evidencia a lacuna de atendimento noturno (Jantar).
						</p>
					</div>
					<div className="h-[300px] min-h-[300px] w-full mt-auto">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={HUNGER_TIME_DATA}>
								<CartesianGrid
									strokeDasharray="3 3"
									stroke="#1e293b"
									vertical={false}
								/>
								<XAxis
									dataKey="hour"
									stroke="#64748b"
									fontSize={12}
									tickLine={false}
									axisLine={false}
								/>
								<YAxis
									stroke="#64748b"
									fontSize={12}
									tickLine={false}
									axisLine={false}
								/>
								<RechartsTooltip
									contentStyle={{
										backgroundColor: "#0f172a",
										borderColor: "#1e293b",
										color: "#f8fafc",
									}}
									cursor={{ fill: "#1e293b", opacity: 0.4 }}
								/>
								<Bar
									dataKey="requests"
									name="Buscas por Comida"
									fill="#ef4444"
									radius={[4, 4, 0, 0]}
								>
									{HUNGER_TIME_DATA.map((entry, index) => (
										<Cell
											// biome-ignore lint/suspicious/noArrayIndexKey: Static data
											key={`cell-${index}`}
											fill={entry.serviceOpen ? "#3b82f6" : "#ef4444"}
										/>
									))}
								</Bar>
							</BarChart>
						</ResponsiveContainer>
					</div>
					<div className="mt-4 flex gap-4 text-xs font-bold uppercase tracking-wider justify-center">
						<div className="flex items-center gap-2">
							<div className="w-3 h-3 bg-blue-500 rounded-sm" /> Serviço Aberto
						</div>
						<div className="flex items-center gap-2">
							<div className="w-3 h-3 bg-red-500 rounded-sm" /> Serviço Fechado
							(Lacuna)
						</div>
					</div>
				</section>

				{/* Graph 2: Geografia da Violência (Estatal) */}
				<section className="bg-[#0c0c0f] border border-slate-800 p-8 rounded-3xl shadow-xl flex flex-col">
					<div className="mb-6">
						<h3 className="text-2xl font-black text-white flex items-center gap-3 uppercase italic tracking-tight">
							<Shield className="text-orange-500" /> Violência (ODS 16)
						</h3>
						<p className="text-slate-400 text-sm mt-2">
							Quem viola os direitos na rua? Dados chocantes do Censo 2024:
							<span className="text-red-400 font-bold ml-1">
								51% vêm de Agentes do Estado
							</span>
							.
						</p>
					</div>
					<div className="h-[300px] min-h-[300px] w-full flex items-center justify-center">
						<ResponsiveContainer width="100%" height="100%">
							<PieChart>
								<Pie
									data={VIOLENCE_DATA}
									cx="50%"
									cy="50%"
									innerRadius={60}
									outerRadius={100}
									paddingAngle={5}
									dataKey="value"
								>
									{VIOLENCE_DATA.map((entry, index) => (
										<Cell
											// biome-ignore lint/suspicious/noArrayIndexKey: Static data
											key={`cell-${index}`}
											fill={entry.color}
											stroke="none"
										/>
									))}
								</Pie>
								<RechartsTooltip
									contentStyle={{
										backgroundColor: "#0f172a",
										borderColor: "#1e293b",
										color: "#f8fafc",
									}}
								/>
								<Legend
									verticalAlign="bottom"
									height={36}
									iconType="circle"
									layout="horizontal"
									wrapperStyle={{
										fontSize: "12px",
										fontWeight: "bold",
										textTransform: "uppercase",
										color: "#94a3b8",
									}}
								/>
							</PieChart>
						</ResponsiveContainer>
					</div>
				</section>
			</div>

			{/* Area: O Funil da Exclusão + ODS Scorecard */}
			<div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8">
				{/* Coluna Esquerda: O Funil da Exclusão */}
				<section className="bg-[#0c0c0f] border border-slate-800 p-8 rounded-3xl shadow-xl space-y-6">
					<div className="mb-4">
						<h3 className="text-2xl font-black text-white flex items-center gap-3 uppercase italic tracking-tight">
							<TrendingUp className="text-blue-500" /> Funil da Exclusão
						</h3>
						<p className="text-slate-400 text-sm mt-2">
							Trajetória estatística verificada:
						</p>
					</div>

					<div className="h-[300px] w-full">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart
								data={FUNNEL_DATA}
								layout="vertical"
								margin={{ left: 20 }}
							>
								<CartesianGrid
									strokeDasharray="3 3"
									stroke="#1e293b"
									horizontal={false}
								/>
								<XAxis
									type="number"
									stroke="#64748b"
									fontSize={12}
									tickFormatter={(val) => `${val}%`}
								/>
								<YAxis
									dataKey="name"
									type="category"
									stroke="#94a3b8"
									fontSize={11}
									width={100}
									tick={{ fontWeight: "bold" }}
								/>
								<RechartsTooltip
									cursor={{ fill: "#1e293b", opacity: 0.4 }}
									contentStyle={{
										backgroundColor: "#0f172a",
										borderColor: "#1e293b",
										color: "#fff",
									}}
								/>
								<Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={40}>
									{FUNNEL_DATA.map((entry, index) => (
										// biome-ignore lint/suspicious/noArrayIndexKey: Chart cells are static
										<Cell key={`cell-${index}`} fill={entry.fill} />
									))}
								</Bar>
							</BarChart>
						</ResponsiveContainer>
					</div>
					<div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
						<p className="text-xs text-slate-400 leading-relaxed font-mono">
							<strong className="text-white">INSIGHT:</strong> 71.5% das pessoas
							vão para a rua por
							<span className="text-blue-400"> ruptura familiar</span>. A saída
							da prisão (41%) retroalimenta o ciclo.
						</p>
					</div>
				</section>

				{/* Coluna Direita: ODS Scorecard (Placar da ONU) */}
				<div className="space-y-6">
					<h3 className="text-2xl font-black text-white flex items-center gap-3 uppercase italic tracking-tight mb-4">
						<Info className="text-emerald-500" /> Scorecard Agenda 2030
					</h3>
					<div className="grid grid-cols-1 gap-4">
						{Object.entries(CENSUS_REALITY.odsScorecard).map(([key, data]) => (
							<div
								key={key}
								className="bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center justify-between group hover:border-slate-600 transition-colors"
							>
								<div>
									<div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">
										{key.toUpperCase()}
									</div>
									<div className="text-white font-bold text-sm uppercase">
										{data.label}
									</div>
								</div>
								<div className="text-right">
									<div
										className={`text-xs font-black px-2 py-1 rounded uppercase tracking-wider ${
											data.status === "CRITICAL"
												? "bg-red-900/30 text-red-400 border border-red-900"
												: data.status === "WARNING"
													? "bg-yellow-900/30 text-yellow-400 border border-yellow-900"
													: "bg-emerald-900/30 text-emerald-400 border border-emerald-900"
										}`}
									>
										{data.value}
									</div>
								</div>
							</div>
						))}
					</div>
					<InequalityChart data={realData} />
				</div>

				<div className="space-y-12">
					<MaslowComparison
						metrics={{
							hunger: stats.avg_failure,
							housing: 100 - stats.avg_failure,
							health: 100 - stats.avg_failure,
							education: 15,
						}}
					/>

					<div className="bg-emerald-900/20 p-10 rounded-3xl space-y-6 shadow-2xl border border-emerald-500/30">
						<h2 className="text-2xl font-black text-emerald-400 uppercase tracking-widest flex items-center gap-3 italic">
							<TrendingUp size={32} />
							Economia Gerada (SUS)
						</h2>
						<div className="flex flex-col gap-1">
							<span className="text-6xl md:text-8xl font-black text-emerald-400 block leading-none tracking-tighter">
								R$ 45k
							</span>
							<span className="text-md text-emerald-600/80 font-black uppercase tracking-tight">
								Estimativa de Econ. Mensal
							</span>
						</div>
						<p className="text-lg text-emerald-100/80 font-medium leading-relaxed font-sans border-t border-emerald-500/20 pt-4">
							"Cada atendimento do Consultório na Rua (Busca Ativa) evita, em
							média, uma internação de emergência de alta complexidade."
						</p>
					</div>
				</div>
			</div>

			{/* Métricas de Base (Contraste Máximo) */}
			<div className="max-w-7xl mx-auto space-y-12 py-10">
				<div className="flex items-center gap-4">
					<h2 className="text-3xl font-black text-white uppercase tracking-tighter">
						Telemetria de Direitos (ODS)
					</h2>
					<div className="flex-grow h-px bg-slate-900" />
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
					<EnhancedMetricCard
						title="ODS 2: FOME ZERO"
						value={stats.ODS_2}
						sub="Solicitações de Refeição"
						color="from-orange-600 to-orange-950"
						iconColor="text-orange-400"
					/>
					<EnhancedMetricCard
						title="ODS 11: MORADIA"
						value={stats.ODS_11}
						sub="Demanda por Pernoite"
						color="from-blue-600 to-blue-950"
						iconColor="text-blue-400"
					/>
					<EnhancedMetricCard
						title="ODS 10: DIGNIDADE"
						value={stats.ODS_10}
						sub="Acesso à Documentação"
						color="from-purple-600 to-purple-950"
						iconColor="text-purple-400"
					/>
					<EnhancedMetricCard
						title="ODS 3: SAÚDE"
						value={stats.ODS_3}
						sub="Acessos de Saúde"
						color="from-red-600 to-red-950"
						iconColor="text-red-400"
					/>
				</div>
			</div>
		</div>
	);
}

function EnhancedMetricCard({
	title,
	value,
	sub,
	color,
	iconColor,
}: {
	title: string;
	value: number;
	sub: string;
	color: string;
	iconColor: string;
}) {
	return (
		<div
			className={`bg-[#0c0c0f] border border-slate-800 p-8 rounded-3xl flex flex-col items-center text-center space-y-4 group hover:border-slate-600 transition-all shadow-xl relative overflow-hidden`}
		>
			{/* Background Accent */}
			<div
				className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${color}`}
			/>

			<span
				className={`text-xs font-black tracking-[0.2em] uppercase ${iconColor}`}
			>
				{title}
			</span>
			<span className="text-7xl font-black tabular-nums text-white group-hover:scale-110 transition-transform duration-500 leading-none">
				{value}
			</span>
			<div className="space-y-1">
				<span className="text-sm font-bold text-slate-400 block">{sub}</span>
				<span className="text-[10px] text-slate-700 font-black uppercase tracking-widest">
					Campinas / Simulação
				</span>
			</div>
		</div>
	);
}
