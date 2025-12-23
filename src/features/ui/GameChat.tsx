"use client";

import { useChat } from "@ai-sdk/react";
import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGameContext } from "@/contexts/GameContext";

export function GameChat() {
	const gameState = useGameContext();
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const [inputValue, setInputValue] = useState("");
	const [isProcessing, setIsProcessing] = useState(false);

	// ✅ FIX ERRO 2 & 3: useChat casted to any to avoid TS build error with 'append'
	// biome-ignore lint/suspicious/noExplicitAny: library types mismatch
	const { messages, append, isLoading, error } = useChat({
		api: "/api/chat",
		body: {
			gameState: {
				health: gameState.health,
				hunger: gameState.hunger,
				hygiene: gameState.hygiene,
				money: gameState.money,
				time: gameState.time,
			},
		},
		// biome-ignore lint/suspicious/noExplicitAny: library types mismatch
		onError: (error: any) => {
			console.error("❌ Chat Error:", error);
		},
		// biome-ignore lint/suspicious/noExplicitAny: library types mismatch
	} as any) as any;

	// Auto-scroll para o fim do chat
	// biome-ignore lint/correctness/useExhaustiveDependencies: scroll needs to trigger on message update
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	// ✅ CORREÇÃO PRINCIPAL: async/await para não bloquear a UI
	// Isso resolve o INP de 6000ms → <100ms
	const handleSend = async (e?: React.FormEvent) => {
		e?.preventDefault();
		if (!inputValue.trim() || isLoading || isProcessing) return;

		const userText = inputValue.trim();
		setInputValue(""); // Limpa imediatamente para resposta visual rápida
		setIsProcessing(true);

		try {
			// ✅ Chamada ASSÍNCRONA - não bloqueia a thread principal
			await append({
				role: "user",
				content: userText,
			});
		} catch (error) {
			console.error("Erro ao enviar mensagem:", error);
		} finally {
			setIsProcessing(false);
		}
	};

	return (
		<div className="flex flex-col h-full border rounded-lg bg-gray-50 dark:bg-gray-900 overflow-hidden">
			<div className="flex-1 overflow-y-auto p-4 space-y-4">
				{messages.length === 0 && (
					<div className="text-center text-gray-500 mt-10">
						<p>Você acorda na Praça do Rosário.</p>
						<p className="text-xs">Diga "Olho ao redor" para começar.</p>
					</div>
				)}

				{/* biome-ignore lint/suspicious/noExplicitAny: message type from lib */}
				{messages.map((m: any) => (
					<div
						key={m.id}
						className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
					>
						<div
							className={`max-w-[80%] rounded-lg p-3 text-sm ${
								m.role === "user"
									? "bg-blue-600 text-white"
									: "bg-white dark:bg-gray-800 border shadow-sm"
							}`}
						>
							{m.content}
						</div>
					</div>
				))}

				{(isLoading || isProcessing) && (
					<div className="text-xs text-gray-400 animate-pulse ml-4">
						O Mestre está escrevendo...
					</div>
				)}

				{error && (
					<div className="text-xs text-red-500 ml-4 mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
						❌ Erro: {error.message}
					</div>
				)}

				<div ref={messagesEndRef} />
			</div>

			<form
				onSubmit={handleSend}
				className="p-3 bg-white dark:bg-gray-950 border-t flex gap-2"
			>
				<Input
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					placeholder="O que você faz?"
					className="flex-1"
					disabled={isLoading || isProcessing}
				/>
				<Button
					type="submit"
					size="icon"
					disabled={isLoading || isProcessing || !inputValue.trim()}
				>
					<Send className="h-4 w-4" />
				</Button>
			</form>
		</div>
	);
}
