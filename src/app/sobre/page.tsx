import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SobrePage() {
	return (
		<div className="min-h-screen bg-slate-950 text-slate-300 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-3xl mx-auto space-y-12">
				{/* Header Section */}
				<div className="text-center space-y-4">
					<div className="inline-block bg-blue-900/30 text-blue-400 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider border border-blue-800">
						O Manifesto
					</div>
					<h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
						Sobre o Projeto
					</h1>
					<p className="text-xl text-slate-400 max-w-2xl mx-auto">
						Tecnologia Social para dar voz, visibilidade e dignidade.
					</p>
				</div>

				{/* Content */}
				<article className="prose prose-invert prose-lg mx-auto bg-slate-900/50 p-8 rounded-3xl border border-slate-800 shadow-xl">
					<h3 className="text-white font-bold text-2xl">
						A Invisibilidade é uma Escolha?
					</h3>
					<p>
						Este não é apenas um jogo. É uma ferramenta de{" "}
						<strong className="text-blue-400">
							conscientização e sobrevivência
						</strong>
						.
					</p>
					<p>
						Baseado em dados reais da cidade de Campinas (SP), este aplicativo
						tem dois objetivos fundamentais:
					</p>

					<div className="grid md:grid-cols-2 gap-6 my-8 not-prose">
						<div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
							<h4 className="text-blue-400 font-bold mb-2 uppercase tracking-wide text-sm">
								Para quem joga (Empatia)
							</h4>
							<p className="text-sm text-slate-300">
								Sentir na pele os dilemas diários de quem vive na rua. A fome, o
								frio, a burocracia do estado e os olhares de julgamento.
							</p>
						</div>
						<div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
							<h4 className="text-green-400 font-bold mb-2 uppercase tracking-wide text-sm">
								Para quem vive (Utilidade)
							</h4>
							<p className="text-sm text-slate-300">
								Funciona como um mapa offline real conectando serviços
								essenciais (Centro Pop, Bom Prato, Abrigos) a quem mais precisa.
							</p>
						</div>
					</div>

					<blockquote className="border-l-4 border-yellow-500 pl-4 italic text-yellow-200/80 bg-yellow-900/10 p-4 rounded-r-xl">
						"Não olhe para o outro lado. Olhe nos olhos."
					</blockquote>

					<h4 className="text-white font-bold mt-8">Tecnologia Social</h4>
					<p>
						Desenvolvido como PWA (Progressive Web App) para rodar em qualquer
						celular, otimizado para baixo consumo de dados e funcionamento
						offline. Uma resposta técnica para um problema humano severo.
					</p>
				</article>

				{/* Footer CTA */}
				<div className="text-center pt-8">
					<Link href="/apoie">
						<Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg rounded-xl font-bold shadow-lg shadow-blue-900/20">
							Seja um Apoiador do Projeto
						</Button>
					</Link>
				</div>
			</div>
		</div>
	);
}
