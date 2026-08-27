import { Instagram } from "lucide-react";
import NextImage from "next/image";

export function Footer() {
	return (
		<footer className="bg-slate-900 text-slate-300 py-12 border-t border-slate-800">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col md:flex-row justify-between items-center gap-8">
					<div className="text-center md:text-left">
						<div className="flex justify-center md:justify-start mb-4">
							<NextImage
								width={100}
								height={100}
								src="/logo-cropped.png"
								alt="Logo Caminhos Campinas"
								className="w-24 h-auto object-contain opacity-90 hover:opacity-100 transition-opacity"
							/>
						</div>
						<p className="text-sm max-w-xs mt-4">
							Uma iniciativa para transformar a realidade das ruas através da
							tecnologia social.
						</p>
					</div>

					<div className="flex flex-col items-center md:items-start text-center md:text-left">
						<span className="text-sm font-bold text-slate-200 mb-4 uppercase tracking-wider">
							Institucional & Impacto
						</span>
						<nav className="flex flex-col gap-2 text-sm">
							<a
								href="/parceiros"
								className="text-slate-300 hover:text-blue-400 transition-colors py-2 min-h-[32px] flex items-center"
								aria-label="Ir para Parceiros e ESG"
							>
								Para Empresas (ESG)
							</a>
							<a
								href="/curso"
								className="text-slate-300 hover:text-yellow-400 transition-colors py-2 min-h-[32px] flex items-center"
								aria-label="Ir para Curso de Agilizadores"
							>
								Curso Agilizadores
							</a>
							<a
								href="/transparencia"
								className="text-slate-300 hover:text-emerald-400 transition-colors py-2 min-h-[32px] flex items-center"
								aria-label="Ir para Portal da Transparência"
							>
								Portal da Transparência
							</a>
							<a
								href="/auditoria/validar"
								className="text-slate-300 hover:text-red-400 transition-colors text-xs mt-2 py-3 min-h-[40px] flex items-center"
								aria-label="Área Técnica e Acesso Restrito"
							>
								Área Técnica (Restrito)
							</a>
						</nav>
					</div>

					<div className="flex flex-col items-center">
						<span className="text-sm font-medium text-slate-300 mb-2">
							Siga o Coletivo
						</span>
						<a
							href="https://www.instagram.com/coletivoaruatemvoz"
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-2 text-white hover:text-pink-500 transition-colors bg-slate-800 px-4 py-3 rounded-full"
							aria-label="Siga o Coletivo A Rua Tem Voz no Instagram"
						>
							<Instagram className="h-5 w-5" aria-hidden="true" />
							<span className="font-bold">@COLETIVOARUATEMVOZ</span>
						</a>
					</div>
				</div>
				<div className="mt-12 pt-8 border-t border-slate-800 text-center text-xs flex flex-col items-center">
					<p className="mb-6 text-slate-300">
						&copy; 2025 Coletivo A Rua Tem Voz. Tecnologia como instrumento de
						emancipação.
					</p>

					<div className="flex items-center gap-4 bg-slate-800/50 px-6 py-3 rounded-full border border-slate-700/50 hover:bg-slate-800 transition-colors group">
						<div className="relative">
							<NextImage
								src="/daniel_dev.jpg"
								alt=""
								aria-hidden="true"
								width={80}
								height={80}
								className="rounded-full border-2 border-slate-600 group-hover:border-blue-500 transition-colors object-cover object-center"
							/>
							<div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></div>
						</div>
						<div className="text-left">
							<p className="text-slate-300 font-bold group-hover:text-white transition-colors">
								Desenvolvido por Daniel (Japa/Oclinhos)
							</p>
							<p className="text-slate-300 text-[10px] uppercase tracking-wider group-hover:text-blue-400 transition-colors">
								Vibe Coding &boxvh; Inovação Social
							</p>
						</div>
					</div>

					<p className="mt-6 text-slate-300 italic max-w-sm">
						"Informação é a libertação real, única e verdadeira."
					</p>
				</div>
			</div>
		</footer>
	);
}
