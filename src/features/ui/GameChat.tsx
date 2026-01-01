"use client";

import { useChat } from "@ai-sdk/react";
import { MapPin, Send } from "lucide-react";
import Image from "next/image";
import {
	type FormEvent,
	useCallback,
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
import CAMPINAS_DILEMMAS from "@/data/dilemmas-campinas.json";
import { DilemmaMatcher } from "@/services/DilemmaMatcher";
import { ActionInput } from "./ActionInput";

export function GameChat({
	initialMessages,
	onDilemmaTriggered,
}: {
	initialMessages?: any[];
	onDilemmaTriggered?: (id: string) => void;
}) {
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
		initialMessages: initialMessages || [],
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

	const handleAction = useCallback(
		async (text: string, audioBlob?: Blob | null) => {
			if (!text.trim() && !audioBlob) return;

			// Hybrid Engine Interception
			if (text) {
				// biome-ignore lint/suspicious/noExplicitAny: JSON import handling
				const rawDilemmas: any = CAMPINAS_DILEMMAS;

				let dilemmasArray: any[] = [];
				if (Array.isArray(rawDilemmas)) {
					dilemmasArray = rawDilemmas;
				} else if (rawDilemmas && Array.isArray(rawDilemmas.default)) {
					dilemmasArray = rawDilemmas.default;
				} else if (rawDilemmas && typeof rawDilemmas === "object") {
					// Fallback: try to find an array property or assume it's like { dilemmas: [...] }
					dilemmasArray =
						(Object.values(rawDilemmas).find((val) =>
							Array.isArray(val),
						) as any[]) || [];
				}

				const matchedDilemma = DilemmaMatcher.findBestDilemma(
					text,
					userLocation,
					dilemmasArray,
					[], // services can be passed if available via props or context if needed, but for now empty
				);

				if (matchedDilemma) {
					console.log(`[HybridEngine] Interceptado: ${matchedDilemma.id}`);
					if (typeof onDilemmaTriggered === "function") {
						onDilemmaTriggered(matchedDilemma.id);
						return;
					}
					console.error(
						"ERRO CRITICAL: Função de dilema não conectada no GameChat!",
					);
					return;
				}
			}

			setIsThinking(true);

			// Audio Handling
			const audioUrl = "";
			if (audioBlob) {
				console.log(
					"Audio blob active - Saving locally for DEBUG/OFFLINE mode",
				);
				try {
					const { getDB } = await import("@/features/offline-db/db");
					const db = await getDB();
					if (db) {
						await db.post({
							type: "audio_pending",
							blob: audioBlob,
							createdAt: new Date().toISOString(),
							debug: true,
						});
					}
				} catch (dbError) {
					console.error("Failed to save audio fallback", dbError);
				}
			}

			try {
				append({
					role: "user",
					content: text,
					data: {
						audioUrl: audioUrl,
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
			} catch (err) {
				console.error("Error appending message:", err);
				setIsThinking(false);
			}
		},
		[append, userLocation, onDilemmaTriggered, gameState],
	);

	// Helper to highlight logic
	const renderMessageContent = (content: string) => {
		// Identify terms and split string
		const terms = Object.keys(GLOSSARY_TERMS);
		// Create a regex to match any term, case insensitive
		const regex = new RegExp(`(${terms.join("|")})`, "gi");

		const parts = (content || "").split(regex);

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
										src="/avatars/avatar_1.png"
										alt="Mestre"
										width={32}
										height={32}
										className="rounded-full bg-purple-100 shadow-sm border border-purple-200"
									/>
								)}
							</div>

							{/* Bubble */}
							<div
								className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${
									m.role === "user"
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
								src="/avatars/avatar_1.png"
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
