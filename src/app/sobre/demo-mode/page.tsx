"use client";

import { AlertCircle, Gamepad2, Shield, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function DemoModePage() {
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

			<div className="relative z-10 pt-24 pb-20 max-w-5xl mx-auto px-6 space-y-12">
				{/* Hero Section */}
				<section className="text-center max-w-3xl mx-auto space-y-6">
					<div className="inline-flex items-center gap-2 bg-purple-900/30 border border-purple-800 px-4 py-2 rounded-full mb-4">
						<Gamepad2
							className="text-purple-400"
							size={20}
							aria-hidden="true"
						/>
						<span className="text-purple-300 text-sm font-semibold uppercase tracking-wide">
							Modo Demonstração
						</span>
					</div>

					<h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
						DEMO_MODE
					</h1>

					<p className="text-xl text-slate-200 leading-relaxed">
						Entenda como o Modo Demo ajusta as mecânicas do jogo para
						demonstrações, testes e primeiras experiências.
					</p>
				</section>

				{/* What is DEMO_MODE */}
				<section className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 space-y-4">
					<h2 className="text-3xl font-bold text-white flex items-center gap-3">
						<Shield className="text-purple-400" size={32} aria-hidden="true" />O
						que é o DEMO_MODE?
					</h2>

					<p className="text-slate-200 leading-relaxed">
						O{" "}
						<code className="bg-purple-900/30 px-2 py-1 rounded text-purple-300">
							DEMO_MODE
						</code>{" "}
						é uma configuração técnica que ajusta as mecânicas do jogo para
						torná-lo mais acessível durante demonstrações, apresentações e para
						jogadores de primeira viagem.
					</p>

					<p className="text-slate-200 leading-relaxed">
						Quando ativado, o jogo fica{" "}
						<strong className="text-white">menos punitivo</strong> e
						<strong className="text-white"> mais lento</strong>, permitindo que
						você explore e aprenda sem a pressão total da simulação realista.
					</p>
				</section>

				{/* Effects Grid */}
				<section className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-800 p-6 rounded-2xl">
						<div className="bg-purple-900/30 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-purple-400">
							<Shield size={24} aria-hidden="true" />
						</div>
						<h3 className="text-xl font-bold text-white mb-2">
							1. Confisco Desativado
						</h3>
						<p className="text-slate-300 text-sm leading-relaxed mb-3">
							"O Rapa" (confisco municipal) está desabilitado. Você não perderá
							suas ferramentas de trabalho inesperadamente.
						</p>
						<div className="bg-black/30 rounded-lg p-3 border border-purple-700/50">
							<p className="text-xs text-purple-300 font-mono">
								Chance: <span className="line-through">2%</span> →{" "}
								<strong>0%</strong>
							</p>
						</div>
					</div>

					<div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-800 p-6 rounded-2xl">
						<div className="bg-purple-900/30 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-purple-400">
							<Zap size={24} aria-hidden="true" />
						</div>
						<h3 className="text-xl font-bold text-white mb-2">
							2. Decay Reduzido
						</h3>
						<p className="text-slate-300 text-sm leading-relaxed mb-3">
							A sanidade mental decai 50% mais devagar, dando mais tempo para
							explorar sem crises imediatas.
						</p>
						<div className="bg-black/30 rounded-lg p-3 border border-purple-700/50">
							<p className="text-xs text-purple-300 font-mono">
								Decay: <span className="line-through">100%</span> →{" "}
								<strong>50%</strong>
							</p>
						</div>
					</div>

					<div className="bg-gradient-to-br from-purple-900/40 to-pink-900/40 border border-purple-800 p-6 rounded-2xl">
						<div className="bg-purple-900/30 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-purple-400">
							<Gamepad2 size={24} aria-hidden="true" />
						</div>
						<h3 className="text-xl font-bold text-white mb-2">
							3. Tempo Mais Lento
						</h3>
						<p className="text-slate-300 text-sm leading-relaxed mb-3">
							O loop do jogo roda a cada 30 segundos (vs 10 segundos), dando
							mais tempo para ler e entender eventos.
						</p>
						<div className="bg-black/30 rounded-lg p-3 border border-purple-700/50">
							<p className="text-xs text-purple-300 font-mono">
								Tick: <span className="line-through">10s</span> →{" "}
								<strong>30s</strong>
							</p>
						</div>
					</div>
				</section>

				{/* Why DEMO_MODE */}
				<section className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 space-y-4">
					<h2 className="text-2xl font-bold text-white">
						Por que o DEMO_MODE existe?
					</h2>

					<div className="space-y-3 text-slate-200">
						<p className="leading-relaxed">
							<strong className="text-white">Para Demonstrações:</strong>{" "}
							Durante apresentações e pitches, é importante que o jogo seja
							compreensível sem frustrar o público com mecânicas muito duras.
						</p>

						<p className="leading-relaxed">
							<strong className="text-white">
								Para Primeiras Experiências:
							</strong>{" "}
							Novos jogadores precisam de tempo para aprender os sistemas antes
							de enfrentar a simulação completa.
						</p>

						<p className="leading-relaxed">
							<strong className="text-white">Para Testes:</strong>{" "}
							Desenvolvedores e testadores precisam explorar o jogo sem pressão
							de tempo para identificar bugs e melhorias.
						</p>
					</div>
				</section>

				{/* Warning Box */}
				<section className="bg-gradient-to-br from-amber-900/40 to-orange-900/40 border border-amber-800 rounded-2xl p-6">
					<div className="flex items-start gap-4">
						<AlertCircle
							className="text-amber-400 flex-shrink-0 mt-1"
							size={24}
							aria-hidden="true"
						/>
						<div className="space-y-2">
							<h3 className="text-xl font-bold text-white">
								Importante: Versão de Produção
							</h3>
							<p className="text-slate-200 leading-relaxed">
								Para o lançamento público, o{" "}
								<code className="bg-amber-900/30 px-2 py-1 rounded text-amber-300">
									DEMO_MODE
								</code>{" "}
								será desativado. A simulação realista é crucial para o impacto
								educacional do jogo.
							</p>
							<p className="text-slate-300 text-sm">
								As mecânicas completas refletem a realidade vivida por pessoas
								em situação de rua, e essa autenticidade é essencial para a
								missão do projeto.
							</p>
						</div>
					</div>
				</section>

				{/* How to Identify */}
				<section className="bg-slate-900/80 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 space-y-4">
					<h2 className="text-2xl font-bold text-white">
						Como saber se o DEMO_MODE está ativo?
					</h2>

					<p className="text-slate-200 leading-relaxed">
						Quando o DEMO_MODE está ativo, você verá um badge roxo no topo da
						tela do jogo:
					</p>

					<div className="bg-black/50 border border-purple-700/50 rounded-xl p-6 flex justify-center">
						<div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-purple-900/80 to-pink-900/80 px-3 py-1 rounded-full border border-purple-500/50 shadow-lg shadow-purple-900/50">
							<Gamepad2
								className="w-3.5 h-3.5 text-purple-300"
								aria-hidden="true"
							/>
							<span className="text-purple-200 font-bold text-[10px] uppercase tracking-wider">
								Modo Demo
							</span>
							<span className="text-xs" aria-hidden="true">
								ℹ️
							</span>
						</div>
					</div>

					<p className="text-slate-300 text-sm">
						Passe o mouse sobre o badge para ver os detalhes das alterações.
					</p>
				</section>

				{/* CTA */}
				<section className="text-center space-y-6 pt-8">
					<h2 className="text-2xl font-bold text-white">Pronto para Jogar?</h2>

					<div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
						<Link
							href="/jogar"
							className="inline-flex items-center gap-2 bg-purple-500 hover:bg-purple-400 text-white font-bold px-8 py-4 rounded-full transition-all shadow-lg hover:shadow-purple-500/20 transform hover:-translate-y-1"
						>
							<Gamepad2 size={20} />
							Jogar Caminhos Campinas
						</Link>

						<Link
							href="/sobre"
							className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white font-bold px-8 py-4 rounded-full transition-all border border-slate-700"
						>
							Sobre o Projeto
						</Link>
					</div>
				</section>
			</div>
		</main>
	);
}
