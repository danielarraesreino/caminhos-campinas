"use client";

import { useChat } from "@ai-sdk/react";
import { MapPin } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
// GLOSSARY_TERMS removed
// GlossaryTooltip removed
import { useGameContext } from "@/contexts/GameContext";
import { GAME_DILEMMAS } from "@/features/game-loop/dilemmas";
import { DilemmaMatcher } from "@/services/DilemmaMatcher";
import { ActionInput } from "./ActionInput";
import { ChatMessage } from "./ChatMessage";
import { VoiceInput } from "./VoiceInput";

export function GameChat({
	initialMessages,
	onDilemmaTriggered,
}: {
	// biome-ignore lint/suspicious/noExplicitAny: generic types
	initialMessages?: any[];
	onDilemmaTriggered?: (id: string) => void;
}) {
	const gameState = useGameContext();
	const [isPending] = useTransition();
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

	const {
		messages,
		setMessages, // [FIX] Destructure setMessages
		// input,
		// handleInputChange,
		// handleSubmit,
		isLoading,
		error,
		append,
	} = useChat({
		api: "/api/chat",
		initialMessages: initialMessages || [],
		// biome-ignore lint/suspicious/noExplicitAny: error handling
		onError: (err: any) => {
			console.error("Chat error details:", err);
			setIsThinking(false);
		},
		onFinish: () => {
			setIsThinking(false);
		},
		// biome-ignore lint/suspicious/noExplicitAny: casting for ai-sdk
	} as any) as any;

	useEffect(() => {
		if (messages.length > 0) {
			setIsThinking(false);
		}
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const handleAction = useCallback(
		async (text: string, audioBlob?: Blob | null) => {
			if (!text.trim() && !audioBlob) return;

			// [FIX] Guard clause removed (moved down to try/catch block with fallback)

			// Hybrid Engine Interception
			if (text) {
				const dilemmasArray = GAME_DILEMMAS;
				console.log(`[GameChat] Input: "${text}"`);

				// [NEW] Social Thermometer Reporting
				// We register every input as a potential occurrence
				gameState.registerOccurrence(text);

				const matchedDilemma = DilemmaMatcher.findBestDilemma(
					text,
					userLocation,
					dilemmasArray,
					[],
				);

				// [NEW] Visceral Inner Monologue Generator
				const getInnerMonologue = (
					dilemmaTitle: string,
					triggerType: string,
				) => {
					// Mapeamento baseado nos textos literários (Mocotó, Malices, Desabafo)
					const thoughts: Record<string, string> = {
						// Fome/Mocotó [Source 289]
						HUNGER_LOW:
							"O estômago embrulha. A fraqueza bate e a boca fica com gosto de chumbo...",
						"Fome Apertando":
							"A dor na barriga não é de hoje. Preciso comer qualquer coisa que pare em pé.",

						// Higiene/Estigma [Source 881]
						HYGIENE_LOW:
							"As pessoas desviam o olhar. O cheiro da rua impregnou na roupa.",
						"A Necessidade do Banho":
							"Sinto a sujeira colada na pele. Um banho frio seria um luxo agora.",

						// Violência/Polícia [Source 876, 1636]
						"Violência Policial":
							"A sirene corta o silêncio. Um calafrio sobe pela espinha. É o Rapa ou a GM?",
						Baculejo:
							"Mãos na cabeça. O coração dispara. 'Documento, vagabundo', eles gritam.",

						// Saúde/Drogas [Source 1621]
						"Crise de Abstinência":
							"O corpo treme. A fissura é um bicho arranhando por dentro.",
						"A Tosse Que Não Passa":
							"O peito chiando... essa tosse seca tá me rasgando.",

						// Padrão (Vazio/Solidão) [Source 2337]
						DEFAULT:
							"Mais um dia. A cidade passa apressada e eu continuo invisível.",
					};

					return (
						thoughts[dilemmaTitle] || thoughts[triggerType] || thoughts.DEFAULT
					);
				};

				// ... inside component ...

				if (matchedDilemma) {
					console.log(`[HybridEngine] Interceptado: ${matchedDilemma.id}`);

					// [FIX] Visual feedback with Inner Monologue
					const userMsg = {
						id: Date.now().toString(),
						role: "user",
						content: text,
					};

					const narrativeThought = getInnerMonologue(
						matchedDilemma.title,
						matchedDilemma.trigger.type,
					);

					const sysMsg = {
						id: (Date.now() + 1).toString(),
						role: "system", // Handled as plain text/thought by ChatMessage
						content: `*${narrativeThought}* \n\n${matchedDilemma.description}`,
					};

					// Optimistic update
					// biome-ignore lint/suspicious/noExplicitAny: Message type
					setMessages((prev: any[]) => [...prev, userMsg, sysMsg]);

					if (typeof onDilemmaTriggered === "function") {
						onDilemmaTriggered(matchedDilemma.id);
						return;
					}
				}
			}

			setIsThinking(true);

			const audioUrl = "";
			if (audioBlob) {
				try {
					const { getDB } = await import("@/features/offline-db/db");
					const db = await getDB();
					if (db) {
						await db.post({
							type: "audio_pending",
							blob: audioBlob,
							createdAt: new Date().toISOString(),
						});
					}
				} catch (dbError) {
					console.error("Failed to save audio fallback", dbError);
				}
			}

			try {
				// 🛡️ Guard: Check if AI SDK is ready
				if (typeof append !== "function") {
					console.error(
						"[GameChat] AI SDK error: 'append' is not a function. Falling back to manual mode.",
					);

					// Manual Fallback: Add user message directly to UI so it doesn't freeze
					const userMsg = {
						id: Date.now().toString(),
						role: "user",
						content: text,
					};
					const fallbackSysMsg = {
						id: (Date.now() + 1).toString(),
						role: "system",
						content:
							"*O sistema de comunicação parece instável...* (Offline Mode: Mensagem registrada localmente)",
					};

					// biome-ignore lint/suspicious/noExplicitAny: Message type
					setMessages((prev: any[]) => [...prev, userMsg, fallbackSysMsg]);
					setIsThinking(false);
					return;
				}

				await append({
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
				// Fallback on error too
				const userMsg = {
					id: Date.now().toString(),
					role: "user",
					content: text,
				};
				const errSysMsg = {
					id: (Date.now() + 1).toString(),
					role: "system",
					content: "*Erro de conexão. Tente novamente.*",
				};
				setMessages((prev: any[]) => [...prev, userMsg, errSysMsg]);
			}
		},
		[append, userLocation, onDilemmaTriggered, gameState, setMessages],
	);

	return (
		<div className="flex flex-col h-full border rounded-lg bg-gray-50 dark:bg-gray-900 overflow-hidden">
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
				{/* biome-ignore lint/suspicious/noExplicitAny: message mapping */}
				{messages.map((m: any) => (
					<ChatMessage key={m.id} m={m} />
				))}
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
				<div className="h-2" />{" "}
				{/* Spacer to prevent content hugging the input */}
			</div>

			<div className="w-full flex gap-2 items-end">
				<ActionInput
					onAction={handleAction}
					isProcessing={isLoading || isPending || isThinking}
					placeholder="Fale ou digite..."
				/>
				<div className="pb-3 pr-3">
					<VoiceInput onTranscription={(text) => handleAction(text)} />
				</div>
			</div>
		</div>
	);
}
