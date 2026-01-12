"use client";

import { AlertCircle, Heart, TrendingDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GameOverResult } from "@/features/game-loop/gameOverConditions";

interface GameOverModalProps {
	gameOverResult: GameOverResult;
	onRestart: () => void;
}

export function GameOverModal({
	gameOverResult,
	onRestart,
}: GameOverModalProps) {
	const { reason, narrative, statistics } = gameOverResult;

	// Determina cor e ícone baseado no motivo
	const getReasonColor = () => {
		switch (reason) {
			case "DESISTÊNCIA":
				return "bg-purple-900/90";
			case "ÓBITO":
				return "bg-red-900/90";
			case "HIPOTERMIA":
				return "bg-blue-900/90";
			case "DESNUTRIÇÃO":
				return "bg-orange-900/90";
			default:
				return "bg-gray-900/90";
		}
	};

	const getReasonIcon = () => {
		switch (reason) {
			case "DESISTÊNCIA":
				return <TrendingDown className="h-12 w-12" />;
			case "ÓBITO":
				return <X className="h-12 w-12" />;
			case "HIPOTERMIA":
				return <AlertCircle className="h-12 w-12" />;
			case "DESNUTRIÇÃO":
				return <Heart className="h-12 w-12" />;
			default:
				return <AlertCircle className="h-12 w-12" />;
		}
	};

	return (
		<div
			className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-fade-in"
			role="dialog"
			aria-modal="true"
			aria-labelledby="game-over-title"
		>
			<div className="w-full max-w-2xl bg-zinc-950 border-2 border-zinc-800 rounded-3xl overflow-hidden shadow-2xl shadow-black/80">
				{/* Header com motivo */}
				<div
					className={`${getReasonColor()} p-8 text-center border-b border-zinc-800`}
				>
					<div className="flex justify-center mb-4 text-white/80">
						{getReasonIcon()}
					</div>
					<h2
						id="game-over-title"
						className="text-3xl md:text-4xl font-black text-white mb-2 uppercase tracking-wider"
					>
						O Sistema Falhou com Você
					</h2>
					<p className="text-xl font-bold text-red-400 uppercase tracking-widest font-mono">
						{reason}
					</p>
				</div>

				{/* Narrativa */}
				<div className="p-8 space-y-6">
					<div className="prose prose-invert max-w-none">
						{narrative.split("\n\n").map((paragraph, idx) => {
							const key = `${idx}-${paragraph.length}`;
							// Detecta citações (linhas que começam com *)
							if (paragraph.trim().startsWith("*")) {
								return (
									<blockquote
										key={key}
										className="border-l-4 border-zinc-700 pl-4 italic text-zinc-400 text-sm mt-4 font-mono"
									>
										{paragraph.replace(/^\*|\*$/g, "")}
									</blockquote>
								);
							}

							// Detecta texto em negrito (linhas com **)
							const boldRegex = /\*\*(.*?)\*\*/g;
							const parts = paragraph.split(boldRegex);

							return (
								<p
									key={key}
									className="text-zinc-300 leading-relaxed whitespace-pre-line"
								>
									{parts.map((part, partIdx) => {
										if (partIdx % 2 === 1) {
											return (
												<strong
													// biome-ignore lint/suspicious/noArrayIndexKey: order is stable
													key={`${key}-${partIdx}`}
													className="text-white font-bold"
												>
													{part}
												</strong>
											);
										}
										return part;
									})}
								</p>
							);
						})}
					</div>

					{/* Estatísticas */}
					{statistics && (
						<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 p-6 bg-zinc-900/50 rounded-xl border border-zinc-800">
							<div className="text-center">
								<p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1 font-bold">
									Dias
								</p>
								<p className="text-2xl font-mono font-bold text-white">
									{statistics.daysSurvived}
								</p>
							</div>
							<div className="text-center">
								<p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1 font-bold">
									Renda
								</p>
								<p className="text-2xl font-mono font-bold text-emerald-500">
									R$ {statistics.moneyEarned}
								</p>
							</div>
							<div className="text-center">
								<p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1 font-bold">
									Dignidade
								</p>
								<p className="text-2xl font-mono font-bold text-purple-400">
									{statistics.dignityFinal}
								</p>
							</div>
							<div className="text-center">
								<p className="text-[10px] text-zinc-500 uppercase tracking-wider mb-1 font-bold">
									Estigma
								</p>
								<p className="text-2xl font-mono font-bold text-red-400">
									{statistics.socialStigmaFinal}
								</p>
							</div>
						</div>
					)}

					{/* Mensagem de Advocacy */}
					<div className="bg-purple-900/30 border border-purple-700/50 p-4 rounded-xl mt-6">
						<p className="text-sm text-purple-200 leading-relaxed">
							<strong className="text-white">
								Na vida real, não existe botão de reiniciar.
							</strong>{" "}
							A falta de acesso ao Bom Prato ou ao Abrigo não é um erro seu; é
							uma <span className="text-yellow-400">violação do ODS 1.4</span>{" "}
							(acesso a serviços básicos). Junte-se ao movimento{" "}
							<strong className="text-blue-400">"A Rua Tem Voz"</strong>.
						</p>
					</div>

					{/* Ação e Conversão */}
					<div className="flex flex-col gap-4 mt-6 bg-slate-900/50 p-6 rounded-xl border border-slate-700">
						<div className="text-center mb-2">
							<p className="text-lg text-white font-medium italic">
								"O frio que mata é o mesmo que o Estado ignora. Sua
								solidariedade pode salvar vidas."
							</p>
						</div>

						<a
							href="/apoie"
							className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 px-6 rounded-xl font-bold text-lg text-center uppercase tracking-wide shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2 transition-all hover:scale-105"
						>
							<Heart className="w-6 h-6 fill-current" />
							Doe um Cobertor Hoje
						</a>

						<Button
							onClick={onRestart}
							variant="outline"
							className="w-full bg-transparent hover:bg-white/5 text-slate-400 border-slate-600 hover:border-slate-500 py-6"
						>
							🔄 Tentar Novamente
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
