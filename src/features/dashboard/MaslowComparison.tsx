"use client";

import { HelpCircle, Lock, XCircle, Zap } from "lucide-react";
import { useState } from "react";

interface MaslowProps {
	metrics: {
		hunger: number;
		housing: number;
		health: number;
		education: number;
	};
}

interface TooltipContent {
	title: string;
	impact: string;
	reality: string;
}

const TOOLTIP_DATA: Record<string, TooltipContent> = {
	Topo: {
		title: "Autorrealização e Autonomia",
		impact:
			"Sem a base (moradia/saúde), o cérebro permanece em modo de sobrevivência, tornando o aprendizado técnico ou acadêmico biologicamente inviável.",
		reality:
			"Apenas 15% da população de rua em Campinas consegue acessar cursos de capacitação com sucesso.",
	},
	Meio_A: {
		title: "Dignidade e Estima Social",
		impact:
			"O estigma da rua destrói o pertencimento. Sem documentos ou um local de higiene, o indivíduo perde a percepção de si como cidadão.",
		reality:
			"71% citam o rompimento de vínculos familiares como a porta de entrada para a exclusão total.",
	},
	Meio_B: {
		title: "Segurança e Moradia",
		impact:
			"A falta de um teto (ODS 11.1) gera um estado de alerta perpétuo. O sono fragmentado na calçada impede a recuperação psíquica.",
		reality:
			"Campinas possui déficit de vagas em abrigos públicos em relação à demanda sazonal de inverno.",
	},
	Base: {
		title: "Necessidades Fisiológicas",
		impact:
			"Fome e dor física. Quando esta base falha, a ética social é atropelada pela necessidade biológica de se manter vivo.",
		reality:
			"O 'Tráfico Formiga' é o principal motor de encarceramento da pobreza quando a base de Maslow desmorona.",
	},
};

