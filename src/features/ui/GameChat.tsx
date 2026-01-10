"use client";

import { useChat } from "@ai-sdk/react";
import {
	Keyboard,
	MapPin,
	MessageCircleHeart,
	Mic,
	ShieldAlert,
	Square,
	Thermometer,
	Utensils,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { useGameContext } from "@/contexts/GameContext";
import { GAME_DILEMMAS } from "@/features/game-loop/dilemmas";
import { useNativeSpeech } from "@/hooks/useNativeSpeech";
import { DilemmaMatcher } from "@/services/DilemmaMatcher";
import { ActionInput } from "./ActionInput";
import { ChatMessage } from "./ChatMessage";

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
	const [showKeyboard, setShowKeyboard] = useState(false);

	const [userLocation, setUserLocation] = useState<{
		lat: number;
		lng: number;
	} | null>(null);

	const { speak, isListening, startListening, stopListening } = useNativeSpeech(
		{
			onTranscription: (text) => handleAction(text),
		},
	);

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

	const chat = useChat({
		api: "/api/chat",
		initialMessages: initialMessages || [],
		onError: (err: any) => {
			console.error("Chat error details:", err);
			setIsThinking(false);
		},
		onFinish: (message: any) => {
			setIsThinking(false);
			if (message?.content) {
				speak(message.content);
			}
		},
	} as any);

	const { messages, setMessages, isLoading, error, append } = chat as any;

	// [DEBUG] Log hook status
	useEffect(() => {
		console.log("[GameChat] useChat keys:", Object.keys(chat));
		console.log("[GameChat] append type:", typeof append);
	}, [chat, append]);

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
				const dilemmasArray = GAME_DILEMMAS;
				console.log(`[GameChat] Input: "${text}"`);

				gameState.registerOccurrence(text);

				const matchedDilemma = DilemmaMatcher.findBestDilemma(
					text,
					userLocation,
					dilemmasArray,
					[],
				);

				const getInnerMonologue = (
					dilemmaTitle: string,
					triggerType: string,
				) => {
					const thoughts: Record<string, string> = {
						HUNGER_LOW:
							"O estômago embrulha. A fraqueza bate e a boca fica com gosto de chumbo...",
						"Fome Apertando":
							"A dor na barriga não é de hoje. Preciso comer qualquer coisa que pare em pé.",
						HYGIENE_LOW:
							"As pessoas desviam o olhar. O cheiro da rua impregnou na roupa.",
						"A Necessidade do Banho":
							"Sinto a sujeira colada na pele. Um banho frio seria um luxo agora.",
						"Violência Policial":
							"A sirene corta o silêncio. Um calafrio sobe pela espinha. É o Rapa ou a GM?",
						Baculejo:
							"Mãos na cabeça. O coração dispara. 'Documento, vagabundo', eles gritam.",
						"Crise de Abstinência":
							"O corpo treme. A fissura é um bicho arranhando por dentro.",
						"A Tosse Que Não Passa":
							"O peito chiando... essa tosse seca tá me rasgando.",
						DEFAULT:
							"Mais um dia. A cidade passa apressada e eu continuo invisível.",
					};

					return (
						thoughts[dilemmaTitle] || thoughts[triggerType] || thoughts.DEFAULT
					);
				};

				if (matchedDilemma) {
					console.log(`[HybridEngine] Interceptado: ${matchedDilemma.id}`);

					const narrativeThought = getInnerMonologue(
						matchedDilemma.title,
						matchedDilemma.trigger.type,
					);

					const userMsg = {
						id: Date.now().toString(),
						role: "user",
						content: text,
					};
					const sysMsg = {
						id: (Date.now() + 1).toString(),
						role: "assistant", // Changed to assistant for consistent styling
						content: `*${narrativeThought}* \n\n${matchedDilemma.description}`,
					};

					setMessages((prev: any[]) => [...prev, userMsg, sysMsg]);

					speak(`${narrativeThought}. ${matchedDilemma.description}`);

					if (typeof onDilemmaTriggered === "function") {
						onDilemmaTriggered(matchedDilemma.id);
						return;
					}
				}
			}

			setIsThinking(true);

			try {
				if (typeof append !== "function") {
					console.error("[GameChat] AI SDK error: append is not a function", {
						chatKeys: Object.keys(chat),
					});
					const userMsg = {
						id: Date.now().toString(),
						role: "user",
						content: text,
					};
					const fallbackSysMsg = {
						id: (Date.now() + 1).toString(),
						role: "assistant",
						content:
							"*Conexão com o rádio instável. Tente novamente em alguns segundos.*",
					};
					setMessages((prev: any[]) => [...prev, userMsg, fallbackSysMsg]);
					setIsThinking(false);
					return;
				}

				await append({
					role: "user",
					content: text,
					data: {
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
		[
			append,
			userLocation,
			onDilemmaTriggered,
			gameState,
			setMessages,
			speak,
			chat,
		],
	);

	const QuickActionBtn = ({ icon: Icon, label, color, action }: any) => (
		<button
			type="button"
			onClick={() => handleAction(action)}
			className={`flex flex-col items-center justify-center p-2 rounded-xl border-2 transition-all active:scale-95 ${color} flex-1`}
		>
			<Icon className="w-6 h-6 mb-1" />
			<span className="text-[10px] font-bold uppercase tracking-tight">
				{label}
			</span>
		</button>
	);

	return (
		<div className="flex flex-col h-full bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
			{/* Top Connectivity Bar */}
			<div className="bg-zinc-100 dark:bg-zinc-900 px-4 py-1 text-[10px] text-zinc-500 border-b flex justify-between shrink-0">
				<span>Rádio de Sobrevivência (PTT)</span>
				<span className="flex items-center gap-1">
					<MapPin className="w-3 h-3" />
					{userLocation ? "Sinal Verde" : "Sinal Vermelho"}
				</span>
			</div>

			{/* Panic Row */}
			<div className="flex gap-2 p-3 shrink-0">
				<QuickActionBtn
					icon={Utensils}
					label="Fome"
					color="bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400"
					action="Onde consigo comida agora?"
				/>
				<QuickActionBtn
					icon={Thermometer}
					label="Frio"
					color="bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400"
					action="Onde tem abrigo ou cobertor agora?"
				/>
				<QuickActionBtn
					icon={ShieldAlert}
					label="Perigo"
					color="bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400"
					action="Estou em perigo, onde é seguro?"
				/>
				<QuickActionBtn
					icon={MessageCircleHeart}
					label="Desabafo"
					color="bg-purple-500/10 border-purple-500/30 text-purple-600 dark:text-purple-400"
					action="Só quero conversar com alguém que ouça."
				/>
			</div>

			{/* History */}
			<div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
				{messages.length === 0 && (
					<div className="text-center text-gray-400 mt-10">
						<div
							className={`w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center border-4 ${isListening ? "border-red-500 animate-ping" : "border-zinc-800"}`}
						>
							<Mic
								className={`w-10 h-10 ${isListening ? "text-red-500" : "text-zinc-700"}`}
							/>
						</div>
						<p className="font-bold text-lg">Transmissão Ativa</p>
						<p className="text-xs mt-2 italic">"Câmbio... estou ouvindo."</p>
					</div>
				)}
				{messages.map((m: any) => (
					<ChatMessage key={m.id} m={m} />
				))}
				{(isLoading || isThinking) && (
					<div className="flex gap-3 px-2">
						<div className="bg-zinc-100 dark:bg-zinc-800 border-2 border-green-500/50 rounded-2xl rounded-tl-none px-4 py-3 shadow-lg flex items-center gap-2">
							<span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
							<span className="text-xs font-mono text-green-600 dark:text-green-400 uppercase tracking-widest">
								Sintonizando...
							</span>
						</div>
					</div>
				)}
				<div ref={messagesEndRef} />
			</div>

			{/* Giant PTT Controls */}
			<div className="p-4 bg-zinc-100 dark:bg-zinc-900 border-t shrink-0">
				<div className="flex items-center gap-4">
					<button
						type="button"
						onClick={() => setShowKeyboard(!showKeyboard)}
						className={`p-4 rounded-full border-2 transition-all ${showKeyboard ? "bg-zinc-300 dark:bg-zinc-700 border-zinc-400" : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700"}`}
						title="Teclado"
					>
						<Keyboard className="w-6 h-6" />
					</button>

					<button
						type="button"
						onMouseDown={() => startListening()}
						onMouseUp={() => stopListening()}
						onTouchStart={() => startListening()}
						onTouchEnd={() => stopListening()}
						className={`flex-1 h-28 rounded-3xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 shadow-xl border-4 ${
							isListening
								? "bg-red-600 border-red-400 shadow-[0_0_20px_rgba(220,38,38,0.4)]"
								: "bg-zinc-800 border-zinc-700"
						}`}
					>
						{isListening ? (
							<>
								<div className="w-12 h-12 rounded-full bg-white flex items-center justify-center animate-pulse">
									<Square className="w-6 h-6 text-red-600 fill-red-600" />
								</div>
								<span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">
									Transmitindo...
								</span>
							</>
						) : (
							<>
								<Mic className="w-10 h-10 text-white mb-1" />
								<span className="text-white text-[10px] font-black uppercase tracking-[0.2em]">
									Pressione para falar
								</span>
							</>
						)}
					</button>
				</div>

				{showKeyboard && (
					<div className="mt-4 animate-in slide-in-from-bottom-2 duration-200">
						<ActionInput
							onAction={handleAction}
							isProcessing={isLoading || isPending || isThinking}
							placeholder="Digite se preferir..."
						/>
					</div>
				)}
			</div>
		</div>
	);
}
