"use client";

import { Mic, Square } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

interface VoiceInputProps {
	onTranscription: (text: string) => void;
	disabled?: boolean;
}

export function VoiceInput({ onTranscription, disabled }: VoiceInputProps) {
	const [isListening, setIsListening] = useState(false);
	const recognitionRef = useRef<any>(null);

	// Initialize Web Speech API
	useEffect(() => {
		if (typeof window !== "undefined") {
			const SpeechRecognition =
				(window as any).SpeechRecognition ||
				(window as any).webkitSpeechRecognition;

			if (SpeechRecognition) {
				const recognition = new SpeechRecognition();
				recognition.continuous = false;
				recognition.lang = "pt-BR";
				recognition.interimResults = false;

				recognition.onresult = (event: any) => {
					const transcript = event.results[0][0].transcript;
					onTranscription(transcript);
				};

				recognition.onend = () => {
					setIsListening(false);
				};

				recognitionRef.current = recognition;
			}
		}
	}, [onTranscription]);

	const toggleListening = useCallback(() => {
		if (!recognitionRef.current) {
			alert("Reconhecimento de voz não suportado neste navegador.");
			return;
		}

		if (isListening) {
			recognitionRef.current.stop();
			setIsListening(false);
		} else {
			try {
				recognitionRef.current.start();
				setIsListening(true);
			} catch (e) {
				console.error("Voice start error", e);
				setIsListening(false);
			}
		}
	}, [isListening]);

	return (
		<Button
			type="button"
			variant={isListening ? "destructive" : "outline"}
			size="icon"
			onClick={toggleListening}
			disabled={disabled}
			className={`transition-all ${isListening ? "animate-pulse ring-2 ring-red-500" : ""}`}
			title={isListening ? "Parar gravação" : "Falar (Voz)"}
			aria-label={
				isListening ? "Parar reconhecimento de voz" : "Iniciar busca por voz"
			}
		>
			{isListening ? (
				<Square className="h-4 w-4" />
			) : (
				<Mic className="h-4 w-4" />
			)}
		</Button>
	);
}
