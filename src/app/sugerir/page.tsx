"use client";

import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function SugerirPage() {
	const [text, setText] = useState("");
	const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">(
		"idle",
	);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!text.trim()) return;

		setSaveStatus("idle");
		try {
			const response = await fetch("/api/stories", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ content: text }),
			});

			if (!response.ok) throw new Error("Falha ao salvar história");

			setSaveStatus("success");
			setText("");

			setTimeout(() => setSaveStatus("idle"), 3000);
		} catch (err) {
			console.error(err);
			setSaveStatus("error");
		}
	};

	if (!mounted) return null;

	return (
		<main className="min-h-screen bg-slate-950 text-white p-6 flex flex-col items-center justify-center">
			<div className="max-w-md w-full flex flex-col h-full max-h-[800px]">
				<header className="mb-8 flex items-center gap-4">
					<Link
						href="/"
						className="p-2 rounded-full hover:bg-slate-800 transition-colors"
					>
						<ArrowLeft className="w-6 h-6" />
					</Link>
					<h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
						Coletor de Dilemas
					</h1>
				</header>

				<form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-6">
					<div className="space-y-2 flex-1 flex flex-col">
						<h2 className="text-slate-300 font-bold text-lg" id="story-label">
							O que aconteceu com você hoje?
						</h2>
						<textarea
							id="story"
							aria-labelledby="story-label"
							value={text}
							onChange={(e) => setText(e.target.value)}
							placeholder="Conte sua história, um dilema que viveu ou uma observação da rua..."
							className="flex-1 w-full bg-slate-900 border-slate-800 rounded-lg p-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-lg leading-relaxed min-h-[200px]"
						/>
					</div>

					<Button
						type="submit"
						disabled={!text.trim() || saveStatus === "success"}
						aria-label={saveStatus === "success" ? "História enviada com sucesso" : "Salvar história permanentemente"}
						className={`w-full py-10 text-xl font-bold transition-all ${saveStatus === "success"
								? "bg-green-600 hover:bg-green-700 ring-2 ring-green-500 ring-offset-2 ring-offset-slate-950"
								: "bg-blue-600 hover:bg-blue-700 active:scale-95"
							}`}
					>
						{saveStatus === "success" ? (
							<span className="flex items-center gap-2 animate-in zoom-in spin-in-12">
								Enviado com Sucesso! ✨
							</span>
						) : (
							<span className="flex items-center gap-2">
								<Save className="mr-2 w-7 h-7" aria-hidden="true" /> Salvar História
							</span>
						)}
					</Button>
				</form>

				{saveStatus === "success" && (
					<div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-center animate-in fade-in slide-in-from-bottom-2">
						<p className="font-bold">História salva no dispositivo!</p>
						<p className="text-sm opacity-80 mt-1">
							Ela será exportada junto com a telemetria.
						</p>
					</div>
				)}
			</div>
		</main>
	);
}
