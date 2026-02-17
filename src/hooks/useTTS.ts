import { useCallback, useEffect, useRef, useState } from "react";

interface TTSOptions {
	lang?: string;
	voice?: SpeechSynthesisVoice | null;
	rate?: number;
	pitch?: number;
	volume?: number;
}

interface TTSQueueItem {
	text: string;
	options?: TTSOptions;
}

/**
 * Hook para Text-to-Speech com suporte a pt-BR
 * - Sistema de fila para evitar sobreposição
 * - Controle de estado (enabled/speaking)
 * - Seleção de voz (feminina/masculina)
 */
export function useTTS() {
	const [isSpeaking, setIsSpeaking] = useState(false);
	const [isEnabled, setIsEnabled] = useState(
		typeof window !== "undefined" &&
			localStorage.getItem("tts-enabled") === "true",
	);
	const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
	const [selectedVoice, setSelectedVoice] =
		useState<SpeechSynthesisVoice | null>(null);
	const queueRef = useRef<TTSQueueItem[]>([]);
	const isProcessingRef = useRef(false);

	// Load available voices
	useEffect(() => {
		if (typeof window === "undefined" || !window.speechSynthesis) return;

		const loadVoices = () => {
			const availableVoices = window.speechSynthesis.getVoices();
			const ptBRVoices = availableVoices.filter((v) =>
				v.lang.startsWith("pt-BR"),
			);
			setVoices(ptBRVoices.length > 0 ? ptBRVoices : availableVoices);

			// Auto-select first pt-BR voice (usually female)
			if (ptBRVoices.length > 0 && !selectedVoice) {
				setSelectedVoice(ptBRVoices[0]);
			}
		};

		loadVoices();
		window.speechSynthesis.onvoiceschanged = loadVoices;

		return () => {
			window.speechSynthesis.onvoiceschanged = null;
		};
	}, [selectedVoice]);

	// Persist enabled state
	useEffect(() => {
		if (typeof window !== "undefined") {
			localStorage.setItem("tts-enabled", isEnabled ? "true" : "false");
		}
	}, [isEnabled]);

	const processQueue = useCallback(() => {
		if (
			queueRef.current.length === 0 ||
			isProcessingRef.current ||
			!isEnabled
		) {
			setIsSpeaking(false);
			isProcessingRef.current = false;
			return;
		}

		isProcessingRef.current = true;
		const item = queueRef.current.shift();
		if (!item) return;

		const utterance = new SpeechSynthesisUtterance(item.text);
		utterance.lang = item.options?.lang || "pt-BR";
		utterance.rate = item.options?.rate || 1.0;
		utterance.pitch = item.options?.pitch || 1.0;
		utterance.volume = item.options?.volume || 1.0;

		// Use selected voice or option voice
		if (item.options?.voice) {
			utterance.voice = item.options.voice;
		} else if (selectedVoice) {
			utterance.voice = selectedVoice;
		}

		utterance.onend = () => {
			isProcessingRef.current = false;
			processQueue();
		};

		utterance.onerror = (e) => {
			console.warn("[TTS] Playback error:", e);
			isProcessingRef.current = false;
			processQueue();
		};

		window.speechSynthesis.speak(utterance);
		setIsSpeaking(true);
	}, [isEnabled, selectedVoice]);

	const speak = useCallback(
		(text: string, options?: TTSOptions) => {
			if (!isEnabled || !window.speechSynthesis) {
				console.warn("[TTS] TTS disabled or unavailable");
				return;
			}

			// Clean text (remove excessive whitespace)
			const cleanText = text.replace(/\s+/g, " ").trim();
			if (!cleanText) return;

			queueRef.current.push({ text: cleanText, options });
			processQueue();
		},
		[isEnabled, processQueue],
	);

	const stop = useCallback(() => {
		if (typeof window !== "undefined" && window.speechSynthesis) {
			window.speechSynthesis.cancel();
		}
		queueRef.current = [];
		isProcessingRef.current = false;
		setIsSpeaking(false);
	}, []);

	const toggle = useCallback(() => {
		if (isEnabled) {
			stop();
		}
		setIsEnabled((prev) => !prev);
	}, [isEnabled, stop]);

	return {
		speak,
		stop,
		toggle,
		isSpeaking,
		isEnabled,
		setIsEnabled,
		voices,
		selectedVoice,
		setSelectedVoice,
		isAvailable: typeof window !== "undefined" && !!window.speechSynthesis,
	};
}
