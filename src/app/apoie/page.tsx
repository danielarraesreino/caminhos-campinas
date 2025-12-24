"use client";

import { Coffee, ExternalLink, Heart, Share2, Utensils } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { DilemmaContribution } from "@/features/ui/DilemmaContribution";

interface SupportCardProps {
	title: string;
	price: string;
	description: string;
	icon: React.ElementType;
	tier: string;
	loading: string | null;
	onClick: (tier: string) => void;
	recommended?: boolean;
}

export default function ApoiePage() {
	const [loading, setLoading] = useState<string | null>(null);

	const handleSupport = (tier: string) => {
		setLoading(tier);
		setTimeout(() => {
			setLoading(null);
			alert(
				`Obrigado pelo seu apoio no nível ${tier}! (Simulação de Pagamento)`,
			);
		}, 2000);
	};

	return (
		<div className="min-h-screen bg-slate-950 text-slate-300 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-4xl mx-auto space-y-10">
				<div className="text-center space-y-4">
					<h1 className="text-4xl font-black text-white tracking-tight">
						Apoie a Causa
					</h1>
					<p className="text-lg text-slate-400 max-w-2xl mx-auto">
						Este jogo é 100% gratuito para a população de rua. <br />
						Seu apoio mantém os servidores (e a esperança) online.
					</p>
				</div>

				<div className="grid md:grid-cols-3 gap-6">
					<SupportCard
						title="O Café"
						price="R$ 5,00"
						description="Paga o servidor por um dia e garante um café virtual para a equipe."
						icon={Coffee}
						tier="cafe"
						loading={loading}
						onClick={handleSupport}
					/>

					<SupportCard
						title="A Marmita"
						price="R$ 15,00"
						description="Alimenta o desenvolvimento de novas features e tradução de conteúdos."
						icon={Utensils}
						tier="marmita"
						loading={loading}
						onClick={handleSupport}
						recommended
					/>

					<SupportCard
						title="O Abrigo"
						price="R$ 50,00"
						description="Ajude a manter a estrutura e torne-se um patrono oficial do projeto."
						icon={Heart}
						tier="abrigo"
						loading={loading}
						onClick={handleSupport}
					/>
				</div>

				<p className="text-center text-xs text-slate-600 uppercase tracking-widest mt-12">
					Transparência Total: Todos os custos são abertos no nosso GitHub.
				</p>
			</div>
		</div>
	);
}

function SupportCard({
	title,
	price,
	description,
	icon: Icon,
	tier,
	loading,
	onClick,
	recommended,
}: SupportCardProps) {
	return (
		<Card
			className={`
			bg-slate-900 border-slate-800 text-slate-300 transition-all hover:-translate-y-1 hover:shadow-xl hover:border-slate-700
			${recommended ? "border-blue-500/50 shadow-blue-900/20 ring-1 ring-blue-500/20 relative" : ""}
		`}
		>
			{recommended && (
				<div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
					Mais Popular
				</div>
			)}
			<CardHeader>
				<div className="flex items-center justify-between mb-2">
					<div
						className={`p-3 rounded-lg ${recommended ? "bg-blue-900/30" : "bg-slate-800"}`}
					>
						<Icon
							className={`h-6 w-6 ${recommended ? "text-blue-400" : "text-slate-500"}`}
						/>
					</div>
				</div>
				<CardTitle className="text-2xl font-bold text-white mb-1">
					{title}
				</CardTitle>
				<span className="font-mono text-xl font-bold text-slate-400 mb-4 block border-b border-slate-800 pb-4">
					{price}
				</span>
				<CardDescription className="text-slate-400 min-h-[60px]">
					{description}
				</CardDescription>
			</CardHeader>
			<CardFooter>
				<Button
					className={`w-full font-bold h-12 rounded-xl text-md ${recommended ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-slate-800 hover:bg-slate-700 text-white"}`}
					onClick={() => onClick(tier)}
					disabled={loading !== null}
				>
					{loading === tier ? "Processando..." : "Apoiar Agora"}
				</Button>
			</CardFooter>
		</Card>
	);
}
