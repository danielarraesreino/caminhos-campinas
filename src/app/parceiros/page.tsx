"use client";

import {
	ArrowLeft,
	CheckCircle2,
	Globe,
	ShieldCheck,
	TrendingUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ParceirosPage() {
	return (
		<main className="min-h-screen bg-black text-white font-sans selection:bg-blue-900 selection:text-white relative overflow-hidden">
			{/* Background Image */}
			<div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
				<Image
					src="/images/sobrio/landing.png"
					alt="Fundo Parceiros - Realismo Sóbrio"
					fill
					priority
					className="object-cover"
					quality={85}
				/>
				<div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black" />
			</div>

			<div className="relative z-10">
				{/* Header */}
				<header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-slate-800">
					<div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
						<Link
							href="/"
							className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors font-medium"
						>
							<ArrowLeft size={20} />
							<span>Voltar</span>
						</Link>
						<div className="flex items-center gap-2">
							<span className="font-bold text-xl tracking-tight text-white">
								Caminhos Campinas
							</span>
							<span className="bg-blue-900/50 text-blue-300 border border-blue-500/30 text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wider">
								Corporate
							</span>
						</div>
						<a
							href="mailto:contato@caminhoscampinas.org"
							className="text-sm font-semibold text-blue-400 hover:text-blue-300 hover:underline"
						>
							Fale com a Diretoria
						</a>
					</div>
				</header>

				<div className="pt-32 pb-20 max-w-7xl mx-auto px-6">
					{/* Hero Section */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
						<div className="space-y-6">
							<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-slate-300 text-sm font-medium">
								<ShieldCheck size={14} className="text-emerald-500" />
								<span>Conformidade ESG & Compliance</span>
							</div>
							<h1 className="text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
								Transforme responsabilidade social em{" "}
								<span className="text-blue-500">dados auditáveis.</span>
							</h1>
							<p className="text-lg text-slate-300 leading-relaxed max-w-lg">
								Sua empresa precisa reportar contribuições para os ODS
								(Objetivos de Desenvolvimento Sustentável)? Nós geramos métricas
								reais de impacto para os ODS 1, 2 e 11.
							</p>
							<div className="flex flex-col sm:flex-row gap-4 pt-4">
								<Link
									href="mailto:contato@caminhoscampinas.org"
									className="w-full sm:w-auto"
								>
									<button
										type="button"
										className="bg-blue-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/40 active:scale-95 w-full"
									>
										Quero ser Parceiro
									</button>
								</Link>
								<Link href="/impacto" className="w-full sm:w-auto">
									<button
										type="button"
										className="bg-slate-900 text-white border border-slate-700 px-8 py-4 rounded-lg font-bold hover:bg-slate-800 transition-all active:scale-95 w-full flex items-center justify-center gap-2"
									>
										<TrendingUp size={18} />
										Ver Dados Reais
									</button>
								</Link>
							</div>
						</div>
						<div className="bg-slate-900/60 rounded-2xl p-8 border border-slate-800 shadow-xl relative overflow-hidden group backdrop-blur-sm">
							<div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50 group-hover:opacity-75 transition-opacity" />
							<div className="relative z-10 grid grid-cols-2 gap-4">
								<div className="bg-slate-950 p-6 rounded-xl shadow-lg border border-slate-800">
									<TrendingUp className="text-blue-500 mb-3" size={32} />
									<div className="text-4xl font-bold text-white mb-1">
										ODS 1
									</div>
									<div className="text-sm text-slate-400 font-medium">
										Erradicação da Pobreza
									</div>
								</div>
								<div className="bg-slate-950 p-6 rounded-xl shadow-lg border border-slate-800">
									<Globe className="text-emerald-500 mb-3" size={32} />
									<div className="text-4xl font-bold text-white mb-1">
										ODS 11
									</div>
									<div className="text-sm text-slate-400 font-medium">
										Cidades Sustentáveis
									</div>
								</div>
								<div className="col-span-2 bg-gradient-to-br from-slate-900 to-black text-white p-6 rounded-xl shadow-lg border border-slate-800">
									<div className="flex items-center justify-between mb-2">
										<div className="text-sm font-medium text-slate-400">
											ROI Social Estimado
										</div>
										<span className="text-emerald-400 font-bold">+400%</span>
									</div>
									<div className="text-2xl font-bold text-white">
										R$ 45.000 / mês
									</div>
									<div className="text-xs text-slate-500 mt-1">
										Economia gerada para o setor público
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Value Proposition */}
					<section className="mb-24">
						<h2 className="text-3xl font-bold text-white mb-12 text-center">
							Por que investir no Caminhos Campinas?
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							{[
								{
									title: "Relatórios de Inteligência",
									desc: "Acesso a dashboards exclusivos com mapa de calor de demandas sociais e gargalos de serviço público.",
								},
								{
									title: "Brand Safety & Purpose",
									desc: "Associe sua marca a uma solução tecnológica premiada, não apenas a assistencialismo pontual.",
								},
								{
									title: "Dedução Fiscal",
									desc: "Projetos enquadrados nas leis de incentivo à cultura e inovação social.",
								},
							].map((feature, i) => (
								<div
									key={feature.title}
									className="group p-8 rounded-2xl border border-slate-800 bg-slate-900/40 hover:border-blue-500/30 hover:bg-blue-900/10 transition-all"
								>
									<div className="w-12 h-12 bg-blue-900/30 border border-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center mb-6 font-bold text-xl group-hover:scale-110 transition-transform">
										{i + 1}
									</div>
									<h3 className="text-xl font-bold text-white mb-3">
										{feature.title}
									</h3>
									<p className="text-slate-400 leading-relaxed">
										{feature.desc}
									</p>
								</div>
							))}
						</div>
					</section>

					{/* Sponsorship Tiers */}
					<section className="bg-gradient-to-br from-slate-900 to-black rounded-[2.5rem] p-12 lg:p-20 text-white relative overflow-hidden border border-slate-800">
						<div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 brightness-100 contrast-150 mix-blend-overlay"></div>

						<div className="relative z-10 max-w-4xl mx-auto text-center">
							<h2 className="text-4xl font-bold mb-6">Adote uma Tecnologia</h2>
							<p className="text-lg text-slate-300 mb-12">
								Escolha qual funcionalidade sua empresa quer apadrinhar e receba
								o selo{" "}
								<strong className="text-white">Empresa Amiga da Rua</strong>.
							</p>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
								<div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 p-8 rounded-2xl hover:bg-slate-800 transition-colors cursor-pointer group">
									<div className="flex justify-between items-start mb-4">
										<h3 className="text-2xl font-bold text-white">
											Cota Server
										</h3>
										<span className="bg-blue-900/50 border border-blue-500/30 text-blue-300 text-xs font-bold px-2 py-1 rounded">
											R$ 200/mês
										</span>
									</div>
									<ul className="space-y-3 mb-6">
										<li className="flex items-center gap-2 text-slate-300">
											<CheckCircle2 size={16} className="text-emerald-400" />
											<span>Logo no Rodapé do App</span>
										</li>
										<li className="flex items-center gap-2 text-slate-300">
											<CheckCircle2 size={16} className="text-emerald-400" />
											<span>Relatório Mensal Simplificado</span>
										</li>
									</ul>
									<button
										type="button"
										className="w-full bg-slate-700 text-white font-bold py-3 rounded-lg hover:bg-slate-600 transition-colors border border-slate-600"
									>
										Selecionar
									</button>
								</div>

								<div className="bg-gradient-to-br from-blue-900/80 to-indigo-900/80 border border-blue-500/30 p-8 rounded-2xl transform md:-translate-y-4 shadow-2xl shadow-blue-900/20">
									<div className="flex justify-between items-start mb-4">
										<h3 className="text-2xl font-bold text-white">
											Cota Mantenedor
										</h3>
										<span className="bg-white/10 text-white text-xs font-bold px-2 py-1 rounded border border-white/20">
											Sob Consulta
										</span>
									</div>
									<ul className="space-y-3 mb-6">
										<li className="flex items-center gap-2 text-slate-200">
											<CheckCircle2 size={16} className="text-emerald-300" />
											<span>Selo "Empresa Amiga da Rua"</span>
										</li>
										<li className="flex items-center gap-2 text-slate-200">
											<CheckCircle2 size={16} className="text-emerald-300" />
											<span>Acesso total ao Data Lake</span>
										</li>
										<li className="flex items-center gap-2 text-slate-200">
											<CheckCircle2 size={16} className="text-emerald-300" />
											<span>Workshop de Impacto Social</span>
										</li>
									</ul>
									<button
										type="button"
										className="w-full bg-emerald-500 text-black font-bold py-3 rounded-lg hover:bg-emerald-400 transition-colors"
									>
										Falar com Consultor
									</button>
								</div>
							</div>
						</div>
					</section>
				</div>
			</div>
		</main>
	);
}
