"use client";

import { ArrowLeft, Download, Heart, Users, Wallet } from "lucide-react";
import Link from "next/link";
import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

const MOCK_FINANCIAL_DATA = [
	{ name: "Out", liquid: 50, expenses: 150 },
	{ name: "Nov", liquid: 120, expenses: 150 },
	{ name: "Dez", liquid: 200, expenses: 150 },
];

const MOCK_IMPACT_DATA = [
	{
		id: 1,
		title: "Pessoas Orientadas",
		value: "1,240",
		icon: Users,
		description: "Encaminhadas para Bom Prato e Abrigos este mês",
	},
	{
		id: 2,
		title: "Economia Gerada",
		value: "R$ 45k",
		icon: Wallet,
		description: "Estimativa de economia para o SUS via prevenção",
	},
	{
		id: 3,
		title: "Refeições Mapeadas",
		value: "85",
		icon: Heart,
		description: "Pontos de alimentação gratuita verificados",
	},
];

export default function TransparenciaPage() {
	return (
		<main className="min-h-screen bg-slate-950 text-slate-100 font-sans">
			{/* Header */}
			<header className="fixed top-0 w-full z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
				<div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
					<Link
						href="/"
						className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
					>
						<ArrowLeft size={20} />
						<span>Voltar</span>
					</Link>
					<h1 className="font-bold text-xl tracking-tight">
						Portal da Transparência
					</h1>
					<div className="w-20" /> {/* Spacer for centering */}
				</div>
			</header>

			<div className="pt-24 pb-20 max-w-7xl mx-auto px-6 space-y-12">
				{/* Intro Section */}
				<section className="text-center max-w-3xl mx-auto space-y-4">
					<h2 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
						Confiança se constrói com dados.
					</h2>
					<p className="text-lg text-slate-400">
						Nossa missão é pública e nossos números também. Acompanhe em tempo
						real como cada centavo é investido na transformação social.
					</p>
				</section>

				{/* Financial Chart Section */}
				<section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
						<div>
							<h3 className="text-2xl font-bold text-white flex items-center gap-2">
								<Wallet className="text-emerald-400" />
								Saúde Financeira
							</h3>
							<p className="text-slate-400 text-sm mt-1">
								Custo de Servidor/Infraestrutura vs. Arrecadação (Pix)
							</p>
						</div>
						<div className="flex items-center gap-4">
							<div className="hidden md:block">
								<Link
									href="/apoie"
									className="text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-full transition-colors flex items-center gap-2"
								>
									<Heart size={12} fill="currentColor" />
									<span>Quero Financiar</span>
								</Link>
							</div>
							<div className="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700">
								<span className="text-xs text-slate-400 uppercase tracking-wider block">
									Meta Mensal
								</span>
								<span className="text-emerald-400 font-mono font-bold">
									R$ 150,00
								</span>
							</div>
						</div>
					</div>

					<div className="h-[300px] w-full">
						<ResponsiveContainer width="100%" height="100%">
							<BarChart
								data={MOCK_FINANCIAL_DATA}
								margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
							>
								<CartesianGrid
									strokeDasharray="3 3"
									stroke="#1e293b"
									vertical={false}
								/>
								<XAxis
									dataKey="name"
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
									tickFormatter={(value) => `R$${value}`}
								/>
								<Tooltip
									contentStyle={{
										backgroundColor: "#0f172a",
										borderColor: "#1e293b",
										color: "#f8fafc",
									}}
									itemStyle={{ color: "#f8fafc" }}
									formatter={(value: any) => [`R$ ${value}`, ""]}
								/>
								<Bar
									dataKey="expenses"
									name="Custo Operacional"
									fill="#ef4444"
									radius={[4, 4, 0, 0]}
									maxBarSize={50}
								/>
								<Bar
									dataKey="liquid"
									name="Arrecadação"
									fill="#10b981"
									radius={[4, 4, 0, 0]}
									maxBarSize={50}
								/>
							</BarChart>
						</ResponsiveContainer>
					</div>
				</section>

				{/* Impact Cards */}
				<section className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{MOCK_IMPACT_DATA.map((item) => (
						<div
							key={item.id}
							className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-colors"
						>
							<div className="bg-slate-800 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-blue-400">
								<item.icon size={24} />
							</div>
							<h4 className="text-3xl font-bold text-white mb-1">
								{item.value}
							</h4>
							<p className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-2">
								{item.title}
							</p>
							<p className="text-sm text-slate-500 leading-relaxed">
								{item.description}
							</p>
						</div>
					))}
				</section>

				{/* Documents Section */}
				<section className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
					<div className="space-y-2">
						<h3 className="text-xl font-bold text-white">Documentação Legal</h3>
						<p className="text-slate-400 text-sm max-w-lg">
							Acesse nosso Estatuto Social e comprove nossa formalização como
							coletivo de utilidade pública. Transparência é nossa base.
						</p>
					</div>
					<button
						type="button"
						className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold hover:bg-slate-200 transition-colors shadow-lg shadow-white/5 active:scale-95 transform"
					>
						<Download size={18} />
						Baixar Estatuto (PDF)
					</button>
				</section>

				{/* Footer Roadmap */}
				<section className="border-t border-slate-800 pt-12">
					<h3 className="text-center text-slate-500 uppercase tracking-widest text-sm font-bold mb-8">
						Roadmap de Funcionalidades
					</h3>
					<div className="flex flex-col md:flex-row justify-center items-center gap-8 text-slate-400 text-sm">
						<div className="flex items-center gap-2 opacity-50">
							<div className="w-2 h-2 rounded-full bg-emerald-500" />
							<span>Mapeamento de Abrigos (Concluído)</span>
						</div>
						<div className="flex items-center gap-2 text-white font-medium">
							<div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
							<span>Painel de Impacto (Em Progresso)</span>
						</div>
						<div className="flex items-center gap-2 opacity-50">
							<div className="w-2 h-2 rounded-full bg-slate-600" />
							<span>Integração Gov.br (Q3 2025)</span>
						</div>
					</div>
				</section>
			</div>
		</main>
	);
}
