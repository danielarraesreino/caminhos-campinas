"use client";

import { ArrowLeft, BookOpen, FileText, Target, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AudioReader } from "@/components/ui/AudioReader";
import { EcoButton } from "@/components/ui/EcoButton";
import SOURCES_DATA from "@/data/sources.json";

export default function SobrePage() {
	return (
		<div className="min-h-screen bg-black text-slate-100 font-sans relative overflow-hidden">
			{/* Background Image */}
			<div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
				<Image
					src="/images/sobrio/landing.png"
					alt="Fundo Sobre - Realismo Sóbrio"
					fill
					priority
					className="object-cover"
					quality={85}
				/>
				<div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black" />
			</div>

			<div className="max-w-4xl mx-auto space-y-8 p-6 pt-24 relative z-10">
				<header className="flex items-center gap-4 border-b border-slate-800 pb-6">
					<Link
						href="/"
						className="p-2 hover:bg-slate-900 rounded-full transition-colors group"
					>
						<ArrowLeft className="w-6 h-6 text-slate-300 group-hover:text-white" />
					</Link>
					<div>
						<h1 className="text-3xl font-black uppercase tracking-tighter text-white">
							Sobre o Projeto
						</h1>
						<div className="flex items-center gap-2">
							<p className="text-slate-400">Tecnologia Social & Dignidade</p>
							<AudioReader text="Manifesto da Invisibilidade. Tecnologia Cívica para Direitos Reais. Nascemos da inconformidade. O Caminhos Campinas não é apenas um guia, é um manifesto técnico." />
						</div>
					</div>
				</header>

				<section className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl space-y-6">
					<h2 className="text-2xl font-bold text-white mb-4">
						Tecnologia Cívica para Direitos Reais
					</h2>
					<div className="prose prose-invert max-w-none text-slate-300 leading-relaxed space-y-6">
						<p>
							Nascemos da inconformidade. O{" "}
							<span className="text-blue-400 font-bold">Caminhos Campinas</span>{" "}
							não é apenas um guia, é um manifesto técnico. O Censo 2024 revelou
							um aumento de <strong>40% na população de rua</strong> em Campinas
							(de 932 para 1.300+ pessoas). Enquanto a narrativa oficial muitas
							vezes higieniza esses dados, nós os auditamos.
						</p>
						<p>
							Ao jogar, você simula a <strong>"Restrição de Agência"</strong>: a
							experiência real de ter suas escolhas limitadas pela{" "}
							<strong>Arquitetura Hostil</strong>, pela burocracia do CadÚnico e
							pela falta crônica de leitos no SAMIM (Déficit de 938 vagas).
						</p>
						<p>
							Baseamos nossa denúncia na{" "}
							<strong>Lei Padre Júlio Lancellotti (Lei 14.489/22)</strong>, que
							proíbe o uso de materiais, estruturas e técnicas construtivas
							hostis em espaços livres de uso público. O que a cidade chama de
							"design", nós revelamos como exclusão deliberada.
						</p>

						<h3 className="text-xl font-bold text-white mt-8 mb-4">
							Nossa Missão: Do Censo ao Commons
						</h3>
						<p>
							Transformamos estatísticas frias em agência política. Nossos dados
							são <strong>Bens Públicos Digitais</strong>, integrados ao
							ecossistema global da <strong>Wikimedia/Wikidata</strong> para
							garantir que a invisibilidade nunca seja uma opção política
							aceitável.
						</p>
					</div>
				</section>

				<section className="grid md:grid-cols-2 gap-6">
					<div className="bg-blue-900/20 border border-blue-800/50 p-6 rounded-xl">
						<BookOpen className="w-8 h-8 text-blue-400 mb-4" />
						<h3 className="font-bold text-xl text-white mb-2">Fundamentação</h3>
						<p className="text-slate-400 text-sm">
							Inspirado na pedagogia de Paulo Freire, utilizamos a tecnologia
							como meio de leitura do mundo e libertação.
						</p>
					</div>
					<div className="bg-purple-900/20 border border-purple-800/50 p-6 rounded-xl">
						<Target className="w-8 h-8 text-purple-400 mb-4" />
						<h3 className="font-bold text-xl text-white mb-2">ODS ONU</h3>
						<p className="text-slate-400 text-sm">
							Alinhado aos objetivos 1 (Erradicação da Pobreza) e 10 (Redução
							das Desigualdades).
						</p>
					</div>
				</section>

				<section className="bg-slate-900/80 border border-yellow-500/30 p-8 rounded-2xl space-y-6 relative overflow-hidden">
					<div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
					<h2 className="text-2xl font-bold text-yellow-400 mb-4 relative z-10">
						Transparência Pedagógica
					</h2>
					<div className="prose prose-invert max-w-none text-slate-300 leading-relaxed space-y-4 relative z-10">
						<p className="italic text-lg">
							"Você sabe o que é o 'corró'. Você sabe onde o frio dói mais. Essa
							sabedoria não é apenas sobrevivência; é{" "}
							<strong>TECNOLOGIA SOCIAL</strong>. O Coletivo A Rua Tem Voz
							transforma vivência em qualificação técnica (Redução de Danos)."
						</p>
					</div>
					<div className="pt-4 relative z-10">
						<EcoButton
							variant="primary"
							size="lg"
							className="w-full sm:w-auto gap-3 font-bold bg-yellow-500 text-black hover:bg-yellow-400 border-yellow-400"
							onClick={() =>
								window.open(
									"/downloads/projeto-pedagogico-completo.docx",
									"_blank",
								)
							}
						>
							<FileText className="w-5 h-5" />
							Baixar Projeto Pedagógico Original (.DOCX)
						</EcoButton>
					</div>
				</section>

				{/* Fontes e Canais Section */}
				<section className="space-y-6 pt-8 border-t border-slate-800">
					<h2 className="text-2xl font-bold text-white flex items-center gap-2">
						<BookOpen className="w-6 h-6 text-blue-400" />
						Fontes & Referências
					</h2>
					<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
						<div className="bg-slate-900/40 p-6 rounded-xl border border-slate-800">
							<h3 className="text-emerald-400 font-bold mb-4 flex items-center gap-2">
								<FileText size={18} /> Manuais Técnicos
							</h3>
							<ul className="space-y-3">
								{SOURCES_DATA.manuals.map(
									(
										item: { url: string; title: string; source: string },
										_idx: number,
									) => (
										<li key={item.url}>
											<Link
												href={item.url}
												target="_blank"
												className="block text-sm text-slate-300 hover:text-emerald-300 hover:underline"
											>
												{item.title}
											</Link>
											<span className="text-xs text-slate-500 block mt-1">
												{item.source}
											</span>
										</li>
									),
								)}
							</ul>
						</div>

						<div className="bg-slate-900/40 p-6 rounded-xl border border-slate-800">
							<h3 className="text-blue-400 font-bold mb-4 flex items-center gap-2">
								<Target size={18} /> Reportagens
							</h3>
							<ul className="space-y-3">
								{SOURCES_DATA.news_reports.map(
									(
										item: { url: string; title: string; source: string },
										_idx: number,
									) => (
										<li key={item.url}>
											<Link
												href={item.url}
												target="_blank"
												className="block text-sm text-slate-300 hover:text-blue-300 hover:underline"
											>
												{item.title}
											</Link>
											<span className="text-xs text-slate-500 block mt-1">
												{item.source}
											</span>
										</li>
									),
								)}
							</ul>
						</div>

						<div className="bg-slate-900/40 p-6 rounded-xl border border-slate-800">
							<h3 className="text-purple-400 font-bold mb-4 flex items-center gap-2">
								<Users size={18} /> Multimídia & Podcasts
							</h3>
							<ul className="space-y-3">
								{SOURCES_DATA.multimedia.map(
									(
										item: { url: string; title: string; type: string },
										_idx: number,
									) => (
										<li key={item.url}>
											<Link
												href={item.url}
												target="_blank"
												className="block text-sm text-slate-300 hover:text-purple-300 hover:underline"
											>
												{item.title}
											</Link>
											<span className="text-xs text-slate-500 block mt-1">
												{item.type}
											</span>
										</li>
									),
								)}
							</ul>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}
