"use client";

import {
	Activity,
	ArrowLeft,
	CheckCircle2,
	Map as MapIcon,
	ShieldCheck,
} from "lucide-react";
import { Space_Mono, Syne } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

const syne = Syne({
	subsets: ["latin"],
	weight: ["400", "600", "700", "800"],
	variable: "--font-syne",
});

const spaceMono = Space_Mono({
	subsets: ["latin"],
	weight: ["400", "700"],
	variable: "--font-space-mono",
});

export default function ODSCoveragePage() {
	return (
		<div
			className={`${syne.variable} ${spaceMono.variable} font-sans min-h-screen bg-[#0a0c10] text-[#e8eaf0] selection:bg-[#00e5a0]/30`}
		>
			{/* HERO SECTION */}
			<section className="relative pt-32 pb-20 px-6 md:px-12 border-b border-[#1e2330] overflow-hidden">
				{/* Ambient background matching Realismo Sóbrio */}
				<div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
					<Image
						src="/images/sobrio/impacto.png"
						alt=""
						fill
						className="object-cover grayscale"
						priority
					/>
					<div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/95 to-black" />
				</div>

				<div className="relative z-10 max-w-7xl mx-auto">
					<Link
						href="/impacto"
						className="inline-flex items-center gap-2 text-[#00e5a0] font-mono text-xs uppercase tracking-widest mb-12 hover:gap-4 transition-all"
					>
						<ArrowLeft size={14} /> Voltar ao Painel
					</Link>

					<div className="inline-block px-3 py-1 border border-[#00e5a0]/30 rounded-sm font-mono text-[10px] tracking-[3px] text-[#00e5a0] mb-8 uppercase">
						Avaliação de Impacto — Fevereiro 2026
					</div>

					<h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] mb-8 max-w-4xl tracking-tighter">
						Caminhos Campinas <br />
						<span className="text-[#00e5a0]">×</span> ODS 2030
					</h1>

					<p className="font-mono text-[#5a6070] text-sm md:text-base max-w-2xl leading-relaxed">
						Mapeamento de cobertura das metas dos Objetivos de Desenvolvimento
						Sustentável pelo projeto — com base no Relatório Síntese do IPEA/ODS
						Brasil.
					</p>
				</div>
			</section>

			{/* SUMMARY STATS */}
			<section className="grid grid-cols-1 md:grid-cols-3 border-b border-[#1e2330]">
				<div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-[#1e2330] group hover:bg-[#111318] transition-colors">
					<div className="text-5xl font-extrabold text-[#00e5a0] mb-2">6</div>
					<div className="font-mono text-[10px] tracking-[2px] text-[#5a6070] uppercase">
						ODS com cobertura direta e forte
					</div>
				</div>
				<div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-[#1e2330] group hover:bg-[#111318] transition-colors">
					<div className="text-5xl font-extrabold text-[#f5a623] mb-2">5</div>
					<div className="font-mono text-[10px] tracking-[2px] text-[#5a6070] uppercase">
						ODS com cobertura parcial / lacunas
					</div>
				</div>
				<div className="p-8 md:p-12 group hover:bg-[#111318] transition-colors">
					<div className="text-5xl font-extrabold text-[#ff4d6a] mb-2">3</div>
					<div className="font-mono text-[10px] tracking-[2px] text-[#5a6070] uppercase">
						ODS com oportunidade de expansão
					</div>
				</div>
			</section>

			<main className="max-w-7xl mx-auto px-6 md:px-12 py-20">
				{/* DIRECT COVERAGE SECTION */}
				<section className="mb-24">
					<div className="flex items-center gap-4 mb-12">
						<h2 className="font-mono text-xs tracking-[3px] uppercase text-[#00e5a0] whitespace-nowrap">
							Cobertura Direta e Forte
						</h2>
						<div className="h-px w-full bg-[#1e2330]" />
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[2px] bg-[#1e2330] border border-[#1e2330]">
						<ODSCard
							num="01"
							title="Erradicação da Pobreza"
							status="COBERTO"
							statusColor="green"
							description="Meta 1.3 (sistemas de proteção social) e 1.4 (acesso a serviços básicos) são diretamente endereçadas. Status nacional: em análise / sem dados desagregados por situação de rua."
							coverage="Mapa offline de serviços (Centro Pop, Bom Prato, Abrigos), Guia de Rua com requisitos em tempo real, Cofre Digital para documentos, conexão ao Auxílio Bolsa Família sem endereço fixo."
						/>
						<ODSCard
							num="02"
							title="Fome Zero"
							status="COBERTO"
							statusColor="green"
							description="Meta 2.1 (acesso universal à alimentação adequada). O painel de impacto já expõe 'Risco de Fome' com dado do Censo Pop Rua 2024. Status nacional: piorando — insegurança alimentar ainda alta."
							coverage="Dilema 'Fome Apertando' com mapeamento real do Bom Prato, distribuição de refeições e abordagem pelo SOS Rua. Indicador KPI exposto no Dashboard de Impacto."
						/>
						<ODSCard
							num="03"
							title="Saúde e Bem-Estar"
							status="COBERTO"
							statusColor="green"
							description="Metas 3.4 (saúde mental), 3.5 (dependência química), 3.8 (cobertura universal de saúde) e 3.b (acesso a medicamentos). Status nacional: lacuna crítica nos indicadores."
							coverage="Dilemas sobre CAPS AD, Redução de Danos, Consultório na Rua, Dignidade Menstrual. Módulo de Saúde no curso 'Caminhos da Autonomia'."
						/>
						<ODSCard
							num="04"
							title="Educação de Qualidade"
							status="COBERTO"
							statusColor="green"
							description="Meta 4.3 (acesso a educação técnica), 4.4 (habilidades para emprego), 4.7 (educação para cidadania). Status nacional: alfabetização funcional = sem cobertura de dados."
							coverage="Curso 'Caminhos da Autonomia' com 5 módulos (Direitos Humanos, Serviços, Advocacia, Projeto Final). Formação de 20 alunos por turma, bolsa-formação Mão Amiga."
						/>
						<ODSCard
							num="10"
							title="Redução de Desigualdades"
							status="COBERTO"
							statusColor="green"
							description="Meta 10.2 (inclusão social, econômica e política) e 10.3 (igualdade de oportunidades). Status nacional: indicadores de desigualdade racial = sem dados desagregados suficientes."
							coverage="KPI 'ODS 18 — Equidade Racial', acolhimento explícito de identidades Trans/Travestis, dilemas sobre aporofobia, análise de 'Causa Raiz' no painel de inteligência social."
						/>
						<ODSCard
							num="16"
							title="Paz, Justiça e Eficácia"
							status="COBERTO"
							statusColor="green"
							description="Meta 16.3 (acesso à justiça), 16.6 (transparência), 16.b (políticas não discriminatórias). Status nacional: acesso à justiça para populações vulneráveis = em análise."
							coverage="Dilema 'O Rapa' (violência institucional), módulo Advocacia contra violações, Módulo Direitos Humanos, Portal de Transparência financeira, denúncias no Jornal da Rua."
						/>
					</div>
				</section>

				{/* PARTIAL COVERAGE SECTION */}
				<section className="mb-24">
					<div className="flex items-center gap-4 mb-12">
						<h2 className="font-mono text-xs tracking-[3px] uppercase text-[#f5a623] whitespace-nowrap">
							Cobertura Parcial — Oportunidades
						</h2>
						<div className="h-px w-full bg-[#1e2330]" />
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-1 gap-y-12">
						<ODSCard
							num="05"
							title="Igualdade de Gênero"
							status="PARCIAL"
							statusColor="orange"
							description="Meta 5.1 (eliminar discriminação), 5.2 (violência de gênero). Status nacional: violência contra mulheres na rua = sem monitoramento específico."
							coverage="Dilema 'Dignidade Menstrual' e 'Assédio', avatar com identidade de gênero diversa. Apenas 11,6% da pop. rua é feminina — dado exposto."
							gap="Falta mapeamento de abrigos femininos/LGBTQIA+, rota para delegacias da mulher, dados de violência doméstica como causa prioritária."
						/>
						<ODSCard
							num="06"
							title="Água e Saneamento"
							status="PARCIAL"
							statusColor="orange"
							description="Meta 6.1 (água) e 6.2 (higiene). Status nacional: cobertura em zona urbana informal = crítica, sem dados da população de rua."
							coverage="Dilema 'Necessidade do Banho' com rota para Centro Pop. KPI 'Crise Sanitária' no painel. Categoria 'Higiene' no Guia de Rua."
							gap="Falta mapeamento de banheiros públicos noturnos (citado no dilema Dignidade Menstrual, mas sem dado georreferenciado no mapa)."
						/>
						<ODSCard
							num="08"
							title="Trabalho e Crescimento"
							status="PARCIAL"
							statusColor="orange"
							description="Meta 8.5 (emprego decente). Status nacional: informalidade e juventude vulnerável = indicadores em análise no ODS Brasil."
							coverage="PDU com eixo Trabalho/Renda, parceiro Mão Amiga (qualificação + bolsa), dilema 'Carrinho de Reciclagem'. Módulo com CPAT Campinas."
							gap="A 'Barreira do Endereço' (precisa de CEP para emprego) está no design doc mas ainda sem rota ou dilema implementado tecnicamente."
						/>
						<ODSCard
							num="11"
							title="Cidades e Comunidades"
							status="PARCIAL"
							statusColor="orange"
							description="Meta 11.1 (habitação adequada) — A mais crítica. Status nacional: déficit habitacional = desagregação por pop. de rua ausente."
							coverage="KPI 'Déficit Habitacional (ODS 11)' no painel. PDU com eixo Moradia como objetivo final do jogo."
							gap="Falta rota de auxílio-moradia, mapa de repúblicas conveniadas e dados de Campinas sobre fila de habitação social. Arco 4 em desenvolvimento."
						/>
						<ODSCard
							num="17"
							title="Parcerias e Implementação"
							status="PARCIAL"
							statusColor="orange"
							description="Meta 17.16 (parcerias multissetoriais). Status nacional: dados de parcerias para ODS = metodologia em construção."
							coverage="Hub de Parceiros com 5 instituições (Cáritas, Toca de Assis, Haroldo, Rotaract, Mão Amiga). Portal de transparência financeira."
							gap="Cadastro de parceiros ainda 'Em Breve'. Sem integração de APIs governamentais (SAMIM). Dados abertos não publicados em formato reutilizável."
						/>
					</div>
				</section>

				{/* EXPANSION SECTION */}
				<section className="mb-24">
					<div className="flex items-center gap-4 mb-12">
						<h2 className="font-mono text-xs tracking-[3px] uppercase text-[#ff4d6a] whitespace-nowrap">
							Oportunidades de Expansão
						</h2>
						<div className="h-px w-full bg-[#1e2330]" />
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<ExpansionCard
							num="13"
							title="Clima e Vulnerabilidade"
							description="Meta 13.1 (adaptação a riscos climáticos). Dado de alta relevância e sem cobertura nacional."
							opportunity="Expandir com o dilema 'Chuva e Doença' e eventos climáticos extremos (frio/calor) que afetam desproporcionalmente quem está na rua."
						/>
						<ExpansionCard
							num="09"
							title="Inovação e Infraestrutura"
							description="Meta 9.c (acesso universal à internet). Exclusão digital é um dado crítico sem monitoramento oficial."
							opportunity="Publicar dados de uso do Modo Offline e Survival Radio como contribuição ao indicador de acesso digital para populações vulneráveis."
						/>
						<ExpansionCard
							num="12"
							title="Consumo Responsável"
							description="Meta 12.5 (redução de resíduos). Catadores são fundamentais mas economicamente invisíveis."
							opportunity="Expandir o dilema 'Carrinho de Reciclagem' com dados reais de cooperativas em Campinas, conectando a uma meta nacional sem cobertura."
						/>
					</div>
				</section>

				{/* UNIQUE DIFFERENTIATORS */}
				<section className="mb-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
					<HighlightCard
						icon={<MapIcon className="text-[#00e5a0]" />}
						title="Serious Game Social"
						description="Metodologia 'Sentir para Entender' baseada em dados reais do Censo 2024 para a Meta 4.7 (educação para cidadania)."
					/>
					<HighlightCard
						icon={<Activity className="text-[#00e5a0]" />}
						title="Modo Audio-First"
						description="PWA com síntese de voz e modo offline-first como resposta direta à exclusão digital (ODS 9)."
					/>
					<HighlightCard
						icon={<ShieldCheck className="text-[#00e5a0]" />}
						title="Cofre Digital Local"
						description="Armazenamento criptografado no cliente resolve a barreira documental para ODS 1, 8 e 16 sem servidores externos."
					/>
					<HighlightCard
						icon={<CheckCircle2 className="text-[#00e5a0]" />}
						title="Telemetria Social"
						description="23 propriedades coletadas criam um dataset inédito de comportamento e lacunas em serviços públicos."
					/>
				</section>

				{/* ROADMAP SECTION */}
				<section className="bg-[#111318] border border-[#1e2330] rounded-sm p-8 md:p-12">
					<h2 className="text-3xl font-extrabold mb-12 tracking-tight">
						Roadmap de <span className="text-[#00e5a0]">Alinhamento ODS</span>
					</h2>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-12">
						<RoadmapItem
							num="01"
							title="Acesso à Renda (ODS 8)"
							description="Implementar rota de Bolsa Família sem endereço e dilema da 'Barreira do Endereço'."
						/>
						<RoadmapItem
							num="02"
							title="Georreferenciamento (ODS 5/6)"
							description="Adicionar banheiros noturnos ao services-campinas.json para o dilema Dignidade Menstrual."
						/>
						<RoadmapItem
							num="03"
							title="Arco 4 — Moradia (ODS 11)"
							description="Incluir repúblicas e fila de habitação social como objetivo final da jornada do jogador."
						/>
						<RoadmapItem
							num="04"
							title="Telemetria Aberta (ODS 17)"
							description="Transformar dados anônimos de gameplay em dataset aberto para contribuição em indicadores nacionais."
						/>
					</div>
				</section>
			</main>

			<footer className="border-t border-[#1e2330] py-12 px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-8 opacity-60">
				<div className="font-mono text-[10px] tracking-widest uppercase">
					Caminhos Campinas —{" "}
					<span className="text-[#00e5a0]">caminhos-cps.social</span>
				</div>
				<div className="font-mono text-[10px] tracking-widest uppercase text-center md:text-right">
					Referência:{" "}
					<span className="text-[#00e5a0]">
						odsbrasil.gov.br/relatorio/sintese
					</span>{" "}
					<br />
					IPEA × Censo FEAC 2024
				</div>
			</footer>
		</div>
	);
}

interface ODSCardProps {
	num: string;
	title: string;
	status: string;
	statusColor: "green" | "orange" | "red";
	description: string;
	coverage: string;
	gap?: string;
}

function ODSCard({
	num,
	title,
	status,
	statusColor,
	description,
	coverage,
	gap,
}: ODSCardProps) {
	const colorMap: Record<"green" | "orange" | "red", string> = {
		green: "border-[#00e5a0] text-[#00e5a0]",
		orange: "border-[#f5a623] text-[#f5a623]",
		red: "border-[#ff4d6a] text-[#ff4d6a]",
	};

	return (
		<div className="bg-[#111318] p-8 border-l-[3px] border-l-transparent relative overflow-hidden group hover:bg-[#161a24] transition-all">
			<div
				className={`absolute left-0 top-0 bottom-0 w-[3px] ${statusColor === "green" ? "bg-[#00e5a0]" : "bg-[#f5a623]"}`}
			/>

			<div className="flex justify-between items-start mb-6">
				<span className="font-mono text-[10px] text-[#5a6070] tracking-widest">
					ODS {num}
				</span>
				<div
					className={`font-mono text-[9px] px-2 py-0.5 border rounded-sm tracking-widest uppercase ${colorMap[statusColor]}`}
				>
					{status}
				</div>
			</div>

			<h3 className="text-lg font-bold mb-4 tracking-tight">{title}</h3>
			<p className="text-xs text-[#8892a4] leading-relaxed mb-6">
				{description}
			</p>

			<div className="bg-[#0a0c10] border border-[#1e2330] p-4 rounded-sm mb-4">
				<div className="font-mono text-[9px] text-[#00e5a0] uppercase tracking-widest mb-2">
					Cobertura do Projeto
				</div>
				<p className="text-[11px] text-[#6b7a90] leading-relaxed">{coverage}</p>
			</div>

			{gap && (
				<div className="bg-[#ff4d6a]/5 border border-[#ff4d6a]/20 p-4 rounded-sm">
					<div className="font-mono text-[9px] text-[#ff4d6a] uppercase tracking-widest mb-2">
						Lacuna Identificada
					</div>
					<p className="text-[11px] text-[#8a6070] leading-relaxed">{gap}</p>
				</div>
			)}
		</div>
	);
}

interface ExpansionCardProps {
	num: string;
	title: string;
	description: string;
	opportunity: string;
}

function ExpansionCard({
	num,
	title,
	description,
	opportunity,
}: ExpansionCardProps) {
	return (
		<div className="bg-[#111318] border border-[#1e2330] p-8 hover:bg-[#161a24] transition-all border-l-[#ff4d6a] border-l-[3px]">
			<div className="flex justify-between items-start mb-6">
				<span className="font-mono text-[10px] text-[#5a6070] tracking-widest">
					ODS {num}
				</span>
				<div className="font-mono text-[9px] px-2 py-0.5 border border-[#ff4d6a]/30 text-[#ff4d6a] rounded-sm tracking-widest uppercase">
					OPORTUNIDADE
				</div>
			</div>
			<h3 className="text-lg font-bold mb-4 tracking-tight">{title}</h3>
			<p className="text-xs text-[#8892a4] leading-relaxed mb-6">
				{description}
			</p>
			<div className="font-mono text-[9px] text-[#ff4d6a] uppercase tracking-widest mb-2">
				Como expandir
			</div>
			<p className="text-[11px] text-[#8a6070] leading-relaxed">
				{opportunity}
			</p>
		</div>
	);
}

interface HighlightCardProps {
	icon: React.ReactNode;
	title: string;
	description: string;
}

function HighlightCard({ icon, title, description }: HighlightCardProps) {
	return (
		<div className="bg-[#111318] border border-[#1e2330] border-t-[#00e5a0] border-t-2 p-6 hover:-translate-y-1 transition-all duration-300">
			<div className="mb-4">{icon}</div>
			<h3 className="text-sm font-bold text-[#00e5a0] mb-2 uppercase tracking-tight">
				{title}
			</h3>
			<p className="text-xs text-[#8892a4] leading-relaxed">{description}</p>
		</div>
	);
}

interface RoadmapItemProps {
	num: string;
	title: string;
	description: string;
}

function RoadmapItem({ num, title, description }: RoadmapItemProps) {
	return (
		<div className="flex gap-6 items-start">
			<div className="font-mono text-3xl font-bold text-[#1e2330] leading-none">
				{num}
			</div>
			<div>
				<h4 className="text-sm font-bold text-[#f5a623] mb-1 uppercase tracking-tight">
					{title}
				</h4>
				<p className="text-xs text-[#6b7a90] leading-relaxed">{description}</p>
			</div>
		</div>
	);
}
