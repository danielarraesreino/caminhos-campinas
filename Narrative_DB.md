import type { GameState } from "./store";

export type TriggerType = "HUNGER_LOW" | "HYGIENE_LOW" | "RANDOM";

export interface DilemmaOption {
	label: string;
	consequence: string;
	effect: Partial<Omit<GameState, "actions" | "inventory" | "day" | "time">>;
}

export interface Dilemma {
	id: string;
	title: string;
	description: string;
	trigger: {
		type: TriggerType;
		value: number;
	};
	options: DilemmaOption[];
}

export const GAME_DILEMMAS: Dilemma[] = [
	{
		id: "hunger-emergency",
		title: "Fome Apertando",
		description:
			"O dia está acabando e sua barriga dói de fome. Você precisa encontrar algo para comer logo ou sua saúde começará a declinar rapidamente.",
		trigger: { type: "HUNGER_LOW", value: 30 },
		options: [
			{
				label: "Ir ao Bom Prato (R$ 1)",
				consequence:
					"O Bom Prato é uma rede de restaurantes populares em São Paulo/Campinas que garante alimentação de qualidade por um preço simbólico. Você comeu bem e economizou.",
				effect: { hunger: 80, money: -1 },
			},
			{
				label: "Comprar Salgado na Rua (R$ 5)",
				consequence:
					"Comprar comida de rua é mais rápido, mas muito mais caro para quem não tem renda fixa. Você gastou quase tudo o que tinha.",
				effect: { hunger: 40, money: -5 },
			},
			{
				label: "Pedir Ajuda na Praça",
				consequence:
					"Pedir ajuda é um direito, mas a constante exposição e o estigma podem afetar seu bem-estar emocional e sanidade ao longo do tempo.",
				effect: { hunger: 20, sanity: -10 },
			},
		],
	},
	{
		id: "hygiene-crisis",
		title: "A Necessidade do Banho",
		description:
			"Você não toma um banho completo há dias. O cansaço físico e o desconforto estão começando a afetar sua disposição e como as pessoas interagem com você.",
		trigger: { type: "HYGIENE_LOW", value: 20 },
		options: [
			{
				label: "Procurar Centro Pop",
				consequence:
					"Os Centros Pop são unidades públicas onde é possível tomar banho, lavar roupas e receber atendimento social. Você se sente renovado e recebeu um kit de higiene.",
				effect: { hygiene: 90, sanity: 5 },
			},
			{
				label: "Usar Chafariz/Rio",
				consequence:
					"Banhar-se em locais públicos impróprios pode expor você a doenças e é perigoso. Sua higiene melhorou pouco e sua saúde sofreu.",
				effect: { hygiene: 30, health: -10 },
			},
		],
	},
	{
		id: "social-approach",
		title: "Abordagem na Praça",
		description:
			"Um educador social do coletivo 'A Rua Tem Voz' se aproxima com um sorriso, oferecendo informações sobre seus direitos e serviços disponíveis na cidade.",
		trigger: { type: "RANDOM", value: 0.1 },
		options: [
			{
				label: "Ouvir e fazer o cadastro",
				consequence:
					"Estar documentado e cadastrado em redes de apoio é o primeiro passo para a autonomia. Você agora sabe onde buscar ajuda jurídica e documentação.",
				effect: { sanity: 10 },
			},
		],
	},
];
[
	{
		"id": "cp1",
		"name": "Centro Pop I",
		"type": "shelter",
		"coords": [-22.9153, -47.0658],
		"opening_hours": "08:00 - 17:00",
		"address": "Rua José Paes de Andrade, 1200 - Vila Brandina",
		"description": "Atendimento especializado para população em situação de rua."
	},
	{
		"id": "cp2",
		"name": "Centro Pop II",
		"type": "shelter",
		"coords": [-22.9205, -47.0701],
		"opening_hours": "08:00 - 17:00",
		"address": "Rua Prof. Eurycledes de Jesus Zerbini, 100 - Jardim Regente",
		"description": "Serviço de abordagem social e acolhimento."
	},
	{
		"id": "bp_centro",
		"name": "Bom Prato Centro",
		"type": "food",
		"coords": [-22.9102, -47.0605],
		"opening_hours": "10:30 - 14:00 (Almoço), 17:00 - 18:00 (Jantar)",
		"address": "Av. Dr. Moraes Sales, 384 - Centro",
		"description": "Refeições a R$ 1,00."
	}
]
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
