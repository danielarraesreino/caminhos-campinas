"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseNativeSpeechOptions {
	onTranscription?: (text: string) => void;
	onSpeechEnd?: () => void;
}

export function useNativeSpeech({
	onTranscription,
	onSpeechEnd,
}: UseNativeSpeechOptions = {}) {
	const [isListening, setIsListening] = useState(false);
	const [isSpeaking, setIsSpeaking] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const recognitionRef = useRef<any>(null);
	const synthesisRef = useRef<SpeechSynthesis | null>(null);

	// Initialize Speech Recognition
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
					if (onTranscription) onTranscription(transcript);
				};

				recognition.onend = () => {
					setIsListening(false);
					if (onSpeechEnd) onSpeechEnd();
				};

				recognition.onerror = (event: any) => {
					console.error("Speech recognition error", event.error);
					setError(event.error);
					setIsListening(false);
				};

				recognitionRef.current = recognition;
			}

			synthesisRef.current = window.speechSynthesis;
		}
	}, [onTranscription, onSpeechEnd]);

	const startListening = useCallback(() => {
		if (!recognitionRef.current) {
			setError("Speech recognition not supported");
			return;
		}
		if (isSpeaking) {
			synthesisRef.current?.cancel();
			setIsSpeaking(false);
		}
		try {
			recognitionRef.current.start();
			setIsListening(true);
			setError(null);
		} catch (e) {
			console.error("Failed to start recognition", e);
		}
	}, [isSpeaking]);

	const stopListening = useCallback(() => {
		if (recognitionRef.current) {
			recognitionRef.current.stop();
			setIsListening(false);
		}
	}, []);

	const speak = useCallback((text: string) => {
		if (!synthesisRef.current) return;

		// Cancel any ongoing speech
		synthesisRef.current.cancel();

		const utterance = new SpeechSynthesisUtterance(text);
		utterance.lang = "pt-BR";
		utterance.rate = 1.2; // Optimized for speed as requested

		// Try to find a male voice if available (system dependent)
		const voices = synthesisRef.current.getVoices();
		const maleVoice = voices.find(
			(v) =>
				v.lang.startsWith("pt") &&
				(v.name.toLowerCase().includes("male") ||
					v.name.toLowerCase().includes("google")),
		);
		if (maleVoice) utterance.voice = maleVoice;

		utterance.onstart = () => setIsSpeaking(true);
		utterance.onend = () => setIsSpeaking(false);
		utterance.onerror = () => setIsSpeaking(false);

		synthesisRef.current.speak(utterance);
	}, []);

	return {
		isListening,
		isSpeaking,
		error,
		startListening,
		stopListening,
		speak,
	};
}
