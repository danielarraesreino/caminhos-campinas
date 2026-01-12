import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import dilemmas from "@/data/dilemmas-campinas.json";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default async function ColaborarPage() {
	const session = await auth();

	if (!session) {
		redirect("/api/auth/signin?callbackUrl=/colaborar");
	}

	return (
		<div className="min-h-screen bg-slate-50 pb-20 pt-24 px-4">
			<div className="max-w-6xl mx-auto">
				<div className="mb-8">
					<Badge
						variant="outline"
						className="mb-2 border-blue-500 text-blue-700 bg-blue-50"
					>
						Acesso Restrito: Curadoria Técnica
					</Badge>
					<h1 className="text-3xl font-black text-slate-900 mb-2">
						Validação de Cenários
					</h1>
					<p className="text-slate-600 max-w-2xl">
						Bem-vindo(a),{" "}
						<span className="font-bold text-slate-900">
							{session.user?.name}
						</span>
						. Sua missão é auditar os dilemas abaixo para garantir a precisão
						técnica e o respeito à realidade das ruas.
					</p>
				</div>

				<div className="grid md:grid-cols-2 gap-6">
					<div className="space-y-6">
						<Card className="border-l-4 border-l-blue-600">
							<CardHeader>
								<CardTitle>Painel do Especialista</CardTitle>
								<CardDescription>Critérios de Validação</CardDescription>
							</CardHeader>
							<CardContent className="text-sm text-slate-600 space-y-2">
								<p>
									1. <strong>Realismo Sóbrio:</strong> O dilema reflete a
									burocracia/barreira real?
								</p>
								<p>
									2. <strong>Terminologia:</strong> Os termos (ex: "Pop Rua",
									"Redução de Danos") estão corretos?
								</p>
								<p>
									3. <strong>Impacto:</strong> As consequências (Saúde, Moral)
									são plausíveis?
								</p>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Suas Validações Pendentes</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex items-center justify-center h-32 text-slate-400 bg-slate-100 rounded-lg border border-dashed">
									Nenhuma validação em progresso...
								</div>
							</CardContent>
						</Card>
					</div>

					<ScrollArea className="h-[600px] rounded-xl border bg-white p-4 shadow-sm">
						<h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
							<AlertCircle size={18} className="text-amber-500" /> Cenários para
							Revisão ({dilemmas.length})
						</h2>
						<div className="space-y-4">
							{dilemmas.map((dilemma) => (
								<div
									key={dilemma.id}
									className="p-4 rounded-lg border border-slate-200 hover:border-blue-400 transition-all bg-slate-50/50"
								>
									<div className="flex justify-between items-start mb-2">
										<span className="text-xs font-mono text-slate-400 bg-slate-200 px-2 py-0.5 rounded">
											{dilemma.id}
										</span>
										<Badge variant="secondary" className="text-[10px]">
											{dilemma.aspect}
										</Badge>
									</div>
									<h3 className="font-bold text-slate-800 text-sm mb-2">
										{dilemma.title}
									</h3>
									<p className="text-xs text-slate-600 mb-3 line-clamp-3">
										{dilemma.description}
									</p>

									<div className="flex gap-2">
										<Button
											size="sm"
											variant="outline"
											className="w-full text-xs h-8 border-green-200 hover:bg-green-50 text-green-700"
										>
											<CheckCircle2 size={14} className="mr-1" /> Validar
											Realismo
										</Button>
									</div>
								</div>
							))}
						</div>
					</ScrollArea>
				</div>
			</div>
		</div>
	);
}
