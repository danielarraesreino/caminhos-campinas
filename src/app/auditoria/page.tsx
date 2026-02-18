"use client";

import { CheckCircle2, FileSearch, Shield, TrendingUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AuditoriaPage() {
	return (
		<main className="min-h-screen bg-black text-white font-sans relative overflow-hidden">
			{/* Background Image */}
			<div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
				<Image
					src="/images/sobrio/impacto.png"
					alt=""
					aria-hidden="true"
					fill
					priority
					className="object-cover"
					quality={85}
				/>
				<div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/80 to-black" />
			</div>

			<div className="relative z-10 pt-24 pb-20 max-w-6xl mx-auto px-6 space-y-16">
				{/* Hero Section */}
				<section className="text-center max-w-3xl mx-auto space-y-6">
					<div className="inline-flex items-center gap-2 bg-blue-900/30 border border-blue-800 px-4 py-2 rounded-full mb-4">
						<Shield className="text-blue-400" size={20} aria-hidden="true" />
						<span className="text-blue-300 text-sm font-semibold uppercase tracking-wide">
							Modo Auditor Social
						</span>
					</div>

					<h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent leading-tight">
						Auditoria Social Colaborativa
					</h1>

					<p className="text-xl text-slate-200 leading-relaxed max-w-2xl mx-auto">
						Ajude a validar a autenticidade das narrativas e dados do jogo. Sua
						experiência e conhecimento são essenciais para manter a
						credibilidade do projeto.
					</p>
				</section>

				{/* What is Auditor Social */}
				<section className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 space-y-6">
					<h2 className="text-3xl font-bold text-white flex items-center gap-3">
						<FileSearch
							className="text-blue-400"
							size={32}
							aria-hidden="true"
						/>
						O que é o Auditor Social?
					</h2>

					<div className="space-y-4 text-slate-200 leading-relaxed">
						<p>
							O <strong className="text-white">Auditor Social</strong> é um
							papel colaborativo onde qualquer pessoa pode contribuir para
							validar a precisão e autenticidade do conteúdo do jogo Caminhos
							Campinas.
						</p>

						<p>
							Como um jogo de impacto social que simula a realidade da população
							em situação de rua, é crucial que as narrativas, dilemas, e dados
							apresentados sejam fiéis à realidade vivida pelas pessoas.
						</p>

						<p className="text-blue-300 font-medium">
							Sua contribuição ajuda a garantir que o jogo seja uma ferramenta
							educacional confiável e respeitosa.
						</p>
					</div>
				</section>

				{/* How it Works */}
				<section className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 p-6 rounded-2xl hover:border-blue-700 transition-colors">
						<div className="bg-blue-900/30 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-blue-400">
							<FileSearch size={24} aria-hidden="true" />
						</div>
						<h3 className="text-xl font-bold text-white mb-2">
							1. Explore o Conteúdo
						</h3>
						<p className="text-slate-300 text-sm leading-relaxed">
							Jogue o Caminhos Campinas e identifique narrativas, dilemas ou
							dados que você acredita que precisam de validação ou correção.
						</p>
					</div>

					<div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 p-6 rounded-2xl hover:border-blue-700 transition-colors">
						<div className="bg-blue-900/30 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-blue-400">
							<CheckCircle2 size={24} aria-hidden="true" />
						</div>
						<h3 className="text-xl font-bold text-white mb-2">
							2. Valide ou Reporte
						</h3>
						<p className="text-slate-300 text-sm leading-relaxed">
							Use a ferramenta de validação para confirmar a autenticidade de
							conteúdos ou reportar inconsistências com evidências.
						</p>
					</div>

					<div className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 p-6 rounded-2xl hover:border-blue-700 transition-colors">
						<div className="bg-blue-900/30 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-blue-400">
							<TrendingUp size={24} aria-hidden="true" />
						</div>
						<h3 className="text-xl font-bold text-white mb-2">
							3. Contribua para Melhoria
						</h3>
						<p className="text-slate-300 text-sm leading-relaxed">
							Suas validações ajudam a equipe a melhorar continuamente o jogo,
							tornando-o mais preciso e impactante.
						</p>
					</div>
				</section>

				{/* CTA Section */}
				<section className="bg-gradient-to-br from-blue-900/40 to-cyan-900/40 border border-blue-800 rounded-2xl p-10 text-center space-y-6">
					<h2 className="text-3xl font-bold text-white">
						Pronto para Contribuir?
					</h2>

					<p className="text-slate-200 max-w-2xl mx-auto">
						Acesse a ferramenta de validação e comece a auditar o conteúdo do
						jogo. Cada validação conta para construir um projeto mais autêntico
						e confiável.
					</p>

					<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
						<Link
							href="/auditoria/validar"
							className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-400 text-white font-bold px-8 py-4 rounded-full transition-all shadow-lg hover:shadow-blue-500/20 transform hover:-translate-y-1"
						>
							<Shield size={20} aria-hidden="true" />
							Acessar Ferramenta de Validação
						</Link>

						<Link
							href="/jogar"
							className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold px-8 py-4 rounded-full transition-all border border-slate-700"
						>
							Jogar Caminhos Campinas
						</Link>
					</div>
				</section>

				{/* Info Box */}
				<section className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
					<p className="text-sm text-slate-300 text-center leading-relaxed">
						<strong className="text-white">Nota:</strong> Todas as validações
						são anônimas e contribuem para a transparência do projeto. Se você
						tem experiência vivida em situação de rua ou trabalha com essa
						população, sua perspectiva é especialmente valiosa.
					</p>
				</section>
			</div>
		</main>
	);
}
