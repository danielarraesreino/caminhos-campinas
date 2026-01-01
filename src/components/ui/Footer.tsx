import { Instagram } from "lucide-react";

export function Footer() {
	return (
		<footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex flex-col md:flex-row justify-between items-center gap-8">
					<div className="text-center md:text-left">
						<h4 className="text-white text-lg font-bold mb-2">
							Caminhos Campinas
						</h4>
						<p className="text-sm max-w-xs">
							Uma iniciativa para transformar a realidade das ruas através da
							tecnologia social.
						</p>
					</div>

					<div className="flex flex-col items-center">
						<span className="text-sm font-medium text-slate-400 mb-2">
							Siga o Coletivo
						</span>
						<a
							href="https://www.instagram.com/coletivoaruatemvoz"
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-2 text-white hover:text-pink-500 transition-colors bg-slate-800 px-4 py-2 rounded-full"
						>
							<Instagram className="h-5 w-5" />
							@COLETIVOARUATEMVOZ
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
							<img
								src="/daniel_dev.jpg"
								alt="Daniel (Japa)"
								className="w-20 h-20 rounded-full border-2 border-slate-600 group-hover:border-blue-500 transition-colors object-cover object-center"
							/>
							<div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-900 rounded-full"></div>
						</div>
						<div className="text-left">
							<p className="text-slate-300 font-bold group-hover:text-white transition-colors">
								Desenvolvido por Daniel (Japa/Oclinhos)
							</p>
							<p className="text-slate-400 text-[10px] uppercase tracking-wider group-hover:text-blue-400 transition-colors">
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
