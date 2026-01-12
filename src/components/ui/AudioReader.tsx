"use client";

import { Pause, Play, Volume2 } from "lucide-react";
import { useEffect, useState } from "react";

interface AudioReaderProps {
	text: string;
	className?: string;
}

export function AudioReader({ text, className = "" }: AudioReaderProps) {
	const [isPlaying, setIsPlaying] = useState(false);
	const [isSupported, setIsSupported] = useState(false);
	const [u, setU] = useState<SpeechSynthesisUtterance | null>(null);

	useEffect(() => {
		if (typeof window !== "undefined" && "speechSynthesis" in window) {
			setIsSupported(true);
		}
	}, []);

	const togglePlay = () => {
		if (!isSupported) return;

		if (isPlaying) {
			window.speechSynthesis.cancel();
			setIsPlaying(false);
		} else {
			const utterance = new SpeechSynthesisUtterance(text);
			utterance.lang = "pt-BR";
			utterance.rate = 1.1; // Um pouco mais rápido para naturalidade
			utterance.onend = () => setIsPlaying(false);

			window.speechSynthesis.speak(utterance);
			setU(utterance);
			setIsPlaying(true);
		}
	};

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			if (typeof window !== "undefined") {
				window.speechSynthesis.cancel();
			}
		};
	}, []);

	if (!isSupported) return null;

	return (
		<button
			onClick={togglePlay}
			className={`flex items-center gap-2 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-full text-blue-300 text-xs font-bold uppercase transition-all ${className} ${isPlaying ? "animate-pulse border-blue-400" : ""}`}
			title="Ler em voz alta"
		>
			{isPlaying ? <Pause size={14} /> : <Volume2 size={14} />}
			{isPlaying ? "Ouvindo..." : "Ouvir"}
		</button>
	);
}
