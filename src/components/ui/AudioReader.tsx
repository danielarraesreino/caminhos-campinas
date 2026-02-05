"use client";

import { Pause, Volume2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useModalQueue } from "@/contexts/ModalQueueContext";

interface AudioReaderProps {
	text: string;
	className?: string;
}

export function AudioReader({ text, className = "" }: AudioReaderProps) {
	const [isPlaying, setIsPlaying] = useState(false);
	const [isSupported, setIsSupported] = useState(false);
	const [_u, setU] = useState<SpeechSynthesisUtterance | null>(null);
	const { setAudioPlaying } = useModalQueue();

	useEffect(() => {
		if (typeof window !== "undefined" && "speechSynthesis" in window) {
			setIsSupported(true);
		}
	}, []);

	const togglePlay = () => {
		if (!isSupported) return;

		if (isPlaying) {
			// [FIX] Explicitly cancel all narrations immediately
			window.speechSynthesis.cancel();
			setIsPlaying(false);
			setAudioPlaying(false);
		} else {
			// [NEW] Sanitize text: prevent empty strings or undefined from reaching the engine
			const cleanText = (text || "").trim();
			if (!cleanText) {
				console.warn(
					"[AudioReader] Narrowed speech attempted with empty text.",
				);
				return;
			}

			// [NEW] Clear any leftover speech before starting new one
			window.speechSynthesis.cancel();

			const utterance = new SpeechSynthesisUtterance(cleanText);
			utterance.lang = "pt-BR";
			utterance.rate = 1.1;

			utterance.onstart = () => {
				setIsPlaying(true);
				setAudioPlaying(true);
			};

			utterance.onend = () => {
				setIsPlaying(false);
				setAudioPlaying(false);
			};

			utterance.onerror = (e) => {
				// [FIX] Always reset state on error to prevent blocking the ModalQueue
				console.error("SpeechSynthesis Error:", e);
				setIsPlaying(false);
				setAudioPlaying(false);

				// Optional: Force a global cancel on error just in case
				if (typeof window !== "undefined") {
					window.speechSynthesis.cancel();
				}
			};

			window.speechSynthesis.speak(utterance);
			setU(utterance);
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
			type="button"
			onClick={togglePlay}
			className={`flex items-center gap-2 px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-full text-blue-300 text-xs font-bold uppercase transition-all ${className} ${isPlaying ? "animate-pulse border-blue-400" : ""}`}
			title="Ler em voz alta"
		>
			{isPlaying ? <Pause size={14} /> : <Volume2 size={14} />}
			{isPlaying ? "Ouvindo..." : "Ouvir"}
		</button>
	);
}
