"use client";

import {
	ArrowRight,
	BookOpen,
	Github,
	MapPin,
	Newspaper,
	Play,
	TrendingUp,
	Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { STORY_ARCS } from "@/data/story-arcs";

/**
 * Landing Page - Campinas Invisível | Auditoria
 *
 * Mantém o propósito político original:
 * - "A Invisibilidade é uma Escolha Política"
 * - Jogo como ferramenta de auditoria social
 * - TODOS jogam para gerar telemetria (pop rua + público geral)
 * - Bifurcação integrada e sutil
 */
export function LandingPage() {
	const [userIntent, setUserIntent] = useState<"survival" | "audit" | null>(
		null,
	);
	const [selectedArc, setSelectedArc] = useState<string | null>(null);

	// Se usuário escolheu, redireciona
	if (userIntent === "survival") {
		// Pop rua: Direto pro jogo com modo survival
		const url = selectedArc
			? `/jogar?mode=survival&arc=${selectedArc}`
			: "/jogar?mode=survival";
		window.location.href = url;
		return (
			<div className="min-h-screen bg-black flex items-center justify-center">
				<div className="text-yellow-400 text-lg font-bold">
					Carregando modo sobrevivência...
				</div>
			</div>
		);
	}

	if (userIntent === "audit") {
		// Público geral: Jogo com contexto de auditoria
		const url = selectedArc ? `/jogar?arc=${selectedArc}` : "/jogar";
		window.location.href = url;
		return (
			<div className="min-h-screen bg-slate-950 flex items-center justify-center">
				<div className="text-violet-400 text-lg font-bold">
					Carregando auditoria social...
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-black text-white relative overflow-hidden pt-16">
			{/* Background Image - Realismo Sóbrio */}
			<div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
				<Image
					src="/images/sobrio/landing.png"
					alt=""
					aria-hidden="true"
					fill
					priority
					className="object-cover"
					quality={85}
				/>
				<div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/80 to-black" />
			</div>

			<header className="relative z-10 container mx-auto px-4 py-16 md:py-24">
				<div className="max-w-4xl mx-auto text-center space-y-8">
					<div className="inline-block px-4 py-2 bg-red-600/20 border border-red-600 rounded-full text-red-400 text-sm font-mono uppercase tracking-wider">
						Infraestrutura Cívica
					</div>

					<h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight">
						Campinas
						<span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
							Invisível
						</span>
					</h1>

					<p className="text-xl md:text-2xl font-bold text-slate-200">
						Dados Abertos & Defesa de Direitos Humanos
					</p>

					<div className="space-y-4 text-lg md:text-xl leading-relaxed">
						<p className="text-red-400 font-black text-2xl">
							A Invisibilidade é uma Escolha Política.
						</p>
						<p className="text-slate-200">
							<span className="font-bold">1.300 vidas</span>,
							<span className="font-bold"> 362 vagas</span> e uma cidade repleta
							de <span className="text-red-400">barreiras invisíveis</span>.
						</p>
						<p className="text-slate-300">
							Não somos apenas um mapa; somos uma{" "}
							<strong className="text-white">
								ferramenta de reconhecimento territorial
							</strong>{" "}
							que transforma estatísticas em ação direta.
						</p>
					</div>
				</div>
			</header>

			{/* SPOTLIGHT SECTION - Novo Portfólio de Conteúdo */}
			<section className="relative z-10 container mx-auto px-4 py-12 -mt-10">
				<div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
					{/* ODS Spotlight */}
					<Link
						href="/impacto/ods"
						className="group relative overflow-hidden bg-gradient-to-br from-emerald-950/40 via-black to-black border border-emerald-500/30 p-8 rounded-[2.5rem] backdrop-blur-md hover:border-emerald-500/60 transition-all duration-500 flex flex-col justify-between min-h-[320px]"
					>
						<div className="absolute top-0 right-0 p-8 text-emerald-500/20 group-hover:text-emerald-500/40 transition-colors duration-500">
							<TrendingUp size={120} strokeWidth={1} />
						</div>
						<div className="relative z-10 space-y-4">
							<div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-emerald-400 uppercase bg-emerald-400/10 w-fit px-3 py-1 rounded-full border border-emerald-400/20">
								Impacto Global
							</div>
							<h3 className="text-3xl font-black uppercase tracking-tighter leading-none">
								ODS 2030 <br />
								<span className="text-emerald-400">Cobertura</span>
							</h3>
							<p className="text-zinc-400 text-sm leading-relaxed max-w-[200px]">
								Análise detalhada da interseção entre o projeto e as metas da
								ONU.
							</p>
						</div>
						<div className="relative z-10 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#00e5a0]">
							Explorar Relatório{" "}
							<ArrowRight
								size={14}
								className="group-hover:translate-x-2 transition-transform"
							/>
						</div>
					</Link>

					{/* Journal/Voice Spotlight */}
					<Link
						href="/jornal"
						className="relative overflow-hidden bg-gradient-to-br from-red-950/40 via-black to-black border border-red-500/30 p-8 rounded-[2.5rem] backdrop-blur-md hover:border-red-500/60 transition-all duration-500 flex flex-col justify-between min-h-[320px] group"
					>
						<div className="absolute top-0 right-0 p-8 text-red-500/20 group-hover:text-red-500/40 transition-colors duration-500">
							<Newspaper size={120} strokeWidth={1} />
						</div>
						<div className="relative z-10 space-y-4">
							<div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-red-400 uppercase bg-red-400/10 w-fit px-3 py-1 rounded-full border border-red-400/20">
								Voz Própria
							</div>
							<h3 className="text-3xl font-black uppercase tracking-tighter leading-none text-white">
								Jornal <br />
								<span className="text-red-500 italic">da Rua</span>
							</h3>
							<div className="border-l-2 border-red-500/50 pl-4 py-1">
								<p className="text-zinc-300 text-xs italic line-clamp-2">
									"A cidade nos vê como sombra, mas temos nome e história..."
								</p>
							</div>
						</div>
						<div className="relative z-10 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-500">
							Ler Narrativas{" "}
							<ArrowRight
								size={14}
								className="group-hover:translate-x-2 transition-transform"
							/>
						</div>
					</Link>

					{/* Audit Spotlight */}
					<div className="relative overflow-hidden bg-gradient-to-br from-blue-950/40 via-black to-black border border-blue-500/30 p-8 rounded-[2.5rem] backdrop-blur-md hover:border-blue-500/60 transition-all duration-500 flex flex-col justify-between min-h-[320px] group">
						<div className="absolute top-0 right-0 p-8 text-blue-500/20 group-hover:text-blue-500/40 transition-colors duration-500">
							<MapPin size={120} strokeWidth={1} />
						</div>
						<div className="relative z-10 space-y-4">
							<div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-blue-400 uppercase bg-blue-400/10 w-fit px-3 py-1 rounded-full border border-blue-400/20">
								Auditoria Social
							</div>
							<h3 className="text-3xl font-black uppercase tracking-tighter leading-none text-white">
								Termômetro <br />
								<span className="text-blue-500">Social</span>
							</h3>
							<div className="flex gap-4">
								<div className="text-center">
									<div className="text-2xl font-black text-white leading-none">
										1.3k
									</div>
									<div className="text-[10px] uppercase text-zinc-500 font-bold">
										Vidas
									</div>
								</div>
								<div className="text-center border-l border-zinc-800 pl-4">
									<div className="text-2xl font-black text-blue-400 leading-none">
										82%
									</div>
									<div className="text-[10px] uppercase text-zinc-500 font-bold">
										Confiança
									</div>
								</div>
							</div>
						</div>
						<Link
							href="/transparencia"
							className="relative z-10 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-400"
						>
							Ver Transparência{" "}
							<ArrowRight
								size={14}
								className="group-hover:translate-x-2 transition-transform"
							/>
						</Link>
					</div>
				</div>
			</section>

			{/* NOVA SEÇÃO: Explore Cenários Reais */}
			<section className="relative z-10 container mx-auto px-4 py-12">
				<div className="max-w-5xl mx-auto">
					<div className="text-center mb-8">
						<div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 border border-blue-500 rounded-full text-blue-300 text-sm font-mono uppercase tracking-wider mb-4">
							<BookOpen size={16} aria-hidden="true" />
							Escolha sua Jornada
						</div>
						<h2 className="text-3xl font-black uppercase mb-3">
							Explore Cenários Reais
						</h2>
						<p className="text-slate-300 text-base max-w-2xl mx-auto">
							Cada arco narrativo é baseado em dados do Censo Pop Rua 2024.
							Escolha um caminho temático ou deixe o jogo decidir.
						</p>
					</div>

					{/* Grid de Arcos */}
					<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
						{Object.values(STORY_ARCS)
							.slice(0, 6)
							.map((arc) => (
								<button
									key={arc.id}
									type="button"
									onClick={() =>
										setSelectedArc(selectedArc === arc.id ? null : arc.id)
									}
									className={`group relative p-5 bg-gradient-to-br from-slate-900/80 to-black border-2 rounded-xl hover:scale-[1.02] transition-all text-left ${
										selectedArc === arc.id
											? "border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.3)]"
											: "border-slate-800 hover:border-slate-600"
									}`}
								>
									{selectedArc === arc.id && (
										<div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 border-black">
											✓
										</div>
									)}

									<div className="space-y-3">
										<h3
											className={`text-lg font-black uppercase tracking-tight ${
												selectedArc === arc.id ? "text-blue-400" : "text-white"
											}`}
										>
											{arc.name}
										</h3>

										<p className="text-slate-400 text-sm leading-snug line-clamp-2">
											{arc.description}
										</p>

										<div className="flex flex-wrap gap-1">
											{arc.ods.map((ods) => (
												<span
													key={ods}
													className="text-[9px] bg-blue-900/50 px-2 py-0.5 rounded text-blue-300 border border-blue-500/30 font-mono"
												>
													{ods}
												</span>
											))}
										</div>

										<div className="text-[10px] text-slate-500 italic">
											{arc.theme}
										</div>
									</div>
								</button>
							))}
					</div>

					<div className="text-center">
						<p className="text-slate-500 text-xs">
							{selectedArc
								? `Arco "${STORY_ARCS[selectedArc.toUpperCase().replace(/-/g, "_")]?.name}" selecionado`
								: "Nenhum arco selecionado (jogo escolherá aleatoriamente)"}
						</p>
					</div>
				</div>
			</section>

			{/* Bifurcação Integrada - TODOS JOGAM */}
			<section className="relative z-10 container mx-auto px-4 py-12">
				<div className="max-w-5xl mx-auto">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-black uppercase mb-4">
							A Invisibilidade é Política de Estado.
							<span className="block text-red-500 mt-2">
								O Jogo é a Denúncia.
							</span>
						</h2>
						<p className="text-slate-300 text-lg max-w-3xl mx-auto">
							Simule a jornada de quem vive nas ruas de Campinas. Cada barreira
							que você enfrenta gera um dado real sobre a falha da rede de
							proteção social{" "}
							<span className="text-blue-400 font-mono">(ODS 1, 3 e 11)</span>.
						</p>
					</div>

					{/* Duas Entradas - Mesmo Destino (JOGO) */}
					<div className="grid md:grid-cols-2 gap-6 mb-8">
						{/* Path 1: Pop Rua - Modo Sobrevivência */}
						<button
							type="button"
							onClick={() => setUserIntent("survival")}
							className="group relative p-6 bg-gradient-to-br from-yellow-900/30 to-black border-2 border-yellow-600/50 rounded-xl hover:border-yellow-400 hover:scale-[1.01] transition-all text-left flex flex-col justify-between h-full"
						>
							<div className="absolute inset-0 bg-yellow-600/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />

							<div className="relative z-10 space-y-3">
								<div className="flex items-center gap-3">
									<MapPin className="text-yellow-400" size={24} />
									<h3 className="text-xl font-black text-yellow-400 uppercase">
										Preciso Sobreviver
									</h3>
								</div>
								<p className="text-yellow-100 leading-relaxed text-sm">
									Modo sobrevivência com mapa de recursos e rotas otimizadas.
									100% offline.
								</p>
							</div>
							<div className="relative z-10 mt-4">
								<span className="px-2 py-0.5 bg-yellow-400 text-black text-[10px] rounded-full font-bold uppercase">
									Offline-first
								</span>
							</div>
						</button>

						{/* Path 2: Público Geral - Modo Auditoria */}
						<button
							type="button"
							onClick={() => setUserIntent("audit")}
							className="group relative p-6 bg-gradient-to-br from-violet-950/50 to-black border-2 border-violet-600/50 rounded-xl hover:border-violet-400 hover:scale-[1.01] transition-all text-left flex flex-col justify-between h-full"
						>
							<div className="absolute inset-0 bg-violet-600/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />

							<div className="relative z-10 space-y-3">
								<div className="flex items-center gap-3">
									<Play className="text-violet-400" size={24} />
									<h3 className="text-xl font-black text-violet-400 uppercase">
										Sou Auditor Social
									</h3>
								</div>
								<p className="text-violet-100 leading-relaxed text-sm">
									Jogue para gerar telemetria anônima que confronta dados
									oficiais.
								</p>
							</div>
							<div className="relative z-10 mt-4">
								<span className="px-2 py-0.5 bg-violet-600/30 text-violet-300 text-[10px] rounded-full font-mono uppercase">
									Auditoria Cidadã
								</span>
							</div>
						</button>
					</div>

					<p className="text-center text-slate-400 text-sm">
						🔒 Telemetria 100% anônima • Processamento local • Zero rastreamento
					</p>
				</div>
			</section>

			{/* Como Funciona - 3 Passos */}
			<section className="relative z-10 container mx-auto px-4 py-16 bg-slate-900/50">
				<div className="max-w-4xl mx-auto">
					<div className="grid md:grid-cols-3 gap-8">
						<div className="space-y-4">
							<div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white font-black text-xl">
								01
							</div>
							<h3 className="text-xl font-bold">Você Joga</h3>
							<p className="text-slate-300">
								Cada escolha no jogo simula uma barreira real: falta de
								documentos, violência institucional ou arquitetura hostil.
							</p>
						</div>

						<div className="space-y-4">
							<div className="w-12 h-12 rounded-full bg-orange-600 flex items-center justify-center text-white font-black text-xl">
								02
							</div>
							<h3 className="text-xl font-bold">O App Audita</h3>
							<p className="text-slate-300">
								Suas decisões geram estatísticas anônimas que confrontamos com
								os dados oficiais da Prefeitura e da FEAC.
							</p>
						</div>

						<div className="space-y-4">
							<div className="w-12 h-12 rounded-full bg-yellow-600 flex items-center justify-center text-white font-black text-xl">
								03
							</div>
							<h3 className="text-xl font-bold">A Cidade Muda</h3>
							<p className="text-slate-300">
								Usamos esses registros para pressionar por políticas públicas
								reais e integrar dados ao ecossistema Wikimedia.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Pilares da Iniciativa - NOVO PORTAL */}
			<section className="relative z-10 container mx-auto px-4 py-20">
				<div className="max-w-6xl mx-auto">
					<div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
						<div className="space-y-2">
							<span className="text-yellow-400 font-mono text-xs uppercase tracking-[0.3em]">
								Ecossistema
							</span>
							<h2 className="text-4xl font-black uppercase tracking-tighter leading-none">
								Os Quatro Pilares
								<br />
								<span className="text-zinc-400">do Caminhos Campinas.</span>
							</h2>
						</div>
						<p className="text-zinc-300 max-w-md text-sm leading-relaxed">
							Muito além de um jogo, somos uma infraestrutura cívica que combina
							tecnologia, dados e mobilização direta para transformar a
							realidade socioterritorial da cidade.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
						{/* Pillar 1: Sobrevivência */}
						<Link
							href="/recursos"
							className="group p-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl hover:border-yellow-500/50 hover:bg-zinc-900/60 transition-all flex flex-col justify-between h-full"
						>
							<div className="space-y-4">
								<div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 border border-yellow-500/20 group-hover:scale-110 transition-transform">
									<MapPin size={24} />
								</div>
								<h3 className="text-xl font-bold uppercase tracking-tight text-white italic">
									Sobrevivência
								</h3>
								<p className="text-zinc-400 text-sm leading-snug">
									Guia de recursos offline, mapa de serviços e educação sobre
									direitos básicos para quem está na rua.
								</p>
							</div>
							<div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-yellow-500 group-hover:translate-x-2 transition-transform">
								Acessar Guia <Play size={10} className="fill-current" />
							</div>
						</Link>

						{/* Pillar 2: Auditoria */}
						<Link
							href="/transparencia"
							className="group p-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl hover:border-blue-500/50 hover:bg-zinc-900/60 transition-all flex flex-col justify-between h-full"
						>
							<div className="space-y-4">
								<div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 border border-blue-500/20 group-hover:scale-110 transition-transform">
									<TrendingUp size={24} />
								</div>
								<h3 className="text-xl font-bold uppercase tracking-tight text-white italic">
									Auditoria
								</h3>
								<p className="text-zinc-400 text-sm leading-snug">
									Portal de transparência e visualização do "Abismo dos
									Números". Dados que geram pressão política.
								</p>
							</div>
							<div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-400 group-hover:translate-x-2 transition-transform">
								Ver Transparência <Play size={10} className="fill-current" />
							</div>
						</Link>

						{/* Pillar 3: Voz */}
						<Link
							href="/jornal"
							className="group p-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl hover:border-red-500/50 hover:bg-zinc-900/60 transition-all flex flex-col justify-between h-full"
						>
							<div className="space-y-4">
								<div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500 border border-red-500/20 group-hover:scale-110 transition-transform">
									<Newspaper size={24} />
								</div>
								<h3 className="text-xl font-bold uppercase tracking-tight text-white italic">
									Voz própria
								</h3>
								<p className="text-zinc-400 text-sm leading-snug">
									O Jornal da Rua e coletor de dilemas. Narrativas diretas de
									quem vive a cidade de forma invisível.
								</p>
							</div>
							<div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-500 group-hover:translate-x-2 transition-transform">
								Ler Jornal <Play size={10} className="fill-current" />
							</div>
						</Link>

						{/* Pillar 4: Rede */}
						<Link
							href="/hub"
							className="group p-6 bg-zinc-900/40 border border-zinc-800 rounded-2xl hover:border-zinc-500 hover:bg-zinc-900/60 transition-all flex flex-col justify-between h-full"
						>
							<div className="space-y-4">
								<div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400 border border-zinc-700 group-hover:scale-110 transition-transform">
									<Users size={24} />
								</div>
								<h3 className="text-xl font-bold uppercase tracking-tight text-white italic">
									Rede Viva
								</h3>
								<p className="text-zinc-400 text-sm leading-snug">
									Hub de parceiros, formação para agilizadores sociais e
									ecossistema de impacto ESG em Campinas.
								</p>
							</div>
							<div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:translate-x-2 transition-transform">
								Conhecer Hub <Play size={10} className="fill-current" />
							</div>
						</Link>
					</div>
				</div>
			</section>

			{/* Footer - Dados Soberanos */}
			<footer className="relative z-10 border-t border-zinc-900 py-16 bg-black">
				<div className="container mx-auto px-4">
					<div className="max-w-4xl mx-auto space-y-12">
						<div className="grid md:grid-cols-3 gap-12 text-sm">
							<div className="space-y-4">
								<h4 className="font-black uppercase tracking-widest text-xs text-zinc-400">
									Dados Soberanos
								</h4>
								<p className="text-zinc-300 leading-relaxed font-medium">
									Baseado no Censo Pop Rua 2024 e no Decreto Federal 7.053/2009.
									Auditoria cidadã em tempo real integrada ao Wikidata.
								</p>
							</div>
							<div className="space-y-4">
								<h4 className="font-black uppercase tracking-widest text-xs text-zinc-400">
									Território / DDD 019
								</h4>
								<p className="text-zinc-300 leading-relaxed font-medium">
									Focado na realidade socioterritorial da Região Metropolitana
									de Campinas. Uma cidade de 1.2M de habitantes.
								</p>
							</div>
							<div className="space-y-4">
								<h4 className="font-black uppercase tracking-widest text-xs text-zinc-400">
									Soberania Tecnológica
								</h4>
								<p className="text-zinc-300 leading-relaxed font-medium">
									Código Aberto, Offline-first e Zero Rastreamento. A tecnologia
									como instrumento de emancipação coletiva.
								</p>
							</div>
						</div>

						<div className="flex flex-wrap gap-x-8 gap-y-4 justify-center text-[10px] font-black uppercase tracking-[0.25em] text-zinc-400 border-y border-zinc-900 py-8">
							<Link
								href="/sobre"
								className="hover:text-white transition-colors"
							>
								Institucional
							</Link>
							<Link
								href="/parcerias"
								className="hover:text-white transition-colors"
							>
								ESG & Parcerias
							</Link>
							<Link
								href="/curso"
								className="hover:text-white transition-colors"
							>
								Formação
							</Link>
							<Link
								href="/transparencia"
								className="hover:text-white transition-colors"
							>
								Transparência
							</Link>
						</div>

						<div className="text-center space-y-2">
							<p className="text-zinc-500 text-xs">
								Desenvolvido por{" "}
								<a
									href="https://github.com/danielarraesreino"
									target="_blank"
									rel="noopener noreferrer"
									className="text-white hover:text-blue-400 inline-flex items-center gap-1 font-bold"
								>
									Daniel (Japa/Oclinhos) <Github size={14} />
								</a>
							</p>
							<p className="text-zinc-600 text-[10px] uppercase tracking-widest font-black">
								Vibe Coding ⚡ Inovação Social
							</p>
							<p className="text-zinc-600 text-[10px] italic">
								"Informar é o primeiro passo para a libertação."
							</p>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
