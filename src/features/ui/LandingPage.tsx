"use client";

import { useState } from "react";
import { Play, MapPin, Newspaper, TrendingUp, Github } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

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
	const [userIntent, setUserIntent] = useState<"survival" | "audit" | null>(null);

	// Se usuário escolheu, redireciona
	if (userIntent === "survival") {
		// Pop rua: Direto pro jogo com modo survival
		window.location.href = "/jogar?mode=survival";
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
		window.location.href = "/jogar";
		return (
			<div className="min-h-screen bg-slate-950 flex items-center justify-center">
				<div className="text-violet-400 text-lg font-bold">
					Carregando auditoria social...
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-black text-white relative overflow-hidden">
			{/* Background Image - Realismo Sóbrio */}
			<div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
				<Image
					src="/images/sobrio/landing.png"
					alt="Fundo Realismo Sóbrio - Campinas"
					fill
					priority
					className="object-cover"
					quality={85}
				/>
				<div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/80 to-black" />
			</div>
			{/* Hero Section - Texto Original Político */}
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
							<span className="font-bold"> 362 vagas</span> e uma cidade repleta de{" "}
							<span className="text-red-400">barreiras invisíveis</span>.
						</p>
						<p className="text-slate-300">
							Não somos apenas um mapa; somos uma{" "}
							<strong className="text-white">ferramenta de reconhecimento territorial</strong>{" "}
							que transforma estatísticas em ação direta.
						</p>
					</div>
				</div>
			</header>

			{/* Bifurcação Integrada - TODOS JOGAM */}
			<section className="relative z-10 container mx-auto px-4 py-12">
				<div className="max-w-5xl mx-auto">
					<div className="text-center mb-12">
						<h2 className="text-3xl font-black uppercase mb-4">
							A Invisibilidade é Política de Estado.
							<span className="block text-red-500 mt-2">O Jogo é a Denúncia.</span>
						</h2>
						<p className="text-slate-300 text-lg max-w-3xl mx-auto">
							Simule a jornada de quem vive nas ruas de Campinas. Cada barreira que você
							enfrenta gera um dado real sobre a falha da rede de proteção social{" "}
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
									Modo sobrevivência com mapa de recursos e rotas otimizadas. 100% offline.
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
									Jogue para gerar telemetria anônima que confronta dados oficiais.
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
								Cada escolha no jogo simula uma barreira real: falta de documentos,
								violência institucional ou arquitetura hostil.
							</p>
						</div>

						<div className="space-y-4">
							<div className="w-12 h-12 rounded-full bg-orange-600 flex items-center justify-center text-white font-black text-xl">
								02
							</div>
							<h3 className="text-xl font-bold">O App Audita</h3>
							<p className="text-slate-300">
								Suas decisões geram estatísticas anônimas que confrontamos com os dados
								oficiais da Prefeitura e da FEAC.
							</p>
						</div>

						<div className="space-y-4">
							<div className="w-12 h-12 rounded-full bg-yellow-600 flex items-center justify-center text-white font-black text-xl">
								03
							</div>
							<h3 className="text-xl font-bold">A Cidade Muda</h3>
							<p className="text-slate-300">
								Usamos esses registros para pressionar por políticas públicas reais e
								integrar dados ao ecossistema Wikimedia.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Links Rápidos */}
			<section className="relative z-10 container mx-auto px-4 py-12">
				<div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
					<Link
						href="/transparencia"
						className="group p-6 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-blue-500 transition-all"
					>
						<div className="flex items-center gap-3 mb-3">
							<TrendingUp className="text-blue-400" size={24} />
							<h3 className="text-xl font-bold">Abismo dos Números</h3>
						</div>
						<p className="text-slate-400">
							1.300 oficiais vs 3.000 invisíveis. Veja a auditoria real da rede de
							acolhimento de Campinas.
						</p>
					</Link>

					<Link
						href="/jornal"
						className="group p-6 bg-slate-800/50 border border-slate-700 rounded-xl hover:border-yellow-500 transition-all"
					>
						<div className="flex items-center gap-3 mb-3">
							<Newspaper className="text-yellow-400" size={24} />
							<h3 className="text-xl font-bold">Jornal da Rua</h3>
						</div>
						<p className="text-slate-400">
							"Quanto vale sua cabeça?". Investigações sobre a "Matemática Viciada" da
							assistência social.
						</p>
					</Link>
				</div>
			</section>

			{/* Footer - Dados Soberanos */}
			<footer className="relative z-10 border-t border-slate-800 py-12">
				<div className="container mx-auto px-4">
					<div className="max-w-4xl mx-auto space-y-8">
						<div className="grid md:grid-cols-3 gap-8 text-sm">
							<div>
								<h4 className="font-bold mb-2 text-white">Dados Soberanos</h4>
								<p className="text-slate-400">
									Baseado no Censo Pop Rua 2024 e no Decreto Federal 7.053/2009. Auditoria
									cidadã em tempo real.
								</p>
							</div>
							<div>
								<h4 className="font-bold mb-2 text-white">Campinas / DDD 019</h4>
								<p className="text-slate-400">
									Focado na realidade socioterritorial da Região Metropolitana de Campinas.
								</p>
							</div>
							<div>
								<h4 className="font-bold mb-2 text-white">Versão 0.19.0 (Beta)</h4>
								<p className="text-slate-400">© 2025 Coletivo A Rua Tem Voz</p>
							</div>
						</div>

						<div className="flex flex-wrap gap-4 justify-center text-sm text-slate-400">
							<Link href="/sobre" className="hover:text-white transition-colors">
								Institucional & Impacto
							</Link>
							<Link href="/parcerias" className="hover:text-white transition-colors">
								Para Empresas (ESG)
							</Link>
							<Link href="/curso" className="hover:text-white transition-colors">
								Curso Agilizadores
							</Link>
							<Link href="/transparencia" className="hover:text-white transition-colors">
								Portal da Transparência
							</Link>
						</div>

						<div className="text-center space-y-2">
							<p className="text-slate-400 text-xs">
								Desenvolvido por{" "}
								<a
									href="https://github.com/danielarraesreino"
									target="_blank"
									rel="noopener noreferrer"
									className="text-white hover:text-blue-400 inline-flex items-center gap-1"
								>
									Daniel (Japa/Oclinhos) <Github size={14} />
								</a>
							</p>
							<p className="text-slate-500 text-xs">
								Vibe Coding ⚡ Inovação Social
							</p>
							<p className="text-slate-500 text-xs">
								Tecnologia como instrumento de emancipação.
							</p>
						</div>
					</div>
				</div>
			</footer>
		</div>
	);
}
