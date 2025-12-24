"use client";

import {
	AlertTriangle,
	BarChart3,
	Globe,
	HelpCircle,
	Info,
	MapPin,
	MessageSquareCode,
	Shield,
	TrendingUp,
} from "lucide-react";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import {
	BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid,
	PieChart, Pie, Cell, Legend
} from "recharts";

import { type TelemetryEvent, telemetryService } from "@/services/telemetry";
import { InequalityChart } from "./InequalityChart";
import { MaslowComparison } from "./MaslowComparison";
import { ODSExplainer } from "./ODSExplainer";

// --- MOCK DATA FOR VISUALIZATION (To be replaced by real telemetry agg) ---

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

const BARRIERS_DATA = [
	{ name: "Não Aceita Cachorro", value: 40, color: "#ef4444" }, // Red
	{ name: "Não Aceita Carrinho", value: 30, color: "#f97316" }, // Orange
	{ name: "Exige Documento", value: 20, color: "#eab308" }, // Yellow
	{ name: "Lotação / Fila", value: 10, color: "#3b82f6" }, // Blue
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
								<TrendingUp size={20} className="text-blue-500" /> Inteligência de Dados para ODS
							</div>
						</div>
					</div>
				</div>

				<div className="flex flex-col items-end gap-3">
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
						<span className="text-emerald-500 animate-pulse">COLETANDO EM TEMPO REAL</span>
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
								são omitidos. Aplicamos <strong>Time Jitter</strong> de 2 horas para impedir o
								rastreamento em tempo real.
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
							Cruzamento: <span className="text-white font-bold">Horário da Busca</span> vs. <span className="text-white font-bold">Serviços Abertos</span>.
							Evidencia a lacuna de atendimento noturno (Jantar).
						</p>
					</div>
					<div className="h-[300px] w-full mt-auto">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart data={HUNGER_TIME_DATA}>
								<CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
								<XAxis dataKey="hour" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
								<YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
								<RechartsTooltip
									contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
									cursor={{ fill: '#1e293b', opacity: 0.4 }}
								/>
								<Bar dataKey="requests" name="Buscas por Comida" fill="#ef4444" radius={[4, 4, 0, 0]}>
									{
										HUNGER_TIME_DATA.map((entry, index) => (
											<Cell key={`cell-${index}`} fill={entry.serviceOpen ? "#3b82f6" : "#ef4444"} />
										))
									}
								</Bar>
							</BarChart>
						</ResponsiveContainer>
					</div>
					<div className="mt-4 flex gap-4 text-xs font-bold uppercase tracking-wider justify-center">
						<div className="flex items-center gap-2">
							<div className="w-3 h-3 bg-blue-500 rounded-sm" /> Serviço Aberto
						</div>
						<div className="flex items-center gap-2">
							<div className="w-3 h-3 bg-red-500 rounded-sm" /> Serviço Fechado (Lacuna)
						</div>
					</div>
				</section>

				{/* Graph 2: Barreiras de Acesso */}
				<section className="bg-[#0c0c0f] border border-slate-800 p-8 rounded-3xl shadow-xl flex flex-col">
					<div className="mb-6">
						<h3 className="text-2xl font-black text-white flex items-center gap-3 uppercase italic tracking-tight">
							<Shield className="text-orange-500" /> Barreiras de Acesso (ODS 1.4)
						</h3>
						<p className="text-slate-400 text-sm mt-2">
							Motivos de desistência ao tentar acessar um serviço público (Abrigo/Restaurante).
						</p>
					</div>
					<div className="h-[300px] w-full flex items-center justify-center">
						<ResponsiveContainer width="100%" height="100%">
							<PieChart>
								<Pie
									data={BARRIERS_DATA}
									cx="50%"
									cy="50%"
									innerRadius={60}
									outerRadius={100}
									paddingAngle={5}
									dataKey="value"
								>
									{BARRIERS_DATA.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
									))}
								</Pie>
								<RechartsTooltip
									contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
								/>
								<Legend
									verticalAlign="bottom"
									height={36}
									iconType="circle"
									layout="horizontal"
									wrapperStyle={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', color: '#94a3b8' }}
								/>
							</PieChart>
						</ResponsiveContainer>
					</div>
				</section>
			</div>

			{/* Área Maslow e ODS (Espaçamento Ajustado) */}
			<div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8">
				{/* Coluna da Esquerda: Análise de Desigualdade (Novo) */}
				<div className="space-y-8">
					<InequalityChart data={realData} />
					<ODSExplainer />
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
							"Cada pessoa que encontra o Consultório na Rua via app evita, em média, uma internação de emergência de alta complexidade."
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

