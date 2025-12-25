"use client";

import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

export const GLOSSARY_TERMS: Record<string, string> = {
	CAPS: "Centro de Atenção Psicossocial. Oferece suporte gratuito para saúde mental e dependência.",
	SAMIM:
		"Abrigo Municipal. Oferece pernoite, banho e jantar, mas tem regras rígidas de horário.",
	CRAS: "Centro de Referência de Assistência Social. Porta de entrada para benefícios como Bolsa Família.",
	"Consultório na Rua":
		"Equipes do SUS que levam atendimento médico até as pessoas em situação de rua.",
	"Bom Prato": "Restaurante popular do governo com refeições a R$ 1,00.",
	Rapa: "Ação de fiscalização que muitas vezes apreende pertences da população de rua.",
};

interface GlossaryTooltipProps {
	term: string;
	children: React.ReactNode;
}

export function GlossaryTooltip({ term, children }: GlossaryTooltipProps) {
	const definition =
		GLOSSARY_TERMS[term] ||
		GLOSSARY_TERMS[
			Object.keys(GLOSSARY_TERMS).find(
				(k) => k.toUpperCase() === term.toUpperCase(),
			) || ""
		];

	if (!definition) return <>{children}</>;

	return (
		<TooltipProvider>
			<Tooltip delayDuration={300}>
				<TooltipTrigger asChild>
					<span className="cursor-help border-b border-dotted border-blue-400 decoration-blue-400/50 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
						{children}
					</span>
				</TooltipTrigger>
				<TooltipContent className="max-w-xs bg-slate-900 text-white border-slate-700">
					<p className="font-bold text-xs mb-1 text-emerald-400">{term}</p>
					<p className="text-xs text-slate-300">{definition}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
