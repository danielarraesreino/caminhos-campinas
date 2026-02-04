import { AlertTriangle, Briefcase, Info, Users } from "lucide-react";
import Image from "next/image";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function ApoiePage() {
	return (
		<main className="min-h-screen bg-black text-white font-sans relative overflow-hidden">
			{/* Background Image */}
			<div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
				<Image
					src="/images/sobrio/recursos.png"
					alt="Fundo Apoie - Realismo Sóbrio"
					fill
					priority
					className="object-cover"
					quality={85}
				/>
				<div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black" />
			</div>

			<div className="relative z-10 pt-24 pb-20 max-w-4xl mx-auto px-4 space-y-12">
				{/* Header */}
				<div className="text-center space-y-4">
					<h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white">
						Transparência Radical
					</h1>
					<p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto">
						Este projeto opera sob a lógica de{" "}
						<strong className="text-green-400">Economia Solidária</strong> e{" "}
						<strong className="text-blue-400">Responsabilidade Institucional</strong>.
					</p>
				</div>

				{/* PILAR INSTITUCIONAL */}
				<Card className="border-t-4 border-t-green-600 shadow-xl bg-slate-900/80 backdrop-blur-sm border-x border-b border-slate-800">
					<CardHeader>
						<div className="flex items-center gap-4">
							<div className="p-3 bg-green-900/40 rounded-lg text-green-400 border border-green-500/20">
								<Users size={32} />
							</div>
							<div>
								<CardTitle className="text-2xl font-bold text-white">
									Fundo Institucional
								</CardTitle>
								<CardDescription className="text-slate-400">Quem Recebe?</CardDescription>
							</div>
						</div>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="p-4 border border-yellow-500/30 bg-yellow-900/10 rounded-lg flex gap-3 items-start">
							<AlertTriangle className="text-yellow-500 shrink-0" size={20} />
							<div className="text-sm text-yellow-200">
								<span className="font-bold text-yellow-400">
									Status: Em Constituição de Fundo.
								</span>
								<br />
								Este projeto não recebe doações na conta de pessoa física.
								Estamos formalizando o convênio para que todo recurso seja
								gerido por uma instituição auditada (Ex: Fundação FEAC, Cândido
								Ferreira ou Associação Parceira do CAPS).
							</div>
						</div>

						<div className="space-y-2">
							<div className="flex justify-between text-xs font-bold uppercase text-slate-400">
								<span>Arrecadado: R$ 0,00</span>
								<span>Meta Piloto: R$ 13.970,00</span>
							</div>
							<Progress value={0} className="h-3 bg-slate-800" indicatorClassName="bg-green-500" />
						</div>

						<div className="p-4 bg-slate-900 rounded-lg text-sm text-slate-300 border border-slate-800">
							<p className="font-semibold mb-2 text-white">
								Destino dos Recursos (Futuro):
							</p>
							<ul className="list-disc pl-4 space-y-1 text-slate-400">
								<li>Bolsas para 20 alunos (Agilizadores Sociais)</li>
								<li>Alimentação e Transporte</li>
								<li>Formatura e Certificação</li>
							</ul>
						</div>
					</CardContent>
				</Card>

				{/* ECONOMIA SOLIDÁRIA */}
				<Card className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 shadow-lg">
					<CardHeader>
						<div className="flex items-center gap-4">
							<div className="p-3 bg-blue-900/40 rounded-lg text-blue-400 border border-blue-500/20">
								<Briefcase size={32} />
							</div>
							<div>
								<CardTitle className="text-xl font-bold text-white">
									Economia Solidária
								</CardTitle>
								<CardDescription className="text-slate-400">Como o projeto existe hoje?</CardDescription>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<div className="flex gap-4 items-start">
							<Info className="text-blue-400 shrink-0 mt-1" size={20} />
							<p className="text-slate-300 leading-relaxed">
								Os palestrantes e profissionais técnicos deste projeto
								(Programadores, Psicólogos) <strong className="text-white">doaram seus cachês</strong>.
								O valor de mercado dessas horas de trabalho será convertido em
								"Crédito Social" para financiar diretamente a alimentação e o
								transporte da primeira turma de alunos assim que o fundo estiver
								operacional.
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</main>
	);
}
