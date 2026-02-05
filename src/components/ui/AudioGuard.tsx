"use client";

import { Radio } from "lucide-react";
import { useModalQueue } from "@/contexts/ModalQueueContext";

/**
 * AUDIO GUARD (Walkie-Talkie Logic)
 *
 * Este componente cria um "bloqueio" visual e de interação quando
 * o áudio de narração (TTS) está ativo.
 * Implementa o princípio "Audio-First" do projeto.
 */
export function AudioGuard() {
	const { audioPlaying } = useModalQueue();

	if (!audioPlaying) return null;

	return (
		<div
			className="fixed inset-0 z-[50] flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm transition-all duration-500 animate-in fade-in"
			aria-hidden="true"
		>
			<div className="flex flex-col items-center gap-4 p-8 rounded-3xl bg-blue-900/40 border border-blue-400/30 shadow-2xl shadow-blue-500/20">
				<div className="relative">
					<Radio className="w-12 h-12 text-blue-400 animate-pulse" />
					<div className="absolute inset-0 w-12 h-12 bg-blue-400 rounded-full blur-xl opacity-20 animate-ping" />
				</div>

				<div className="text-center">
					<p className="text-blue-100 font-bold tracking-widest uppercase text-sm animate-bounce">
						Ouvindo a Rua...
					</p>
					<p className="text-blue-300/70 text-xs mt-1">
						Interface travada para foco no áudio
					</p>
				</div>
			</div>

			{/* Botão de segurança (opcional) para cancelar se der erro no TTS */}
			<button
				type="button"
				onClick={() => window.speechSynthesis.cancel()}
				className="mt-8 text-white/30 hover:text-white/60 text-[10px] uppercase tracking-tighter transition-colors"
			>
				Interromper Áudio
			</button>
		</div>
	);
}
