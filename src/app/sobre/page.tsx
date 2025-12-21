import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function SobrePage() {
	return (
		<div className="flex flex-col min-h-screen p-4 max-w-md mx-auto gap-4">
			<header className="flex items-center gap-2 mb-4">
				<Link href="/">
					<Button variant="ghost" size="icon">
						<ArrowLeft className="h-4 w-4" />
					</Button>
				</Link>
				<h1 className="text-xl font-bold">Sobre o Projeto</h1>
			</header>

			<article className="prose dark:prose-invert">
				<h3>A Invisibilidade é uma Escolha?</h3>
				<p>
					Este não é apenas um jogo. É uma ferramenta de{" "}
					<b>conscientização e sobrevivência</b>.
				</p>
				<p>
					Baseado em dados reais da cidade de Campinas (SP), este aplicativo tem
					dois objetivos:
				</p>
				<ol>
					<li>
						<b>Para quem joga (Empatia):</b> Sentir na pele os dilemas diários
						de quem vive na rua. Fome, frio, burocracia e olhares de julgamento.
					</li>
					<li>
						<b>Para quem vive (Utilidade):</b> Um mapa offline real com serviços
						essenciais (Centro Pop, Bom Prato, Abrigos).
					</li>
				</ol>

				<div className="p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg my-4">
					<p className="text-sm font-bold">
						"Não olhe para o outro lado. Olhe nos olhos."
					</p>
				</div>

				<h4>Tecnologia Social</h4>
				<p className="text-sm">
					Desenvolvido como PWA (Progressive Web App) para rodar em qualquer
					celular, mesmo sem internet constante.
				</p>
			</article>

			<footer className="mt-8 text-center">
				<Link href="/apoie">
					<Button className="w-full">Seja um Apoiador</Button>
				</Link>
			</footer>
		</div>
	);
}
