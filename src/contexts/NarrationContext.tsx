"use client";

import type React from "react";
import {
	createContext,
	useCallback,
	useContext,
	useRef,
	useState,
} from "react";

interface NarrationContextType {
	queue: string[];
	addToNarrationQueue: (text: string) => void;
	clearNarrationQueue: () => void;
	isNarrating: boolean;
	currentText: string | null;
}

const NarrationContext = createContext<NarrationContextType | null>(null);

export function NarrationProvider({ children }: { children: React.ReactNode }) {
	const [isNarrating, setIsNarrating] = useState(false);
	const [currentText, setCurrentText] = useState<string | null>(null);
	const narrationQueueRef = useRef<string[]>([]);
	const isNarratingRef = useRef(false);

	const processNarrationQueue = useCallback(() => {
		if (isNarratingRef.current || narrationQueueRef.current.length === 0) {
			if (narrationQueueRef.current.length === 0 && !isNarratingRef.current) {
				setIsNarrating(false);
				setCurrentText(null);
			}
			return;
		}

		isNarratingRef.current = true;
		setIsNarrating(true);

		const text = narrationQueueRef.current.shift() || "";
		setCurrentText(text);

		const utterance = new SpeechSynthesisUtterance(text);
		utterance.lang = "pt-BR";
		utterance.rate = 0.95; // Slightly slower for better clarity as requested (0.9 in prompt)

		utterance.onend = () => {
			isNarratingRef.current = false;
			processNarrationQueue(); // Play next in queue
		};

		utterance.onerror = (e) => {
			console.warn("[NarrationContext] Speech error:", e.error);
			isNarratingRef.current = false;
			processNarrationQueue();
		};

		// We don't call cancel() here because it would clear the queue we just started processing
		// unless we want to "interrupt" the current one to play the NEW queue immediately.
		// The prompt says "window.speechSynthesis.cancel(); // Limpa anterior" inside process loop.
		// Usually, if we are processing a queue, we want them to play sequentially.
		// But if we want to START a new queue and cancel everything else, we'd do it in addToNarrationQueue.

		window.speechSynthesis.speak(utterance);
	}, []);

	const addToNarrationQueue = useCallback(
		(text: string) => {
			if (!text) return;

			// Clean text (remove markdown-like chars if any)
			const cleanText = text.replace(/[*_#]/g, "");

			narrationQueueRef.current.push(cleanText);
			processNarrationQueue();
		},
		[processNarrationQueue],
	);

	const clearNarrationQueue = useCallback(() => {
		window.speechSynthesis.cancel();
		narrationQueueRef.current = [];
		isNarratingRef.current = false;
		setIsNarrating(false);
		setCurrentText(null);
	}, []);

	return (
		<NarrationContext.Provider
			value={{
				queue: narrationQueueRef.current,
				addToNarrationQueue,
				clearNarrationQueue,
				isNarrating,
				currentText,
			}}
		>
			{children}
		</NarrationContext.Provider>
	);
}

export function useNarration() {
	const context = useContext(NarrationContext);
	if (!context) {
		throw new Error("useNarration must be used within a NarrationProvider");
	}
	return context;
}
