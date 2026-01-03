"use client";

import {
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
							Caminhos CPS <span className="text-slate-500 text-sm">| 019</span>
						</h1>
						<p className="text-slate-400 text-xs mt-1">
							Tecnologia Social & Sobrevivência
						</p>
					</div>
					<div className="flex items-center gap-2 text-xs font-mono text-slate-500">
						<span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
						SISTEMA ONLINE
					</div>
				</div>
			</header>

			{/* Main Grid */}
			<main className="max-w-6xl mx-auto px-6 py-12">
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
							<h2 className="text-3xl font-black mb-2 uppercase italic tracking-tight">
								Jogar Simulador
							</h2>
							<p className="text-slate-400 max-w-sm">
								Entre na pele de quem vive nas ruas de Campinas. Enfrente
								dilemas reais, sobreviva à burocracia e busque a autonomia.
							</p>
						</div>
						<div className="relative z-10 mt-6 flex items-center gap-2 text-blue-400 font-bold uppercase text-sm tracking-widest">
							Iniciar Jornada{" "}
							<span className="group-hover:translate-x-1 transition-transform">
								→
							</span>
						</div>
					</Link>

					{/* Card 2: BLOG (Informar) */}
					<Link
						href="/jornal"
						className="group relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-8 hover:border-purple-500/50 transition-all duration-300 shadow-xl hover:shadow-purple-900/10 flex flex-col justify-between"
					>
						<div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent group-hover:from-purple-600/20 transition-all"></div>
						<div className="relative z-10">
							<div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center mb-4 text-purple-400">
								<Newspaper size={20} />
							</div>
							<h2 className="text-xl font-bold mb-2">Jornal da Rua</h2>
							<p className="text-slate-400 text-sm">
								Notícias, denúncias de violência e tradução de leis (Padre
								Júlio, LOAS) para linguagem acessível.
							</p>
						</div>
					</Link>

					{/* Card 3: CURSO (Aprender) */}
					<Link
						href="/curso"
						className="group relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-8 hover:border-emerald-500/50 transition-all duration-300 shadow-xl hover:shadow-emerald-900/10 flex flex-col justify-between"
					>
						<div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-transparent group-hover:from-emerald-600/20 transition-all"></div>
						<div className="relative z-10">
							<div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400">
								<BookOpen size={20} />
							</div>
							<h2 className="text-xl font-bold mb-2">Formação</h2>
							<p className="text-slate-400 text-sm">
								Área educativa para Redutores de Danos e Agentes de Saúde.
								Cursos sobre direitos e cidadania.
							</p>
						</div>
					</Link>

					{/* Card 4: HUB (Apoiar) */}
					<Link
						href="/hub"
						className="group relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-8 hover:border-pink-500/50 transition-all duration-300 shadow-xl hover:shadow-pink-900/10 flex flex-col justify-between lg:col-span-1"
					>
						<div className="absolute inset-0 bg-gradient-to-br from-pink-600/10 to-transparent group-hover:from-pink-600/20 transition-all"></div>
						<div className="relative z-10">
							<div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center mb-4 text-pink-400">
								<HeartHandshake size={20} />
							</div>
							<h2 className="text-xl font-bold mb-2">Rede de Apoio</h2>
							<p className="text-slate-400 text-sm">
								Mapa de ONGs, cadastro de parceiros e recursos para doadores.
								Conecte-se com quem faz a diferença.
							</p>
						</div>
					</Link>
				</div>

				{/* Footer Info */}
				<div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-slate-800 pt-8 text-slate-400 text-sm">
					<div>
						<h3 className="font-bold text-slate-300 mb-2 flex items-center gap-2">
							<Shield size={14} /> Dados Seguros
						</h3>
						<p>
							Plataforma em conformidade com LGPD. Seus dados são anônimos e
							focados em impacto social.
						</p>
					</div>
					<div>
						<h3 className="font-bold text-slate-300 mb-2 flex items-center gap-2">
							<MapPin size={14} /> Campinas / SP
						</h3>
						<p>
							Focado na realidade do DDD 019. Dados baseados no Censo Pop Rua
							2024.
						</p>
					</div>
					<div>
						<p className="text-slate-600">Versão 0.19.0 (Beta)</p>
						<p className="text-slate-600">&copy; 2024 Coletivo A Rua Tem Voz</p>
					</div>
				</div>
			</main>
		</div>
	);
}
