import { AlertTriangle, Briefcase, Info, Users } from "lucide-react";
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
		<div className="min-h-screen bg-slate-50 pb-20">
			{/* Header */}
			<div className="bg-slate-900 text-white py-16 px-4">
				<div className="max-w-4xl mx-auto text-center space-y-4">
					<h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
						Transparência Radical
					</h1>
					<p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto">
						Este projeto opera sob a lógica de{" "}
						<strong>Economia Solidária</strong> e{" "}
						<strong>Responsabilidade Institucional</strong>.
					</p>
				</div>
			</div>

			<div className="max-w-4xl mx-auto px-4 -mt-10">
				{/* PILAR INSTITUCIONAL */}
				<Card className="shadow-xl border-t-4 border-t-green-600 mb-8">
					<CardHeader>
						<div className="flex items-center gap-3 mb-2">
							<div className="p-3 bg-green-100 rounded-full text-green-700">
								<Users size={24} />
							</div>
							<div>
								<CardTitle className="text-2xl font-bold text-slate-800">
									Fundo Institucional
								</CardTitle>
								<CardDescription>Quem Recebe?</CardDescription>
							</div>
						</div>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg flex gap-3 items-start">
							<AlertTriangle className="text-yellow-600 shrink-0" size={20} />
							<div className="text-sm text-yellow-800">
								<span className="font-bold">
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
							<div className="flex justify-between text-xs font-bold uppercase text-slate-500">
								<span>Arrecadado: R$ 0,00</span>
								<span>Meta Piloto: R$ 13.970,00</span>
							</div>
							<Progress value={0} className="h-3" />
						</div>

						<div className="p-4 bg-slate-100 rounded-lg text-sm text-slate-600">
							<p className="font-semibold mb-2">
								Destino dos Recursos (Futuro):
							</p>
							<ul className="list-disc pl-4 space-y-1">
								<li>Bolsas para 20 alunos (Agilizadores Sociais)</li>
								<li>Alimentação e Transporte</li>
								<li>Formatura e Certificação</li>
							</ul>
						</div>
					</CardContent>
				</Card>

				{/* ECONOMIA SOLIDÁRIA */}
				<Card className="shadow-md">
					<CardHeader>
						<div className="flex items-center gap-3 mb-2">
							<div className="p-3 bg-blue-100 rounded-full text-blue-700">
								<Briefcase size={24} />
							</div>
							<div>
								<CardTitle className="text-xl font-bold text-slate-800">
									Economia Solidária
								</CardTitle>
								<CardDescription>Como o projeto existe hoje?</CardDescription>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<div className="flex gap-4 items-start">
							<Info className="text-blue-500 shrink-0 mt-1" size={20} />
							<p className="text-slate-600">
								Os palestrantes e profissionais técnicos deste projeto
								(Programadores, Psicólogos) <strong>doaram seus cachês</strong>.
								O valor de mercado dessas horas de trabalho será convertido em
								"Crédito Social" para financiar diretamente a alimentação e o
								transporte da primeira turma de alunos assim que o fundo estiver
								operacional.
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
