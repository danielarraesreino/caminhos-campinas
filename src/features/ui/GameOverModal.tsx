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
		<div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md animate-fade-in">
			<div className="w-full max-w-2xl bg-gradient-to-b from-gray-900 to-black border-2 border-red-800 rounded-3xl overflow-hidden shadow-2xl shadow-red-900/50">
				{/* Header com motivo */}
				<div
					className={`${getReasonColor()} p-8 text-center border-b-4 border-red-700`}
				>
					<div className="flex justify-center mb-4 text-red-200">
						{getReasonIcon()}
					</div>
					<h2 className="text-4xl font-black text-white mb-2 uppercase tracking-wider">
						Fim de Jogo
					</h2>
					<p className="text-2xl font-bold text-red-300 uppercase tracking-widest">
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
										className="border-l-4 border-blue-500 pl-4 italic text-blue-300 text-sm mt-4"
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
									className="text-gray-200 leading-relaxed whitespace-pre-line"
								>
									{parts.map((part, partIdx) =>
										partIdx % 2 === 1 ? (
											// biome-ignore lint/suspicious/noArrayIndexKey: order is stable
											<strong
												key={`${key}-${partIdx}`}
												className="text-white font-bold"
											>
												{part}
											</strong>
										) : (
											part
										),
									)}
								</p>
							);
						})}
					</div>

					{/* Estatísticas */}
					{statistics && (
						<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 p-6 bg-gray-800/50 rounded-xl border border-gray-700">
							<div className="text-center">
								<p className="text-sm text-gray-400 uppercase tracking-wider mb-1">
									Dias
								</p>
								<p className="text-3xl font-black text-white">
									{statistics.daysSurvived}
								</p>
							</div>
							<div className="text-center">
								<p className="text-sm text-gray-400 uppercase tracking-wider mb-1">
									Dinheiro
								</p>
								<p className="text-3xl font-black text-green-400">
									R$ {statistics.moneyEarned}
								</p>
							</div>
							<div className="text-center">
								<p className="text-sm text-gray-400 uppercase tracking-wider mb-1">
									Dignidade
								</p>
								<p className="text-3xl font-black text-purple-400">
									{statistics.dignityFinal}
								</p>
							</div>
							<div className="text-center">
								<p className="text-sm text-gray-400 uppercase tracking-wider mb-1">
									Estigma
								</p>
								<p className="text-3xl font-black text-red-400">
									{statistics.socialStigmaFinal}
								</p>
							</div>
						</div>
					)}

					{/* Ação e Conversão */}
					<div className="flex flex-col gap-4 mt-8 bg-slate-900/50 p-6 rounded-xl border border-slate-700">
						<div className="text-center mb-2">
							<p className="text-lg text-white font-medium italic">
								"Na vida real, não existe respawn. Mas sua solidariedade pode
								salvar vidas."
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
