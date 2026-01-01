"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, FileText, Target, Users } from "lucide-react";
import { EcoButton } from "@/components/ui/EcoButton";

export default function SobrePage() {
	return (
		<div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
			<div className="max-w-4xl mx-auto space-y-8 p-6 pt-24">
				<header className="flex items-center gap-4 border-b border-slate-800 pb-6">
					<Link href="/" className="p-2 hover:bg-slate-900 rounded-full transition-colors group">
						<ArrowLeft className="w-6 h-6 text-slate-400 group-hover:text-white" />
					</Link>
					<div>
						<h1 className="text-3xl font-black uppercase tracking-tighter text-white">
							Sobre o Projeto
						</h1>
						<p className="text-slate-400">Tecnologia Social & Dignidade</p>
					</div>
				</header>

				<section className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl space-y-6">
					<h2 className="text-2xl font-bold text-white mb-4">O Manifesto</h2>
					<div className="prose prose-invert max-w-none text-slate-300 leading-relaxed space-y-4">
						<p>
							O <span className="text-blue-400 font-bold">Caminhos Campinas</span> não é apenas um jogo; é uma ferramenta de auditoria sociotécnica.
							Baseado nos dados do Censo 2024, que identificou <strong>1.557 pessoas em situação de rua</strong> na cidade,
							e na teoria de Milton Santos sobre a cidadania mutilada, criamos uma simulação que expõe as barreiras invisíveis da burocracia.
						</p>
						<p>
							Nosso objetivo é duplo:
						</p>
						<ul className="grid md:grid-cols-2 gap-4 not-prose">
							<li className="bg-slate-800 p-4 rounded-xl border border-slate-700">
								<strong className="text-white flex items-center gap-2 mb-2">
									<Users className="w-4 h-4 text-purple-400" /> Para a Sociedade
								</strong>
								Gerar empatia através da simulação da escassez (fome, frio, falta de bateria).
							</li>
							<li className="bg-slate-800 p-4 rounded-xl border border-slate-700">
								<strong className="text-white flex items-center gap-2 mb-2">
									<Target className="w-4 h-4 text-emerald-400" /> Para a Gestão Pública
								</strong>
								Gerar dados sobre onde a rede de proteção falha (gaps de serviço).
							</li>
						</ul>
					</div>
					<div className="pt-4 mt-4 border-t border-slate-800">
						<p className="text-xs text-slate-500 italic">
							Fontes: Censo FEAC 2024, Auditoria Sociotécnica.
						</p>
					</div>
				</section>

				<section className="grid md:grid-cols-2 gap-6">
					<div className="bg-blue-900/20 border border-blue-800/50 p-6 rounded-xl">
						<BookOpen className="w-8 h-8 text-blue-400 mb-4" />
						<h3 className="font-bold text-xl text-white mb-2">Fundamentação</h3>
						<p className="text-slate-400 text-sm">
							Inspirado na pedagogia de Paulo Freire, utilizamos a tecnologia como meio de leitura do mundo e libertação.
						</p>
					</div>
					<div className="bg-purple-900/20 border border-purple-800/50 p-6 rounded-xl">
						<Target className="w-8 h-8 text-purple-400 mb-4" />
						<h3 className="font-bold text-xl text-white mb-2">ODS ONU</h3>
						<p className="text-slate-400 text-sm">
							Alinhado aos objetivos 1 (Erradicação da Pobreza) e 10 (Redução das Desigualdades).
						</p>
					</div>
				</section>

				<section className="bg-slate-900/80 border border-yellow-500/30 p-8 rounded-2xl space-y-6 relative overflow-hidden">
					<div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
					<h2 className="text-2xl font-bold text-yellow-400 mb-4 relative z-10">Transparência Pedagógica</h2>
					<div className="prose prose-invert max-w-none text-slate-300 leading-relaxed space-y-4 relative z-10">
						<p className="italic text-lg">
							"Você sabe o que é o 'corró'. Você sabe onde o frio dói mais. Essa sabedoria não é apenas sobrevivência; é <strong>TECNOLOGIA SOCIAL</strong>.
							O Coletivo A Rua Tem Voz transforma vivência em qualificação técnica (Redução de Danos)."
						</p>
					</div>
					<div className="pt-4 relative z-10">
						<EcoButton
							variant="primary"
							size="lg"
							className="w-full sm:w-auto gap-3 font-bold bg-yellow-500 text-black hover:bg-yellow-400 border-yellow-400"
							onClick={() => window.open('/downloads/projeto-pedagogico-completo.docx', '_blank')}
						>
							<FileText className="w-5 h-5" />
							Baixar Projeto Pedagógico Original (.DOCX)
						</EcoButton>
					</div>
				</section>
			</div>
		</div>
	);
}
