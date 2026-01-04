"use client";

import { ArrowLeft, Megaphone, Send } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";
import { submitDilemmaSuggestion } from "@/actions/dilemmaActions";
import { EcoButton } from "@/components/ui/EcoButton";
import { EcoCard } from "@/components/ui/EcoCard";

const initialState = {
	success: false,
	message: "",
};

export default function SuggestionPage() {
	const [state, formAction, isPending] = useActionState(
		submitDilemmaSuggestion,
		initialState,
	);

	return (
		<main className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 flex items-center justify-center">
			<div className="max-w-2xl w-full space-y-6">
				{/* Header */}
				<header className="flex items-center justify-between pb-6 border-b border-slate-800">
					<Link
						href="/hub"
						className="text-slate-400 hover:text-white transition-colors"
					>
						<ArrowLeft size={24} />
					</Link>
					<h1 className="text-2xl font-mono font-bold text-white uppercase tracking-widest flex items-center gap-3">
						<Megaphone className="text-blue-500" />A RUA FALA
					</h1>
				</header>

				<section className="bg-blue-900/10 border border-blue-900/30 p-4 rounded text-sm text-blue-200 leading-relaxed font-mono">
					<p>"O jogo é apenas um modelo. A realidade é você quem vive."</p>
					<p className="mt-2 opacity-80 italic">
						Use este canal para transformar sua experiência (ou observação) em
						um dilema jogável. Não buscamos apenas histórias tristes, mas a{" "}
						<strong>regra invisível</strong> que causou a dor.
					</p>
				</section>

				<EcoCard className="p-0 border-slate-800 bg-slate-900">
					<div className="p-6">
						{state.success ? (
							<div className="text-center py-12 space-y-4 animate-in fade-in">
								<div className="text-green-500 text-6xl">✓</div>
								<h3 className="text-xl font-bold text-white">RECEBIDO</h3>
								<p className="text-slate-400 max-w-xs mx-auto">
									{state.message}
								</p>
								<div className="pt-6">
									<Link href="/hub">
										<EcoButton variant="ghost" className="border border-white">
											Voltar ao Hub
										</EcoButton>
									</Link>
								</div>
							</div>
						) : (
							<form action={formAction} className="space-y-6">
								{/* Narrative */}
								<div className="space-y-2">
									<label
										htmlFor="narrative_text"
										className="text-xs uppercase font-bold text-slate-500 tracking-wider"
									>
										O Dilema (A Situação)
									</label>
									<textarea
										id="narrative_text"
										name="narrative_text"
										required
										placeholder="Ex: Cheguei no abrigo às 19:05 e o portão estava fechado..."
										className="w-full bg-slate-950 border border-slate-800 rounded p-4 text-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all h-32 resize-none"
									/>
								</div>

								{/* Options */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<div className="space-y-2">
										<label
											htmlFor="option_a"
											className="text-xs uppercase font-bold text-slate-500 tracking-wider"
										>
											Opção A (O que você quis fazer?)
										</label>
										<input
											type="text"
											id="option_a"
											name="option_a"
											required
											placeholder="Ex: Insistir para entrar"
											className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-slate-300 focus:border-blue-500 transition-all"
										/>
									</div>
									<div className="space-y-2">
										<label
											htmlFor="option_b"
											className="text-xs uppercase font-bold text-slate-500 tracking-wider"
										>
											Opção B (O que teve que fazer?)
										</label>
										<input
											type="text"
											id="option_b"
											name="option_b"
											required
											placeholder="Ex: Dormir na praça"
											className="w-full bg-slate-950 border border-slate-800 rounded p-3 text-slate-300 focus:border-blue-500 transition-all"
										/>
									</div>
								</div>

								{/* The Barrier (Freakonomics) */}
								<div className="space-y-2">
									<label
										htmlFor="barrier_fact"
										className="text-xs uppercase font-bold text-blue-400 tracking-wider flex items-center gap-2"
									>
										★ A Barreira Invisível (O Motivo)
									</label>
									<input
										type="text"
										id="barrier_fact"
										name="barrier_fact"
										required
										placeholder="Ex: A regra de tolerância zero com horários ignorou que o ônibus atrasou."
										className="w-full bg-slate-950 border border-blue-900/50 rounded p-4 text-slate-300 focus:border-blue-500 transition-all"
									/>
									<p className="text-[10px] text-slate-500">
										Qual regra, lei ou falha estrutural impediu um final feliz?
									</p>
								</div>

								{/* Location & Contact */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-800/50">
									<div className="space-y-2">
										<label
											htmlFor="location"
											className="text-xs uppercase font-bold text-slate-500 tracking-wider"
										>
											Local (Opcional)
										</label>
										<input
											type="text"
											id="location"
											name="location"
											placeholder="Ex: Centro, Rodoviária..."
											className="w-full bg-slate-950/50 border border-slate-800 rounded p-3 text-slate-400 focus:border-slate-600 transition-all"
										/>
									</div>
									<div className="space-y-2">
										<label
											htmlFor="contact_info"
											className="text-xs uppercase font-bold text-slate-500 tracking-wider"
										>
											Contato (Opcional)
										</label>
										<input
											type="text"
											id="contact_info"
											name="contact_info"
											placeholder="Email ou WhatsApp"
											className="w-full bg-slate-950/50 border border-slate-800 rounded p-3 text-slate-400 focus:border-slate-600 transition-all"
										/>
									</div>
								</div>

								{/* Submit Area */}
								<div className="pt-6">
									{state.message && !state.success && (
										<p className="text-red-400 text-sm mb-4 text-center">
											{state.message}
										</p>
									)}

									<EcoButton
										type="submit"
										disabled={isPending}
										className="w-full py-4 text-lg font-bold tracking-widest flex items-center justify-center gap-2"
									>
										{isPending ? (
											"ENVIANDO..."
										) : (
											<>
												ENVIAR RELATO <Send size={18} />
											</>
										)}
									</EcoButton>

									<p className="text-[10px] text-slate-600 text-center mt-4">
										Ao enviar, você concorda que este relato pode ser
										anonimizado e adaptado para fins educativos no jogo.
									</p>
								</div>
							</form>
						)}
					</div>
				</EcoCard>
			</div>
		</main>
	);
}
