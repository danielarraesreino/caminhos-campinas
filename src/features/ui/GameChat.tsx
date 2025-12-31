"use client";

import { useChat } from "@ai-sdk/react";
import { MapPin, Send } from "lucide-react";
import Image from "next/image";
import {
	type FormEvent,
	useEffect,
	useRef,
	useState,
	useTransition,
} from "react";
import { Button } from "@/components/ui/button";
import {
	GLOSSARY_TERMS,
	GlossaryTooltip,
} from "@/components/ui/GlossaryTooltip";
import { useGameContext } from "@/contexts/GameContext";
import { ActionInput } from "./ActionInput";

export function GameChat() {
	const gameState = useGameContext();
	const [isPending, startTransition] = useTransition();
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const [isThinking, setIsThinking] = useState(false);

	const [userLocation, setUserLocation] = useState<{
		lat: number;
		lng: number;
	} | null>(null);

	// Get location on mount
	useEffect(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					setUserLocation({
						lat: position.coords.latitude,
						lng: position.coords.longitude,
					});
				},
				(error) => console.warn("Location access denied", error),
			);
		}
	}, []);

	// Configuração corrigida sem rota de API explícita se for padrão
	const {
		messages,
		input,
		handleInputChange,
		handleSubmit,
		isLoading,
		error,
		append,
	} = useChat({
		api: "/api/chat",
		// Rate limiting handling
		onError: (err: any) => {
			console.error("Chat error details:", err);
			// Try to recover UI state
			setIsThinking(false);
			// Optional: Trigger a toast or user feedback here if needed
		},
		onFinish: () => {
			setIsThinking(false);
		},
	} as any) as any;

	// Reset thinking when messages change (received new message)
	useEffect(() => {
		if (messages.length > 0) {
			setIsThinking(false);
		}
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const handleAction = async (text: string, audioBlob?: Blob | null) => {
		if (!text.trim() && !audioBlob) return;

		setIsThinking(true);

		// Upload Audio if exists
		let audioUrl = "";
		if (audioBlob) {
			try {
				const formData = new FormData();
				formData.append("audio", audioBlob, "voice_input.webm");

				// Assuming you have an upload endpoint
				// const res = await fetch('/api/upload', { method: 'POST', body: formData });
				// const data = await res.json();
				// audioUrl = data.url;

				// For prototype: mock url or base64
				console.log("Audio blob ready for upload processing");
			} catch (e) {
				console.error("Audio upload failed", e);
			}
		}

		startTransition(() => {
			append({
				role: "user",
				content: text,
				data: {
					audioUrl: audioUrl, // Pass audio URL in data
					gameState: {
						health: gameState.health,
						hunger: gameState.hunger,
						hygiene: gameState.hygiene,
						money: gameState.money,
						time: gameState.time,
						location: userLocation,
					},
				},
			});
		});
	};

	// Helper to highlight logic
	const renderMessageContent = (content: string) => {
		// Identify terms and split string
		const terms = Object.keys(GLOSSARY_TERMS);
		// Create a regex to match any term, case insensitive
		const regex = new RegExp(`(${terms.join("|")})`, "gi");

		const parts = content.split(regex);

		return parts.map((part, i) => {
			// Check if this part matches a term
			const matchedTerm = terms.find(
				(t) => t.toLowerCase() === part.toLowerCase(),
			);
			if (matchedTerm) {
				return (
					// biome-ignore lint/suspicious/noArrayIndexKey: order is static based on split
					<GlossaryTooltip key={`${i}-${matchedTerm}`} term={matchedTerm}>
						{part}
					</GlossaryTooltip>
				);
			}
			return part;
		});
	};

	return (
		<div className="flex flex-col h-full border rounded-lg bg-gray-50 dark:bg-gray-900 overflow-hidden">
			{/* Location Status Indicator */}
			<div className="bg-zinc-100 dark:bg-zinc-950 px-4 py-1 text-[10px] text-zinc-500 border-b flex justify-between">
				<span>Chat de Interação (Voz Ativa)</span>
				<span className="flex items-center gap-1">
					<MapPin className="w-3 h-3" />
					{userLocation ? "GPS: Precisão Alta" : "GPS: Desativado"}
				</span>
			</div>

			<div className="flex-1 overflow-y-auto p-4 space-y-4">
				{messages.length === 0 && (
					<div className="text-center text-gray-500 mt-10">
						<p>Você acorda na Praça do Rosário.</p>
						<p className="text-xs mt-2">
							Fale ou digite sua necessidade.
							<br />
							ex: "Estou com fome", "Preciso de médico"
						</p>
					</div>
				)}

				{
					// biome-ignore lint/suspicious/noExplicitAny: simple type definition
					messages.map((m: any) => (
						<div
							key={m.id}
							className={`flex gap-3 w-full px-2 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}
						>
							{/* Avatar */}
							<div className="flex-shrink-0 mt-1">
								{m.role === "user" ? (
									<div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-sm">
										{/* biome-ignore lint/a11y/noSvgWithoutTitle: decorative icon */}
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round"
											className="text-white"
										>
											<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
											<circle cx="12" cy="7" r="4" />
										</svg>
									</div>
								) : (
									<Image
										src={`https://api.dicebear.com/7.x/bottts/svg?seed=system`}
										alt="Mestre"
										width={32}
										height={32}
										className="rounded-full bg-purple-100 shadow-sm border border-purple-200"
									/>
								)}
							</div>

							{/* Bubble */}
							<div
								className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${m.role === "user"
									? "bg-blue-600 text-white rounded-tr-none"
									: "bg-white dark:bg-gray-800 border border-slate-100 dark:border-slate-700 rounded-tl-none"
									}`}
							>
								{m.role === "assistant"
									? renderMessageContent(m.content)
									: m.content}
							</div>
						</div>
					))
				}

				{/* Loading/Thinking Indicator */}
				{(isLoading || isPending || isThinking) && (
					<div className="flex gap-3 w-full px-2">
						<div className="flex-shrink-0 mt-1">
							<Image
								src={`https://api.dicebear.com/7.x/bottts/svg?seed=system`}
								alt="Mestre"
								width={32}
								height={32}
								className="rounded-full bg-purple-100 shadow-sm border border-purple-200 opacity-70"
							/>
						</div>
						<div className="bg-white dark:bg-gray-800 border border-slate-100 dark:border-slate-700 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-1">
							<span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
							<span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
							<span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
						</div>
					</div>
				)}

				{error && (
					<div className="text-xs text-red-500 ml-4">
						Erro ao processar mensagem. Tente novamente.
					</div>
				)}

				<div ref={messagesEndRef} />
			</div>

			<div className="p-3 bg-white dark:bg-gray-950 border-t">
				<ActionInput
					onAction={handleAction}
					isProcessing={isLoading || isPending || isThinking}
					placeholder="Fale ou digite..."
				/>
			</div>
		</div>
	);
}
