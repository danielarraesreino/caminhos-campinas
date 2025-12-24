"use client";

import { useChat } from "@ai-sdk/react";
import { Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGameContext } from "@/contexts/GameContext";

export function GameChat() {
	const gameState = useGameContext();
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const [inputValue, setInputValue] = useState("");
	const [isProcessing, setIsProcessing] = useState(false);

	// biome-ignore lint/suspicious/noExplicitAny: library types mismatch workaround
	const { messages, sendMessage, isLoading, error } = useChat({
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
		onError: (err: any) => {
			console.error("❌ Chat Error:", err);
		},
	} as any) as any;

	// Auto-scroll logic
	// biome-ignore lint/correctness/useExhaustiveDependencies: scroll should accept latest messages
	useEffect(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	// ✅ Non-blocking submit handler
	const handleSend = async (e?: React.FormEvent) => {
		e?.preventDefault(); // CRITICAL: Stop form submission refresh
		if (!inputValue.trim() || isLoading || isProcessing) return;

		const userText = inputValue.trim();
		setInputValue("");
		setIsProcessing(true);

		try {
			// Using sendMessage found in runtime instrospection
			await sendMessage({
				role: "user",
				content: userText,
			});
		} catch (err) {
			console.error("Erro ao enviar mensagem:", err);
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

				{messages.map((m: any) => (
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
									src={`https://api.dicebear.com/7.x/bottts/svg?seed=${m.id || "system"}`}
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
