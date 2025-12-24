"use client";

import { MapPin } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useGameContext } from "@/contexts/GameContext";
import { useServices } from "@/contexts/ServicesContext";
import { useDilemmaMatcher } from "@/hooks/useDilemmaMatcher";
import { ActionInput } from "./ActionInput";

interface ChatMessage {
	id: string;
	role: "user" | "system";
	content: string;
}

export function GameChat() {
	const gameState = useGameContext();
	const { services } = useServices();
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const [isProcessing, setIsProcessing] = useState(false);
	const [messages, setMessages] = useState<ChatMessage[]>([]);
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

	// Auto-scroll
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	// Use the new hook for intelligent matching
	const { findMatch } = useDilemmaMatcher();

	const handleAction = async (text: string, audioBlob?: Blob | null) => {
		setIsProcessing(true);

		// 1. Add User Message
		const newMessage: ChatMessage = {
			id: Date.now().toString(),
			role: "user",
			content: text,
		};
		setMessages((prev) => [...prev, newMessage]);

		// 2. Upload Audio (Fire-and-forget for research/telemetry)
		if (audioBlob) {
			const uploadUrl = process.env.NEXT_PUBLIC_HOSTINGER_API_URL;
			const secret = process.env.NEXT_PUBLIC_UPLOAD_SECRET;

			if (uploadUrl && secret) {
				const formData = new FormData();
				formData.append("audio", audioBlob, `voice_${Date.now()}.webm`);
				formData.append("transcript", text);
				formData.append("key", secret);

				fetch(uploadUrl, {
					method: "POST",
					body: formData,
				}).catch((err) => console.error("Audio upload failed", err));
			}
		}

		// 3. Match Dilemma (Deterministic & Local)
		// Small delay to simulate processing and feel natural
		await new Promise((resolve) => setTimeout(resolve, 600));

		// Use the new hook which encapsulates services + distance logic + keyword matching
		const coords = userLocation ? [userLocation.lat, userLocation.lng] as [number, number] : null;
		const bestMatch = findMatch(text, coords);

		if (bestMatch) {
			// Trigger Dilemma
			gameState.setActiveDilemma(bestMatch.id);
			setMessages((prev) => [
				...prev,
				{
					id: (Date.now() + 1).toString(),
					role: "system",
					content: `⚠️ Situação Identificada: ${bestMatch.title}`,
				},
			]);
		} else {
			// No match - Contextual Hint (Fallback AI or hardcoded hints)
			// Using the previous heuristic fallback, but now it's explicit "Flavor Text"
			let response = "Você olha ao redor, mas a rua parece vazia e silenciosa.";

			const lowerText = text.toLowerCase();
			if (lowerText.includes("fome") || lowerText.includes("comida")) {
				response =
					"Você sente fome. Tente buscar o 'Bom Prato' ou 'Refeitório' no mapa acima.";
			} else if (
				lowerText.includes("saude") ||
				lowerText.includes("dor") ||
				lowerText.includes("médico")
			) {
				response =
					"Sua condição de saúde preocupa. Procure pelo 'Consultório na Rua' ou 'CAPS'.";
			} else if (
				lowerText.includes("trabalho") ||
				lowerText.includes("dinheiro")
			) {
				response =
					"O movimento está fraco. Talvez a 'Casa das Oficinas' ou o 'CPAT' tenham oportunidades no centro.";
			} else if (lowerText.includes("dormir") || lowerText.includes("sono")) {
				response = "A noite é perigosa. Procure o 'SAMIM' ou a 'Casa de Passagem'.";
			}

			setMessages((prev) => [
				...prev,
				{
					id: (Date.now() + 1).toString(),
					role: "system",
					content: response,
				},
			]);
		}
		setIsProcessing(false);
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

				{messages.map((m) => (
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
							{m.content}
						</div>
					</div>
				))}

				{isProcessing && (
					<div className="text-xs text-gray-400 animate-pulse ml-4">
						Processando contexto e localização...
					</div>
				)}

				<div ref={messagesEndRef} />
			</div>

			<ActionInput
				onAction={handleAction}
				isProcessing={isProcessing}
				placeholder="O que você faz? (Fale ou Digite)"
			/>
		</div>
	);
}