export function MaslowComparison({ metrics }: MaslowProps) {
	const isBaseBroken = metrics.hunger > 60 || metrics.housing < 30;
	const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

	return (
		<div className="bg-[#0a0a0c] border border-slate-800 p-8 rounded-2xl space-y-10 shadow-2xl relative">
			<div className="space-y-2">
				<h2 className="text-xl font-bold text-white flex items-center gap-2 border-l-4 border-blue-600 pl-4">
					Hierarquia de Necessidades (Maslow de Rua)
				</h2>
				<p className="text-sm text-slate-400 font-sans ml-5">
					Explore os níveis para entender o impacto da privação.
				</p>
			</div>

			<div className="relative flex flex-col items-center py-4">
				{/* Pirâmide Visual */}
				<div className="w-full max-w-[400px] flex flex-col gap-2 items-center">
					<PyramidTier
						active={!isBaseBroken}
						label="Autorrealização e Educação"
						width="w-[50%]"
						locked={isBaseBroken}
						level="Topo"
						tooltipId="Topo"
						onInfoClick={setActiveTooltip}
					/>

					<PyramidTier
						active={!isBaseBroken}
						label="Dignidade e Estima"
						width="w-[70%]"
						locked={isBaseBroken}
						level="Meio"
						tooltipId="Meio_A"
						onInfoClick={setActiveTooltip}
					/>

					<PyramidTier
						active={metrics.housing > 50}
						label="Segurança e Moradia"
						width="w-[85%]"
						alert={metrics.housing < 30}
						level="Meio"
						tooltipId="Meio_B"
						onInfoClick={setActiveTooltip}
					/>

					<PyramidTier
						active={metrics.hunger < 50}
						label="Necessidades Fisiológicas"
						width="w-[100%]"
						alert={metrics.hunger > 70}
						shaking={metrics.hunger > 70}
						level="Base"
						tooltipId="Base"
						onInfoClick={setActiveTooltip}
					/>
				</div>

				{/* Curto-Circuito (Ainda mais agressivo) */}
				{isBaseBroken && (
					<div className="mt-8 md:mt-0 md:absolute top-1/2 -right-16 transform -translate-y-1/2 flex flex-col items-center group cursor-help">
						<div className="bg-red-600 text-white font-black p-5 rounded-xl shadow-[0_0_30px_rgba(220,38,38,0.6)] flex items-center gap-3 animate-pulse border-2 border-red-300">
							<Zap size={28} fill="currentColor" />
							<span className="text-base uppercase tracking-tighter">
								Colapso Sistêmico
							</span>
						</div>
						<div className="h-14 w-1 bg-gradient-to-b from-red-600 to-transparent"></div>
						<div className="bg-black/90 p-3 border border-red-900 rounded-lg max-w-[180px] text-center">
							<span className="text-[10px] text-red-500 font-bold uppercase block mb-1">
								Impacto Criminal
							</span>
							<p className="text-[10px] text-slate-300 leading-tight">
								A falha biológica na base força o recrutamento pelo tráfico para
								subsistência imediata.
							</p>
						</div>
					</div>
				)}
			</div>

			{/* Modal de Tooltip (Humanizado e Legível) */}
			{activeTooltip && (
				<div className="absolute inset-0 bg-black/95 z-50 flex flex-col p-8 rounded-2xl border-2 border-blue-900/50 animate-in fade-in zoom-in duration-200">
					<button
						type="button"
						aria-label="Fechar detalhes"
						onClick={() => setActiveTooltip(null)}
						className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
					>
						<XCircle size={32} />
					</button>

					<div className="space-y-6">
						<div className="space-y-1">
							<span className="text-blue-500 font-bold tracking-widest text-xs uppercase">
								Detalhes do Nível
							</span>
							<h3 className="text-3xl font-black text-white">
								{TOOLTIP_DATA[activeTooltip].title}
							</h3>
						</div>

						<div className="space-y-4">
							<div className="bg-blue-950/20 border-l-4 border-blue-600 p-4">
								<span className="text-xs font-bold text-blue-400 uppercase block mb-2">
									Impacto na Sobrevivência
								</span>
								<p className="text-lg text-slate-300 font-sans leading-relaxed">
									{TOOLTIP_DATA[activeTooltip].impact}
								</p>
							</div>

							<div className="bg-slate-900/40 p-4 rounded-lg">
								<span className="text-xs font-bold text-slate-500 uppercase block mb-2">
									Realidade Campinas
								</span>
								<p className="text-base text-slate-400 font-sans italic">
									"{TOOLTIP_DATA[activeTooltip].reality}"
								</p>
							</div>
						</div>
					</div>

					<div className="mt-auto pt-6 border-t border-slate-900 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
						Dado Cruzado Anonimamente via Ponto Sagrado DB
					</div>
				</div>
			)}
		</div>
	);
}

function PyramidTier({
	active,
	label,
	width,
	locked,
	alert,
	shaking,
	level,
	tooltipId,
	onInfoClick,
}: // biome-ignore lint/suspicious/noExplicitAny: legacy props
	any) {
	return (
		<div
			className={`${width} min-h-[70px] border-2 transition-all duration-300 flex items-center justify-between px-6 py-4 relative group rounded-xl
            ${active ? "bg-[#121215] border-slate-800 text-white" : "bg-black border-slate-900 text-slate-600"}
            ${alert ? "border-red-600/60 bg-red-950/20 shadow-[0_0_20px_rgba(220,38,38,0.1)]" : ""}
            ${shaking ? "animate-[bounce_1s_infinite]" : ""}
            hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.1)]
        `}
		>
			<div className="absolute inset-0 bg-black/70 backdrop-blur-[2px] flex items-center justify-center rounded-xl z-10">
				<Lock size={24} className="text-red-600" />
			</div>

			<div className="flex flex-col gap-1 items-start">
				<span className="text-[10px] uppercase tracking-widest font-black text-slate-400 group-hover:text-blue-500 transition-colors">
					{level}
				</span>
				<span className="text-lg font-bold tracking-tight">{label}</span>
			</div>

			{!locked && (
				<button
					type="button"
					onClick={() => onInfoClick(tooltipId)}
					className="p-2 text-slate-700 hover:text-blue-500 hover:bg-blue-500/10 rounded-full transition-all flex items-center gap-2 group/btn"
				>
					<span className="text-[10px] font-bold opacity-0 group-hover/btn:opacity-100 transition-opacity">
						Detalhes
					</span>
					<HelpCircle size={20} />
				</button>
			)}
		</div>
	);
}
