"use client";

import {
	ArrowLeft,
	BookOpen,
	GraduationCap,
	ShieldAlert,
	Wallet,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { AudioReader } from "@/components/ui/AudioReader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useGameContext } from "@/contexts/GameContext";

export default function EducationPage() {
	const { pdu, completePduStage } = useGameContext();

	// Integrate with PDU: If user visits this page and has EDUCATION objective, mark step as done
	useEffect(() => {
		if (pdu.isActive && pdu.objective === "EDUCACAO") {
			completePduStage("concluir_curso_direitos");
		}
	}, [pdu.isActive, pdu.objective, completePduStage]);

	return (
		<div className="min-h-screen bg-black text-white selection:bg-yellow-500/30">
			{/* Realismo Sóbrio Header */}
			<div className="relative h-72 md:h-80 w-full overflow-hidden border-b border-zinc-800">
				<Image
					src="/images/sobrio/landing.png" // Reusing the landing image for thematic consistency
					alt="Fundo Educação"
					fill
					className="object-cover opacity-30 grayscale"
					priority
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

				<div className="relative z-10 container mx-auto px-6 pt-8 h-full flex flex-col">
					<header className="flex items-center gap-4 mb-12">
						<Link href="/">
							<Button
								variant="ghost"
								size="icon"
								className="text-zinc-400 hover:bg-zinc-800 hover:text-white rounded-full border border-zinc-700/50"
							>
								<ArrowLeft className="w-5 h-5" />
							</Button>
						</Link>
						<span className="text-xs font-mono uppercase tracking-[0.3em] text-zinc-500">
							Educação & Autonomia
						</span>
					</header>

					<div className="mt-auto pb-10">
						<Badge className="mb-4 bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20 px-3 py-1 text-[10px] font-mono">
							SABER É PODER
						</Badge>
						<h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-[0.9]">
							De Sobrevivente
							<br />
							<span className="text-yellow-400">a Educador.</span>
						</h1>
					</div>
				</div>
			</div>

			<main className="container mx-auto px-6 -mt-10 space-y-6 pb-24 relative z-20">
				<div className="max-w-4xl mx-auto space-y-4">
					<Link href="/curso">
						<ModuleCard
							icon={<ShieldAlert className="w-7 h-7 text-yellow-500" />}
							title="Direitos e Abordagem"
							desc="Saiba seus direitos durante abordagens. O que é legal, o que é abuso e como proteger seus pertences."
							status="Disponível"
							accent="yellow"
						/>
					</Link>

					<ModuleCard
						icon={<BookOpen className="w-7 h-7 text-zinc-400" />}
						title="Redução de Danos"
						desc="Prevenção e saúde sem julgamentos. Como acessar o Consultório na Rua e o suporte da rede SAMIM."
						status="Disponível"
						accent="zinc"
					/>

					<ModuleCard
						icon={<Wallet className="w-7 h-7 text-zinc-600" />}
						title="Acesso à Renda"
						desc="Bolsa Família e BPC para pessoas sem endereço fixo. Documentação e declarações necessárias."
						status="Em Breve"
						accent="zinc"
						disabled
					/>

					<div className="pt-8 flex flex-col items-center gap-4">
						<p className="text-zinc-500 text-xs font-medium max-w-sm text-center italic">
							"Conhecimento é a única ferramenta de soberania que ninguém pode
							confiscar."
						</p>
						<Button
							variant="outline"
							className="gap-2 border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-white hover:bg-zinc-800 h-11 px-8 rounded-xl font-bold uppercase tracking-widest text-[10px]"
						>
							<GraduationCap className="w-4 h-4" /> Ver Certificados
						</Button>
					</div>
				</div>
			</main>
		</div>
	);
}

interface ModuleCardProps {
	icon: React.ReactNode;
	title: string;
	desc: string;
	status: string;
	accent: "yellow" | "zinc";
	disabled?: boolean;
}

function ModuleCard({
	icon,
	title,
	desc,
	status,
	accent,
	disabled,
}: ModuleCardProps) {
	return (
		<Card
			className={`group relative overflow-hidden bg-zinc-900/40 border p-1 rounded-2xl transition-all duration-300 ${
				disabled
					? "border-zinc-800 opacity-50 grayscale"
					: "border-zinc-800 hover:border-yellow-500/50 hover:bg-zinc-900/60 shadow-2xl"
			}`}
		>
			<div className="p-5 flex items-start gap-4">
				<div
					className={`shrink-0 p-3 rounded-xl bg-zinc-950 border border-zinc-800 group-hover:scale-110 transition-transform duration-300 ${accent === "yellow" ? "shadow-[0_0_15px_rgba(234,179,8,0.1)]" : ""}`}
				>
					{icon}
				</div>
				<div className="flex-1 space-y-3">
					<div className="flex justify-between items-start">
						<h3
							className={`font-black text-lg uppercase tracking-tight leading-none ${accent === "yellow" ? "text-zinc-100" : "text-zinc-400"}`}
						>
							{title}
						</h3>
						<Badge
							variant="outline"
							className={`text-[9px] font-mono px-2 py-0 border-zinc-700/50 ${
								disabled
									? "bg-transparent text-zinc-600"
									: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
							}`}
						>
							{status}
						</Badge>
					</div>
					<p className="text-zinc-400 text-sm leading-snug pr-4">{desc}</p>

					<div className="pt-1">
						<AudioReader
							text={`${title}. ${desc}`}
							className="h-8 bg-zinc-950/50 border-zinc-800/50 text-zinc-500"
						/>
					</div>
				</div>
			</div>

			{!disabled && (
				<div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
					<div className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(234,179,8,0.8)]" />
				</div>
			)}
		</Card>
	);
}
