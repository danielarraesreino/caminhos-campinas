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
	{ name: "Meta Piloto", value: 13970, label: "Necessário" },
	{ name: "Arrecadado", value: 0, label: "Atual" },
];

const MOCK_PILOT_TARGETS = [
	{
		id: 1,
		title: "Jovens Capacitados",
		value: "20",
		target: "/ 20",
		icon: Users,
		description: "Meta: Turma Piloto (16h de formação)",
	},
	{
		id: 2,
		title: "Educadores Sociais",
		value: "02",
		target: "/ 02",
		icon: Heart,
		description: "Meta: Contratação para acompanhamento",
	},
	{
		id: 3,
		title: "Previsão de Início",
		value: "Q1",
		target: "2026",
		icon: Wallet,
		description: "Condicionado à captação de recursos",
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
						Planejamento do Piloto - 2026
					</h1>
					<div className="w-20" /> {/* Spacer for centering */}
				</div>
			</header>

			<div className="pt-24 pb-20 max-w-7xl mx-auto px-6 space-y-12">
				{/* Intro Section */}
				<section className="text-center max-w-3xl mx-auto space-y-4">
					<h2 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
						Transparência desde o dia zero.
					</h2>
					<p className="text-lg text-slate-400">
						Este projeto ainda não está operando. Nossa missão agora é captar recursos para viabilizar a primeira turma piloto com 20 jovens em situação de rua.
					</p>
				</section>

				{/* Fundraising Gauge Section */}
				<section className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8">
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
						<div>
							<h3 className="text-2xl font-bold text-white flex items-center gap-2">
								<Wallet className="text-emerald-400" />
								Termômetro de Captação
							</h3>
							<p className="text-slate-400 text-sm mt-1">
								Objetivo: Financiar custeio total do Projeto Piloto
							</p>
						</div>
						<div className="bg-emerald-900/30 px-4 py-2 rounded-lg border border-emerald-800">
							<span className="text-xs text-emerald-400 uppercase tracking-wider block">
								Meta de Captação
							</span>
							<span className="text-white font-mono font-bold text-xl">
								R$ 13.970,00
							</span>
						</div>
					</div>

					<div className="relative pt-6 pb-2">
						<div className="flex mb-2 items-center justify-between">
							<div>
								<span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-emerald-600 bg-emerald-200">
									Progresso (0%)
								</span>
							</div>
							<div className="text-right">
								<span className="text-xs font-semibold inline-block text-emerald-600">
									R$ 0,00 arrecadados
								</span>
							</div>
						</div>
						<div className="overflow-hidden h-4 mb-4 text-xs flex rounded bg-slate-700">
							<div
								style={{ width: "0%" }}
								className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500"
							></div>
						</div>
						<div className="flex justify-center mt-6">
							<Link
								href="/apoie"
								className="text-sm font-bold text-slate-900 bg-emerald-400 hover:bg-emerald-300 px-8 py-3 rounded-full transition-all shadow-lg hover:shadow-emerald-500/20 transform hover:-translate-y-1"
							>
								Quero Ajudar a Bater a Meta
							</Link>
						</div>
					</div>
				</section>

				{/* Impact Targets */}
				<section className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{MOCK_PILOT_TARGETS.map((item) => (
						<div
							key={item.id}
							className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-colors relative overflow-hidden group"
						>
							<div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
								<item.icon size={64} />
							</div>
							<div className="bg-slate-800 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-blue-400 relative z-10">
								<item.icon size={24} />
							</div>
							<div className="flex items-baseline gap-2 mb-1 relative z-10">
								<h4 className="text-3xl font-bold text-white">
									{item.value}
								</h4>
								<span className="text-slate-500 font-medium">
									{item.target}
								</span>
							</div>
							<p className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-2 relative z-10">
								{item.title}
							</p>
							<p className="text-sm text-slate-500 leading-relaxed relative z-10">
								{item.description}
							</p>
						</div>
					))}
				</section>

				{/* Documents Section */}
				<section className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 opacity-60 grayscale hover:grayscale-0 transition-all cursor-not-allowed">
					<div className="space-y-2">
						<h3 className="text-xl font-bold text-white">Prestação de Contas (Em Breve)</h3>
						<p className="text-slate-400 text-sm max-w-lg">
							Assim que o projeto for iniciado, todos os comprovantes e planilhas serão publicados aqui mensalmente.
						</p>
					</div>
					<button
						type="button"
						disabled
						className="flex items-center gap-2 bg-slate-800 text-slate-500 px-6 py-3 rounded-full font-bold cursor-not-allowed border border-slate-700"
					>
						<Download size={18} />
						Aguardando Início
					</button>
				</section>
			</div>
		</main>
	);
}
