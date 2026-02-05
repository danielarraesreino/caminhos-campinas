"use client";

import { Clock, Download, FileText, Heart, Users, Wallet } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AudioReader } from "@/components/ui/AudioReader";

import FINANCIAL_DATA from "@/data/financial-goals.json";
import FINANCIAL_REPORTS from "@/data/financial-reports.json";

const ICON_MAP = {
	Users,
	Heart,
	Wallet,
};

const _MOCK_FINANCIAL_DATA = FINANCIAL_DATA.breakdown;

interface FinancialReport {
	month: string;
	expenses: { category: string; description: string; value: number }[];
	income: number;
	balance: number;
	status: string;
	pdf_url?: string | null;
}

const REPORTS_DATA = FINANCIAL_REPORTS.reports as unknown as FinancialReport[];

const MOCK_PILOT_TARGETS = FINANCIAL_DATA.pilot_targets.map((target) => ({
	...target,
	icon: ICON_MAP[target.icon as keyof typeof ICON_MAP] || Wallet,
}));

export default function TransparenciaPage() {
	return (
		<main className="min-h-screen bg-black text-white font-sans relative overflow-hidden">
			{/* Background Image */}
			<div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
				<Image
					src="/images/sobrio/impacto.png"
					alt="Fundo Transparência - Realismo Sóbrio"
					fill
					priority
					className="object-cover"
					quality={85}
				/>
				<div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/80 to-black" />
			</div>

			<div className="relative z-10 pt-24 pb-20 max-w-7xl mx-auto px-6 space-y-12">
				{/* Intro Section */}
				<section className="text-center max-w-3xl mx-auto space-y-4">
					<h2 className="text-4xl font-extrabold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
						Transparência desde o dia zero.
					</h2>
					<div className="flex flex-col items-center gap-4">
						<p className="text-lg text-slate-200 font-medium">
							Este projeto ainda não está operando. Nossa missão agora é captar
							recursos para viabilizar a primeira turma piloto com 20 jovens em
							situação de rua.
						</p>
						<AudioReader text="Transparência desde o dia zero. Este projeto ainda não está operando. Nossa missão agora é captar recursos para viabilizar a primeira turma piloto com 20 jovens em situação de rua." />
					</div>
				</section>

				{/* Fundraising Gauge Section */}
				<section className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 shadow-xl">
					<div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
						<div>
							<h3 className="text-2xl font-bold text-white flex items-center gap-2">
								<Wallet className="text-emerald-400" />
								Termômetro de Captação
							</h3>
							<p className="text-slate-300 text-sm mt-1">
								Objetivo: Financiar custeio total do Projeto Piloto
							</p>
						</div>
						<div className="bg-emerald-900/30 px-4 py-2 rounded-lg border border-emerald-800">
							<span className="text-xs text-emerald-400 uppercase tracking-wider block">
								Meta de Captação
							</span>
							<span className="text-white font-mono font-bold text-xl">
								{new Intl.NumberFormat("pt-BR", {
									style: "currency",
									currency: "BRL",
								}).format(FINANCIAL_DATA.fundraising.target)}
							</span>
						</div>
					</div>

					<div className="relative pt-6 pb-2">
						<div className="flex mb-2 items-center justify-between">
							<div>
								<span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-emerald-600 bg-emerald-200">
									Progresso (
									{Math.round(
										(FINANCIAL_DATA.fundraising.current /
											FINANCIAL_DATA.fundraising.target) *
											100,
									)}
									%)
								</span>
							</div>
							<div className="text-right">
								<span className="text-xs font-semibold inline-block text-emerald-400">
									{new Intl.NumberFormat("pt-BR", {
										style: "currency",
										currency: "BRL",
									}).format(FINANCIAL_DATA.fundraising.current)}{" "}
									arrecadados
								</span>
							</div>
						</div>
						<div className="overflow-hidden h-4 mb-4 text-xs flex rounded bg-slate-800 border border-slate-700">
							<div
								style={{
									width: `${Math.min(
										100,
										(FINANCIAL_DATA.fundraising.current /
											FINANCIAL_DATA.fundraising.target) *
											100,
									)}%`,
								}}
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
							className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 p-6 rounded-2xl hover:border-slate-600 transition-colors relative overflow-hidden group"
						>
							<div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
								<item.icon size={64} />
							</div>
							<div className="bg-slate-800 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-blue-400 relative z-10">
								<item.icon size={24} />
							</div>
							<div className="flex items-baseline gap-2 mb-1 relative z-10">
								<h4 className="text-3xl font-bold text-white">{item.value}</h4>
								<span className="text-slate-400 font-medium">
									{item.target}
								</span>
							</div>
							<p className="text-sm font-semibold text-slate-200 uppercase tracking-wide mb-2 relative z-10">
								{item.title}
							</p>
							<p className="text-slate-300 text-sm leading-relaxed relative z-10">
								{item.description}
							</p>
						</div>
					))}
				</section>

				{/* Documents Section - Prestação de Contas */}
				<section className="space-y-6">
					<div className="flex items-center gap-3 mb-6">
						<div className="bg-emerald-900/30 p-3 rounded-xl border border-emerald-800">
							<FileText className="text-emerald-400" size={24} />
						</div>
						<div>
							<h3 className="text-2xl font-bold text-white">
								Prestação de Contas
							</h3>
							<p className="text-slate-400 text-sm">
								Relatórios financeiros mensais detalhados
							</p>
						</div>
					</div>

					<div className="grid gap-4">
						{REPORTS_DATA.map((report) => (
							<div
								key={report.month}
								className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all group"
							>
								<div className="flex flex-col md:flex-row justify-between gap-6">
									{/* Header */}
									<div className="flex items-start gap-4 min-w-[200px]">
										<div className="bg-slate-800 p-3 rounded-lg">
											<span className="text-xs font-bold text-slate-400 uppercase block mb-1">
												Mês de Referência
											</span>
											<span className="text-xl font-mono font-bold text-white">
												{new Date(`${report.month}-02`).toLocaleDateString(
													"pt-BR",
													{ month: "long", year: "numeric" },
												)}
											</span>
										</div>
										<div
											className={`px-3 py-1 rounded-full text-xs font-bold border ${report.status === "Em Aberto" ? "bg-yellow-900/30 text-yellow-500 border-yellow-800" : "bg-emerald-900/30 text-emerald-500 border-emerald-800"}`}
										>
											{report.status}
										</div>
									</div>

									{/* Stats */}
									<div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4">
										<div>
											<span className="text-xs text-slate-500 uppercase block">
												Entradas
											</span>
											<span className="text-emerald-400 font-mono font-bold">
												{new Intl.NumberFormat("pt-BR", {
													style: "currency",
													currency: "BRL",
												}).format(report.income)}
											</span>
										</div>
										<div>
											<span className="text-xs text-slate-500 uppercase block">
												Saídas
											</span>
											<span className="text-red-400 font-mono font-bold">
												{new Intl.NumberFormat("pt-BR", {
													style: "currency",
													currency: "BRL",
												}).format(
													report.expenses.reduce((acc, e) => acc + e.value, 0),
												)}
											</span>
										</div>
										<div>
											<span className="text-xs text-slate-500 uppercase block">
												Balanço
											</span>
											<span
												className={`font-mono font-bold ${report.balance >= 0 ? "text-blue-400" : "text-red-400"}`}
											>
												{new Intl.NumberFormat("pt-BR", {
													style: "currency",
													currency: "BRL",
												}).format(report.balance)}
											</span>
										</div>
									</div>

									{/* Action */}
									<div className="flex items-center">
										{report.pdf_url ? (
											<a
												href={report.pdf_url}
												target="_blank"
												rel="noreferrer"
												className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-medium transition-colors border border-slate-700 hover:border-slate-600"
											>
												<Download size={16} />
												Baixar PDF
											</a>
										) : (
											<button
												type="button"
												disabled
												className="flex items-center gap-2 text-slate-500 cursor-not-allowed px-4 py-2"
											>
												<Clock size={16} />
												Processando
											</button>
										)}
									</div>
								</div>

								{/* Expenses Breakdown (if any) */}
								{report.expenses.length > 0 && (
									<div className="mt-6 pt-6 border-t border-slate-800/50">
										<h4 className="text-sm font-bold text-slate-400 mb-3 uppercase tracking-wider">
											Detalhamento de Despesas
										</h4>
										<div className="space-y-2">
											{report.expenses.map((expense, idx) => (
												<div
													// biome-ignore lint/suspicious/noArrayIndexKey: Static mock data
													key={idx}
													className="flex justify-between items-center text-sm p-2 hover:bg-slate-800/30 rounded transition-colors"
												>
													<div className="flex items-center gap-3">
														<span className="text-slate-300">
															{expense.description}
														</span>
														<span className="text-xs text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
															{expense.category}
														</span>
													</div>
													<span className="font-mono text-slate-200">
														{new Intl.NumberFormat("pt-BR", {
															style: "currency",
															currency: "BRL",
														}).format(expense.value)}
													</span>
												</div>
											))}
										</div>
									</div>
								)}
							</div>
						))}
					</div>
				</section>
			</div>
		</main>
	);
}
