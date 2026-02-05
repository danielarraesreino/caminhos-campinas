"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseNativeSpeechOptions {
	onTranscription?: (text: string) => void;
	onSpeechEnd?: () => void;
}

// 🔒 SINGLETON: Global Speech Recognition instance
// biome-ignore lint/suspicious/noExplicitAny: Web Speech API instance
let globalRecognitionInstance: any = null;

function getSpeechRecognitionInstance() {
	if (typeof window === "undefined") return null;

	if (globalRecognitionInstance) {
		return globalRecognitionInstance;
	}

	const SpeechRecognition =
		(window as any).SpeechRecognition ||
		(window as any).webkitSpeechRecognition;

	if (!SpeechRecognition) return null;

	const recognition = new SpeechRecognition();
	recognition.continuous = false;
	recognition.lang = "pt-BR";
	recognition.interimResults = false;

	globalRecognitionInstance = recognition;
	return recognition;
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
	const isStartingRef = useRef(false); // 🛡️ GUARD: Prevent race conditions

	// Initialize Speech Recognition with Singleton
	useEffect(() => {
		if (typeof window === "undefined") return;

		const recognition = getSpeechRecognitionInstance();
		if (recognition) {
			recognition.onresult = (event: any) => {
				const transcript = event.results[0][0].transcript;
				if (onTranscription) onTranscription(transcript);
			};

			recognition.onend = () => {
				setIsListening(false);
				isStartingRef.current = false; // Reset guard
				if (onSpeechEnd) onSpeechEnd();
			};

			recognition.onerror = (event: any) => {
				// ✅ SILENT ABORT: Ignore "aborted" errors (normal cleanup)
				if (event.error === "aborted") {
					console.log("[Speech] Recognition aborted (intentional cleanup)");
					setIsListening(false);
					isStartingRef.current = false;
					return;
				}

				// Log other errors normally
				console.error("[Speech] Recognition error:", event.error);
				setError(event.error);
				setIsListening(false);
				isStartingRef.current = false;
			};

			recognitionRef.current = recognition;
		}

		synthesisRef.current = window.speechSynthesis;

		// ✅ CLEANUP: Stop recognition on unmount (React 19/Next.js 16)
		return () => {
			if (recognitionRef.current) {
				try {
					recognitionRef.current.stop();
				} catch (_e) {
					// Ignore if already stopped
				}
			}
		};
	}, [onTranscription, onSpeechEnd]);

	const startListening = useCallback(() => {
		if (!recognitionRef.current) {
			setError("Speech recognition not supported");
			return;
		}

		// 🛡️ GUARD: Prevent multiple start() calls
		if (isListening || isStartingRef.current) {
			console.log("[Speech] Already listening or starting, skipping");
			return;
		}

		if (isSpeaking) {
			synthesisRef.current?.cancel();
			setIsSpeaking(false);
		}

		try {
			isStartingRef.current = true;
			recognitionRef.current.start();
			setIsListening(true);
			setError(null);
		} catch (e: any) {
			// Handle "already started" error gracefully
			if (e.message?.includes("already started")) {
				console.log("[Speech] Recognition already active");
			} else {
				console.error("[Speech] Failed to start recognition:", e);
			}
			isStartingRef.current = false;
		}
	}, [isSpeaking, isListening]);

	const stopListening = useCallback(() => {
		if (recognitionRef.current) {
			try {
				recognitionRef.current.stop();
			} catch (_e) {
				// Ignore if already stopped
			}
			setIsListening(false);
			isStartingRef.current = false; // Reset guard
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
