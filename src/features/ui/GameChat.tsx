"use client";

import { useChat } from "@ai-sdk/react";
import { Send } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGameContext } from "@/contexts/GameContext";

export function GameChat() {
	const gameState = useGameContext();
	const [input, setInput] = useState("");

	const chatHelpers = useChat({
		onError: (error) => {
			console.error("❌ Chat Error:", error);
			console.error("Error details:", {
				message: error.message,
				stack: error.stack,
				name: error.name,
			});
			alert(`Erro no chat: ${error.message}`);
		},
		onFinish: (message) => {
			console.log("✅ Chat Finished:", message);
		},
	});
	const { messages, append, status, error } = chatHelpers as any;

	const isLoading = status === "submitted" || status === "streaming";

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		console.log("📝 Form submitted");

		if (!input.trim()) {
			console.warn("⚠️ Empty input, ignoring");
			return;
		}

		if (isLoading) {
			console.warn("⚠️ Already loading, ignoring");
			return;
		}

		const userMessage = input;
		console.log("💬 Sending message:", userMessage);
		console.log("🎮 Game state:", {
			health: gameState.health,
			hunger: gameState.hunger,
			hygiene: gameState.hygiene,
			money: gameState.money,
			time: gameState.time,
		});

		setInput("");

		try {
			// Use append with proper message format
			console.log("🚀 Calling append...");
			await append(
				{
					role: "user",
					content: userMessage,
				},
				{
					body: {
						gameState: {
							health: gameState.health,
							hunger: gameState.hunger,
							hygiene: gameState.hygiene,
							money: gameState.money,
							time: gameState.time,
						},
					},
				},
			);
			console.log("✅ Append completed");
		} catch (error) {
			console.error("❌ Error in handleSubmit:", error);
			alert(
				`Erro ao enviar mensagem: ${error instanceof Error ? error.message : String(error)}`,
			);
			setInput(userMessage); // Restore the message
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
				{isLoading && (
					<div className="text-xs text-gray-400 animate-pulse ml-4">
						O Mestre está escrevendo...
					</div>
				)}
				{error && (
					<div className="text-xs text-red-500 ml-4 mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
						❌ Erro: {error.message}
					</div>
				)}
			</div>

			<form
				onSubmit={handleSubmit}
				className="p-3 bg-white dark:bg-gray-950 border-t flex gap-2"
			>
				<Input
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="O que você faz?"
					className="flex-1"
				/>
				<Button type="submit" size="icon" disabled={isLoading}>
					<Send className="h-4 w-4" />
				</Button>
			</form>
		</div>
	);
}
