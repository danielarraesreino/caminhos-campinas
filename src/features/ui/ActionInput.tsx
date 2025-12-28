"use client";

import { Loader2, Mic, Send, Square } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ActionInputProps {
	onAction: (text: string, audioBlob?: Blob | null) => void;
	placeholder?: string;
	isProcessing?: boolean;
}

export const ActionInput = React.memo(
	({
		onAction,
		placeholder = "O que você faz?",
		isProcessing = false,
	}: ActionInputProps) => {
		const [inputValue, setInputValue] = useState("");
		const [isListening, setIsListening] = useState(false);
		const recognitionRef = useRef<any>(null); // biome-ignore lint/suspicious/noExplicitAny: Web Speech API types vary
		const audioChunks = useRef<BlobPart[]>([]);
		const mediaRecorder = useRef<MediaRecorder | null>(null);

		const stopRecording = useCallback(() => {
			if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
				mediaRecorder.current.stop();
				// Note: Blob creation usually happens asynchronously onstop
			}
		}, []);

		// Initialize Web Speech API
		useEffect(() => {
			if (typeof window !== "undefined") {
				const SpeechRecognition =
					(window as any).SpeechRecognition ||
					(window as any).webkitSpeechRecognition;
				if (SpeechRecognition) {
					recognitionRef.current = new SpeechRecognition();
					recognitionRef.current.continuous = false;
					recognitionRef.current.lang = "pt-BR";
					recognitionRef.current.interimResults = false;

					recognitionRef.current.onresult = (event: any) => {
						const transcript = event.results[0][0].transcript;
						setInputValue(transcript);
					};

					recognitionRef.current.onend = () => {
						setIsListening(false);
						stopRecording();
					};
				}
			}
		}, [stopRecording]);

		const startListening = useCallback(async () => {
			if (recognitionRef.current && !isListening) {
				try {
					console.log("Iniciando gravação de áudio...");
					// Start Audio Recording (MediaRecorder) for Upload
					const stream = await navigator.mediaDevices.getUserMedia({
						audio: true,
					});
					mediaRecorder.current = new MediaRecorder(stream);
					audioChunks.current = [];

					mediaRecorder.current.ondataavailable = (event) => {
						audioChunks.current.push(event.data);
					};

					mediaRecorder.current.start();

					// Start Transcription
					recognitionRef.current.start();
					setIsListening(true);
				} catch (err) {
					console.error("Error accessing microphone:", err);
					alert(
						"Áudio não suportado neste dispositivo ou permissão negada. Use texto.",
					);
					setIsListening(false);
				}
			} else {
				alert(
					"Seu navegador não suporta reconhecimento de voz. Use Chrome/Edge/Safari recentes.",
				);
			}
		}, [isListening]);

		const stopListening = useCallback(() => {
			if (recognitionRef.current && isListening) {
				recognitionRef.current.stop();
				// MediaRecorder stop is handled in recognition.onend logic or explicitly here
				// But we called stopRecording in onend
			}
		}, [isListening]);

		const handleSubmit = useCallback(
			(e?: React.FormEvent) => {
				e?.preventDefault();
				try {
					if (!inputValue.trim() || isProcessing) return;

					// Construct Blob if we have audio
					let finalBlob: Blob | null = null;
					if (audioChunks.current.length > 0) {
						finalBlob = new Blob(audioChunks.current, { type: "audio/webm" });
						console.log(`🎤 Áudio gravado: ${finalBlob.size} bytes`);
					}

					onAction(inputValue, finalBlob);
					setInputValue("");
					audioChunks.current = []; // Clear buffer
				} catch (error) {
					console.error("Error in handleSubmit:", error);
					// Optional: feedback to user
				}
			},
			[inputValue, isProcessing, onAction],
		);

		const toggleListening = useCallback(() => {
			if (isListening) {
				stopListening();
			} else {
				startListening();
			}
		}, [isListening, stopListening, startListening]);

		return (
			<form
				onSubmit={handleSubmit}
				className="p-3 bg-white dark:bg-gray-950 border-t flex gap-2"
			>
				<Button
					type="button"
					variant={isListening ? "destructive" : "outline"}
					size="icon"
					onClick={toggleListening}
					disabled={isProcessing}
					className={isListening ? "animate-pulse" : ""}
					title={isListening ? "Parar de ouvir" : "Falar (Mic)"}
				>
					{isListening ? (
						<Square className="h-4 w-4" />
					) : (
						<Mic className="h-4 w-4" />
					)}
				</Button>

				<Input
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					placeholder={isListening ? "Ouvindo..." : placeholder}
					className="flex-1"
					disabled={isProcessing || isListening}
				/>

				<Button
					type="submit"
					size="icon"
					disabled={isProcessing || !inputValue.trim()}
					variant="default"
					className="bg-blue-600 hover:bg-blue-700"
				>
					{isProcessing ? (
						<Loader2 className="h-4 w-4 animate-spin" />
					) : (
						<Send className="h-4 w-4" />
					)}
				</Button>
			</form>
		);
	},
);
ActionInput.displayName = "ActionInput";
