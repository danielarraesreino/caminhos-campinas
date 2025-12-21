"use client";

import { ArrowLeft, Coffee, Heart, Utensils } from "lucide-react";
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
		<div className="flex flex-col min-h-screen p-4 max-w-md mx-auto gap-4">
			<header className="flex items-center gap-2 mb-4">
				<Link href="/">
					<Button variant="ghost" size="icon">
						<ArrowLeft className="h-4 w-4" />
					</Button>
				</Link>
				<h1 className="text-xl font-bold">Apoie o Projeto</h1>
			</header>

			<div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg text-sm mb-4">
				<p>
					Este jogo é gratuito para a população que precisa. Seu apoio mantém os
					servidores (e a esperança) online.
				</p>
			</div>

			<div className="grid gap-4">
				<SupportCard
					title="O Café"
					price="R$ 5,00"
					description="Paga o servidor por um dia e garante um café virtual."
					icon={Coffee}
					tier="cafe"
					loading={loading}
					onClick={handleSupport}
				/>

				<SupportCard
					title="A Marmita"
					price="R$ 15,00"
					description="Alimenta o desenvolvimento de novas features."
					icon={Utensils}
					tier="marmita"
					loading={loading}
					onClick={handleSupport}
				/>

				<SupportCard
					title="O Abrigo"
					price="R$ 50,00"
					description="Torne-se um patrono oficial do projeto."
					icon={Heart}
					tier="abrigo"
					loading={loading}
					onClick={handleSupport}
				/>
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
}: any) {
	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center gap-2">
						<Icon className="h-5 w-5" />
						{title}
					</CardTitle>
					<span className="font-bold text-lg">{price}</span>
				</div>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardFooter>
				<Button
					className="w-full"
					onClick={() => onClick(tier)}
					disabled={loading !== null}
				>
					{loading === tier ? "Processando..." : "Apoiar"}
				</Button>
			</CardFooter>
		</Card>
	);
}
