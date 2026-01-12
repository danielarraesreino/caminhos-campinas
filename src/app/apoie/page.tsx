"use client";

import { ArrowRight, Building2, Code, Heart, Info, Monitor, Users, GraduationCap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import corporateServices from "@/data/corporate-services.json";

export default function ApoiePage() {
	const PIX_DEV = "19999912915"; // Placeholder desenvolvedor
	const PIX_SOCIAL = "19999912915"; // PIX do Projeto Social (Simulado/Real)

	const GOAL_SOCIAL = 13970;
	const CURRENT_SOCIAL = 450; // Simulado

	const progress = (CURRENT_SOCIAL / GOAL_SOCIAL) * 100;

	return (
		<div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
			{/* Header */}
			<header className="pt-24 pb-12 px-6 text-center border-b border-slate-900 bg-slate-900/50">
				<h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
					Ciclo Fechado de <span className="text-blue-500">Impacto</span>
				</h1>
				<p className="text-xl text-slate-400 max-w-2xl mx-auto">
					Não é apenas doação. É uma solução para a cidade.
					<strong className="text-white block mt-2">Tecnologia + Pedagogia + Responsabilidade Corporativa</strong>
				</p>
			</header>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">

				{/* COLUNA A: SUSTENTAR A TECNOLOGIA (DEV) */}
				<div className="bg-[#0c0c0f] border border-slate-800 rounded-3xl p-6 relative overflow-hidden group hover:border-blue-500/30 transition-all flex flex-col">
					<div className="absolute top-0 right-0 p-4 opacity-10">
						<Code size={100} />
					</div>

					<div className="relative z-10 flex-1">
						<div className="inline-flex items-center gap-2 bg-blue-900/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold uppercase mb-6">
							<Monitor size={14} /> Para o Desenvolvedor
						</div>

						<h2 className="text-2xl font-bold text-white mb-4">
							Sustentar a <span className="text-blue-500">Tecnologia</span>
						</h2>

						<p className="text-slate-400 mb-6 text-sm leading-relaxed">
							Mantenha o servidor online, a Inteligência Artificial ativa e financie a expansão do código.
						</p>

						<div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 mb-6">
							<p className="text-[10px] text-slate-500 mb-1 uppercase font-bold tracking-wider">Chave PIX (Dev)</p>
							<div className="flex items-center justify-between gap-2">
								<code className="text-sm font-mono text-white truncate">{PIX_DEV}</code>
								<CopyButton text={PIX_DEV} />
							</div>
						</div>
					</div>
				</div>

				{/* COLUNA B: SUSTENTAR A VIDA (SOCIAL) */}
				<div className="bg-slate-900/80 border border-slate-700/50 rounded-3xl p-6 relative overflow-hidden group hover:border-green-500/50 transition-all flex flex-col">
					<div className="absolute top-0 right-0 p-4 opacity-5">
						<Heart size={100} />
					</div>

					<div className="relative z-10 flex-1">
						<div className="inline-flex items-center gap-2 bg-green-900/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold uppercase mb-6 border border-green-500/20">
							<Users size={14} /> Para o Projeto Social
						</div>

						<h2 className="text-2xl font-bold text-white mb-4">
							Sustentar a <span className="text-green-400">Vida</span>
						</h2>

						<p className="text-slate-300 mb-6 text-sm leading-relaxed">
							Financie a formação de <strong>Agilizadores Sociais</strong> (ex-moradores de rua).
						</p>

						{/* PROGRESS BAR */}
						<div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-6 shadow-inner">
							<div className="flex justify-between items-end mb-2">
								<span className="text-xs font-medium text-slate-400">Meta: Piloto 20</span>
								<span className="text-lg font-bold text-white">R$ {CURRENT_SOCIAL}</span>
							</div>
							<div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-1">
								<div
									className="h-full bg-green-500 rounded-full transition-all duration-1000 ease-out"
									style={{ width: `${progress}%` }}
								></div>
							</div>
							<p className="text-[10px] text-right text-green-400 font-bold">{progress.toFixed(1)}%</p>
						</div>

						<div className="bg-slate-900/80 p-4 rounded-xl border border-green-900/30 mb-2">
							<p className="text-[10px] text-slate-500 mb-1 uppercase font-bold tracking-wider">Chave PIX (Social)</p>
							<div className="flex items-center justify-between gap-2">
								<code className="text-sm font-mono text-white truncate">{PIX_SOCIAL}</code>
								<CopyButton text={PIX_SOCIAL} />
							</div>
						</div>

						<Link href="/transparencia/projeto-piloto" className="block w-full mt-4">
							<button className="w-full py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2">
								Detalhes do "High Price" <ArrowRight size={16} />
							</button>
						</Link>
					</div>
				</div>

				{/* COLUNA C: EMPRESAS & ESCOLAS (NOVO) */}
				<div className="bg-slate-50 border border-slate-200 text-slate-900 rounded-3xl p-6 relative overflow-hidden group hover:shadow-2xl hover:shadow-purple-500/20 transition-all flex flex-col">
					<div className="absolute top-0 right-0 p-4 opacity-10 text-purple-900">
						<Building2 size={100} />
					</div>

					<div className="relative z-10 flex-1">
						<div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold uppercase mb-6 border border-purple-200">
							<GraduationCap size={14} /> Empresas & Escolas
						</div>

						<h2 className="text-2xl font-bold text-slate-900 mb-4">
							Sustentar o <span className="text-purple-600">Futuro</span>
						</h2>

						<p className="text-slate-600 mb-8 text-sm leading-relaxed">
							Transforme seu orçamento de T&D ou Eventos em impacto real. Contrate nossos serviços.
						</p>

						<div className="space-y-4">
							{corporateServices.map((service) => (
								<div key={service.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:border-purple-400 transition-colors">
									<h3 className="font-bold text-slate-800 text-sm flex justify-between">
										{service.title}
										<span className="text-xs font-normal text-slate-400">{service.type === 'corporate' ? 'B2B' : 'Escola'}</span>
									</h3>
									<p className="text-xs text-slate-500 mt-1 mb-2">{service.investment_target}</p>
									<a
										href={service.cta_link}
										target="_blank"
										rel="noopener noreferrer"
										className="text-xs font-bold text-purple-600 hover:text-purple-700 flex items-center gap-1"
									>
										Solicitar Proposta <ArrowRight size={12} />
									</a>
								</div>
							))}
						</div>

						<div className="mt-8 p-3 bg-purple-50 rounded-lg border border-purple-100">
							<p className="text-xs text-purple-800 italic">
								"Resolvemos um problema social na cidade e ajudamos a resolver problemas comportamentais na sua empresa."
							</p>
						</div>
					</div>
				</div>

			</div>
		</div>
	);
}
