"use client";

import { ArrowRight, Code, Heart, Info, Monitor, Users } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
// import { EcoButton } from "@/components/ui/EcoButton";

export default function ApoiePage() {
	const [activeTab, setActiveTab] = useState<"tech" | "life">("life");

	const PIX_DEV = "19999912915"; // Placeholdersenvolvedor
	const PIX_SOCIAL = "19999912915"; // PIX do Projeto Social (Simulado/Real)

	const GOAL_SOCIAL = 13970;
	const CURRENT_SOCIAL = 450; // Simulado

	const progress = (CURRENT_SOCIAL / GOAL_SOCIAL) * 100;

	return (
		<div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
			{/* Header */}
			<header className="pt-24 pb-12 px-6 text-center border-b border-slate-900 bg-slate-900/50">
				<h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">
					Transparência <span className="text-blue-500">Radical</span>
				</h1>
				<p className="text-xl text-slate-400 max-w-2xl mx-auto">
					Sabemos que doação é confiança. Por isso, separamos o dinheiro que
					<strong className="text-white"> sustenta o código</strong> do dinheiro que
					<strong className="text-white"> sustenta a vida</strong>.
				</p>
			</header>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 grid lg:grid-cols-2 gap-8">

				{/* COLUNA A: SUSTENTAR A TECNOLOGIA (DEV) */}
				<div className="bg-[#0c0c0f] border border-slate-800 rounded-3xl p-8 relative overflow-hidden group hover:border-blue-500/30 transition-all">
					<div className="absolute top-0 right-0 p-4 opacity-10">
						<Code size={120} />
					</div>

					<div className="relative z-10">
						<div className="inline-flex items-center gap-2 bg-blue-900/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold uppercase mb-6">
							<Monitor size={14} /> Para o Desenvolvedor
						</div>

						<h2 className="text-3xl font-bold text-white mb-4">
							Sustentar a <span className="text-blue-500">Tecnologia</span>
						</h2>

						<p className="text-slate-400 mb-8 leading-relaxed">
							Mantenha o servidor online, a Inteligência Artificial ativa e financie a expansão do código
							para outras cidades (Caminhos SP, Santos, Mongaguá - White Label).
						</p>

						<div className="bg-slate-900/80 p-6 rounded-xl border border-slate-800 mb-8">
							<p className="text-sm text-slate-500 mb-2 uppercase font-bold tracking-wider">Chave PIX (Desenvolvimento)</p>
							<div className="flex items-center justify-between gap-4">
								<code className="text-lg font-mono text-white truncate">{PIX_DEV}</code>
								<CopyButton text={PIX_DEV} />
							</div>
						</div>

						<ul className="space-y-3 text-sm text-slate-400 mb-8">
							<li className="flex items-center gap-2">
								<div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
								Custos de Servidor (Vercel/AWS)
							</li>
							<li className="flex items-center gap-2">
								<div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
								API de Inteligência Artificial (Groq/OpenAI)
							</li>
							<li className="flex items-center gap-2">
								<div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
								Horas de Engenharia (Open Source)
							</li>
						</ul>
					</div>
				</div>

				{/* COLUNA B: SUSTENTAR A VIDA (SOCIAL) */}
				<div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 rounded-3xl p-8 relative overflow-hidden group hover:border-green-500/50 transition-all shadow-2xl">
					<div className="absolute top-0 right-0 p-4 opacity-5">
						<Heart size={120} />
					</div>

					<div className="relative z-10">
						<div className="inline-flex items-center gap-2 bg-green-900/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold uppercase mb-6 border border-green-500/20">
							<Users size={14} /> Para o Projeto Social
						</div>

						<h2 className="text-3xl font-bold text-white mb-4">
							Sustentar a <span className="text-green-400">Vida</span>
						</h2>

						<p className="text-slate-300 mb-6 leading-relaxed">
							Financie a formação de <strong>20 Agilizadores Sociais</strong> baseada na metodologia
							<em> 'High Price'</em> (Dr. Carl Hart). Pagamento diário condicionado à presença.
						</p>

						{/* PROGRESS BAR */}
						<div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 mb-8 shadow-inner">
							<div className="flex justify-between items-end mb-2">
								<span className="text-sm font-medium text-slate-400">Meta: Piloto 20 Alunos</span>
								<span className="text-2xl font-bold text-white">R$ {CURRENT_SOCIAL} <span className="text-sm text-slate-500 font-normal">/ {GOAL_SOCIAL}</span></span>
							</div>
							<div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden mb-2">
								<div
									className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-1000 ease-out"
									style={{ width: `${progress}%` }}
								></div>
							</div>
							<p className="text-xs text-right text-green-400 mt-1 font-bold">{progress.toFixed(1)}% Financiado</p>
						</div>

						<div className="bg-green-950/30 p-4 rounded-xl border border-green-900/50 mb-8 flex gap-4 items-start">
							<Info className="text-green-500 shrink-0 mt-1" size={20} />
							<div className="text-sm text-green-100">
								<strong className="block mb-1 text-green-400">Matemática da Dignidade:</strong>
								"R$ 50/dia por aluno + R$ 100 Bônus de Formatura + Alimentação + Festa no CAPS."
								<br />
								<Link href="/transparencia/projeto-piloto" className="underline hover:text-white mt-1 inline-block">Ver planilha detalhada &rarr;</Link>
							</div>
						</div>

						<div className="bg-slate-900/80 p-6 rounded-xl border border-green-900/30 mb-2">
							<p className="text-sm text-slate-500 mb-2 uppercase font-bold tracking-wider">Chave PIX (Fundo Social)</p>
							<div className="flex items-center justify-between gap-4">
								<code className="text-lg font-mono text-white truncate">{PIX_SOCIAL}</code>
								<CopyButton text={PIX_SOCIAL} />
							</div>
						</div>
						<p className="text-xs text-slate-500 text-center mb-6">Conta auditada pelo Conselho Gestor</p>

						<Link href="/transparencia/projeto-piloto" className="block w-full">
							<button className="w-full py-4 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2">
								Entenda o Projeto "High Price" <ArrowRight size={18} />
							</button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
