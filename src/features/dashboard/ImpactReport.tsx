"use client";

import { Briefcase, FileText, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGameContext } from "@/contexts/GameContext";
import { ShareableDossier } from "./ShareableDossier";

interface ImpactReportProps {
	onRestart: () => void;
	gameOverResult?: {
		reason: string;
	};
}

export function ImpactReport({ onRestart, gameOverResult }: ImpactReportProps) {
	const { state } = useGameContext();
	const { history, employed_formal, addiction, avatar } = state;

	// Métricas do Jogador
	const violations = history.filter(
		(e: { type: string }) => e.type === "VIOLATION",
	);
	const barriers = history.filter(
		(e: { type: string }) => e.type === "BARRIER",
	);
	const workStatus = employed_formal ? "FORMAL" : "INFORMAL/DESEMPREGO";

	return (
		<div className="flex flex-col h-full bg-slate-950 text-slate-300 p-6 overflow-y-auto animate-in fade-in duration-1000">
			<header className="border-b border-slate-800 pb-6 mb-8">
				<h1 className="text-3xl font-mono font-bold text-white tracking-widest uppercase mb-2">
					Dossiê de Cidadania
				</h1>
				<p className="text-slate-500 font-mono text-sm">
					AUDITORIA DE IMPACTO SOCIAL • RELATÓRIO FINAL
				</p>
			</header>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
				{/* Comparativo: Trabalho */}
				<section className="bg-slate-900/50 p-6 rounded border border-slate-800">
					<div className="flex items-center gap-3 mb-4 text-blue-400">
						<Briefcase size={24} />
						<h2 className="font-bold uppercase tracking-wider">
							Renda e Trabalho
						</h2>
					</div>

					<div className="space-y-6">
						<div>
							<div className="flex justify-between text-sm mb-2">
								<span
									className={
										employed_formal
											? "text-green-400 font-bold"
											: "text-slate-400"
									}
								>
									SUA SITUAÇÃO: {workStatus}
								</span>
							</div>
							<div className="h-2 bg-slate-800 rounded-full overflow-hidden">
								<div
									className={`h-full ${employed_formal ? "bg-green-500" : "bg-orange-500"}`}
									style={{ width: "100%" }}
								/>
							</div>
						</div>

						<div className="border-l-2 border-slate-700 pl-4 py-2">
							<span className="block text-xs uppercase text-slate-500 mb-1">
								REALIDADE (CENSO 2024):
							</span>
							<p className="text-sm text-slate-300 italic">
								"61,2% estão desempregados e 24,4% vivem de bicos. Apenas uma
								minoria acessa o mercado formal devido a barreiras de endereço e
								higiene."
							</p>
						</div>
					</div>
				</section>

				{/* Comparativo: Violência */}
				<section className="bg-slate-900/50 p-6 rounded border border-slate-800">
					<div className="flex items-center gap-3 mb-4 text-red-400">
						<ShieldAlert size={24} />
						<h2 className="font-bold uppercase tracking-wider">
							Violência Institucional
						</h2>
					</div>

					<div className="space-y-6">
						<div className="flex items-center gap-4">
							<div className="text-4xl font-mono font-bold text-white">
								{violations.length}
							</div>
							<div className="text-xs uppercase text-slate-500">
								Violações de Direitos
								<br />
								Registradas na Jornada
							</div>
						</div>

						<div className="border-l-2 border-slate-700 pl-4 py-2">
							<span className="block text-xs uppercase text-slate-500 mb-1">
								REALIDADE (CENSO 2024):
							</span>
							<p className="text-sm text-slate-300 italic">
								"51,1% da violência contra a população de rua provém de agentes
								do Estado (GM/PM). Você não falhou; o sistema te agrediu."
							</p>
						</div>
					</div>
				</section>
			</div>

			{/* Auditoria das Barreiras (Log Detalhado) */}
			<section className="mb-12">
				<h3 className="text-xl text-white font-mono mb-6 flex items-center gap-2">
					<FileText size={20} />
					AUDITORIA DE BARREIRAS ENFRENTADAS
				</h3>

				<div className="space-y-4">
					{history.length === 0 ? (
						<div className="p-4 border border-dashed border-slate-800 text-slate-600 text-center font-mono text-sm">
							NENHUMA VIOLAÇÃO MAIOR REGISTRADA.
						</div>
					) : (
						history.map(
							(event: {
								id: string;
								tags: string[];
								type: string;
								description: string;
							}) => (
								<div
									key={event.id}
									className="bg-slate-900 border border-slate-800 p-4 rounded hover:border-blue-900/50 transition-colors"
								>
									<div className="flex flex-wrap gap-2 mb-2">
										{event.tags.map((tag: string) => (
											<span
												key={tag}
												className="text-[10px] bg-slate-800 text-blue-300 px-2 py-0.5 rounded font-bold uppercase"
											>
												{tag.replace(/_/g, " ")}
											</span>
										))}
										<span
											className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
												event.type === "VIOLATION"
													? "bg-red-950 text-red-400"
													: "bg-orange-950 text-orange-400"
											}`}
										>
											{event.type}
										</span>
									</div>
									<p className="text-slate-300 text-sm leading-relaxed mb-2">
										{event.description}
									</p>
									<div className="text-[10px] text-slate-500 font-mono uppercase">
										FONTE: BASE DE DADOS OFICIAL
									</div>
								</div>
							),
						)
					)}
				</div>
			</section>

			{/* Compartilhamento (Viral) */}
			<div className="flex flex-col items-center pb-8 border-t border-slate-900 pt-8 mt-8">
				<ShareableDossier
					stats={{
						violations: violations.length,
						barriers: barriers.length,
						workStatus,
						daysSurvived: Math.floor(state.time / 24),
					}}
					history={history}
					avatarName={
						avatar
							? `${avatar.name}, ${avatar.age} anos`
							: "Cidadão Desconhecido"
					}
					deathReason={gameOverResult?.reason}
				/>
			</div>

			<div className="flex justify-center pb-12">
				<Button
					onClick={onRestart}
					className="bg-white hover:bg-slate-200 text-black font-mono font-bold py-6 px-12 text-sm uppercase tracking-[0.2em]"
				>
					REINICIAR SIMULAÇÃO
				</Button>
			</div>
		</div>
	);
}
