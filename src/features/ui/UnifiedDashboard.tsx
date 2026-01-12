"use client";

import {
	BarChart3,
	BookOpen,
	Gamepad2,
	HeartHandshake,
	MapPin,
	Newspaper,
	Shield,
} from "lucide-react";
import Link from "next/link";

export function UnifiedDashboard() {
	return (
		<div className="min-h-screen bg-slate-950 text-white font-sans selection:bg-blue-500/30">
			{/* Header */}
			<header className="py-8 px-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-10">
				<div className="max-w-6xl mx-auto flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
							Campinas Invisível{" "}
							<span className="text-slate-500 text-sm">| Auditoria</span>
						</h1>
						<p className="text-slate-400 text-xs mt-1">
							Dados Abertos & Defesa de Direitos Humanos
						</p>
					</div>
					<div className="flex items-center gap-2 text-xs font-mono text-slate-400">
						<span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
						INFRAESTRUTURA CÍVICA
					</div>
				</div>
			</header>

			{/* Main Grid */}
			<main className="max-w-6xl mx-auto px-6 py-12">
				{/* Intro Section - New Strategic Vision */}
				<div className="mb-12 border-l-4 border-blue-500 pl-6 py-2">
					<h2 className="text-4xl font-black uppercase tracking-tighter text-white mb-2">
						A Invisibilidade é uma{" "}
						<span className="text-blue-500">Escolha Política.</span>
					</h2>
					<p className="text-slate-400 text-lg max-w-3xl leading-relaxed">
						1.300 vidas, 362 vagas e uma cidade repleta de barreiras invisíveis.
						Não somos apenas um mapa; somos uma ferramenta de reconhecimento
						territorial que transforma estatísticas em ação direta.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
					{/* Card 1: JOGAR (Hero) */}
					<Link
						href="/jogar"
						className="group relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-8 hover:border-blue-500/50 transition-all duration-300 shadow-2xl hover:shadow-blue-900/20 col-span-1 md:col-span-2 lg:col-span-1 aspect-video lg:aspect-auto flex flex-col justify-between"
					>
						<div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent group-hover:from-blue-600/20 transition-all"></div>
						<div className="relative z-10">
							<div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center mb-4 text-blue-400 group-hover:text-blue-300 group-hover:scale-110 transition-transform">
								<Gamepad2 size={24} />
							</div>
							<h2 className="text-2xl md:text-3xl font-black mb-2 uppercase tracking-tight leading-tight">
								A Invisibilidade é Política de Estado.
								<span className="block text-red-400">O Jogo é a Denúncia.</span>
							</h2>
							<p className="text-slate-400 max-w-md text-sm">
								Simule a jornada de quem vive nas ruas de Campinas. Cada
								barreira que você enfrenta gera um{" "}
								<strong className="text-white">dado real</strong> sobre a falha
								da rede de proteção social (ODS 1, 3 e 11).
							</p>
						</div>
						<div className="relative z-10 mt-6 flex items-center gap-2 text-blue-400 font-bold uppercase text-sm tracking-widest">
							Iniciar Auditoria Social{" "}
							<span className="group-hover:translate-x-1 transition-transform">
								→
							</span>
						</div>
					</Link>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
						{/* Card 2: DADOS (Auditoria) */}
						<Link
							href="/impacto"
							className="group relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-8 hover:border-red-500/50 transition-all duration-300 shadow-xl hover:shadow-red-900/10 flex flex-col justify-between"
						>
							<div className="absolute inset-0 bg-gradient-to-br from-red-600/10 to-transparent group-hover:from-red-600/20 transition-all"></div>
							<div className="relative z-10">
								<div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center mb-4 text-red-400">
									<BarChart3 size={20} />
								</div>
								<h2 className="text-xl font-bold mb-2 uppercase text-white">
									Abismo dos Números
								</h2>
								<p className="text-slate-400 text-sm">
									1.300 oficiais vs 3.000 invisíveis. Veja a auditoria real da
									rede de acolhimento de Campinas.
								</p>
							</div>
						</Link>

						{/* Card 3: JORNAL (Investigação) */}
						<Link
							href="/jornal"
							className="group relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-8 hover:border-purple-500/50 transition-all duration-300 shadow-xl hover:shadow-purple-900/10 flex flex-col justify-between"
						>
							<div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent group-hover:from-purple-600/20 transition-all"></div>
							<div className="relative z-10">
								<div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4 text-purple-400">
									<Newspaper size={20} />
								</div>
								<h2 className="text-xl font-bold mb-2 uppercase text-white">
									Jornal da Rua
								</h2>
								<p className="text-slate-400 text-sm">
									"Quanto vale sua cabeça?". Investigações sobre a "Matemática
									Viciada" da assistência social.
								</p>
							</div>
						</Link>
					</div>
				</div>

				{/* Nova Seção: Como Funciona a Auditoria */}
				<section className="grid grid-cols-1 md:grid-cols-3 gap-12 py-12 border-y border-slate-800">
					<div className="space-y-4">
						<div className="text-blue-500 font-bold text-4xl">01</div>
						<h3 className="text-xl font-bold text-white uppercase tracking-tight">
							Você Joga
						</h3>
						<p className="text-slate-400 text-sm leading-relaxed">
							Cada escolha no jogo simula uma barreira real: falta de
							documentos, violência institucional ou arquitetura hostil.
						</p>
					</div>
					<div className="space-y-4">
						<div className="text-red-500 font-bold text-4xl">02</div>
						<h3 className="text-xl font-bold text-white uppercase tracking-tight">
							O App Audita
						</h3>
						<p className="text-slate-400 text-sm leading-relaxed">
							Suas decisões geram estatísticas anônimas que confrontamos com os
							dados oficiais da Prefeitura e da FEAC.
						</p>
					</div>
					<div className="space-y-4">
						<div className="text-emerald-500 font-bold text-4xl">03</div>
						<h3 className="text-xl font-bold text-white uppercase tracking-tight">
							A Cidade Muda
						</h3>
						<p className="text-slate-400 text-sm leading-relaxed">
							Usamos esses registros para pressionar por políticas públicas
							reais e integrar dados ao ecossistema Wikimedia.
						</p>
					</div>
				</section>

				{/* Footer Info */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-slate-300 text-sm mb-12">
					<div>
						<h3 className="font-bold text-slate-100 mb-2 flex items-center gap-2">
							<Shield size={14} /> DADOS SOBERANOS
						</h3>
						<p>
							Baseado no Censo Pop Rua 2024 e no Decreto Federal 7.053/2009.
							Auditoria cidadã em tempo real.
						</p>
					</div>
					<div>
						<h3 className="font-bold text-slate-100 mb-2 flex items-center gap-2">
							<MapPin size={14} /> CAMPINAS / DDD 019
						</h3>
						<p>
							Focado na realidade socioterritorial da Região Metropolitana de
							Campinas.
						</p>
					</div>
					<div>
						<p className="text-slate-400">Versão 0.19.0 (Beta)</p>
						<p className="text-slate-400">&copy; 2024 Coletivo A Rua Tem Voz</p>
					</div>
				</div>
			</main>
		</div>
	);
}
