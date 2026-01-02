import React from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import GLOSSARY_DATA from "@/data/glossary.json";

interface GlossaryItem {
	term: string;
	definition: string;
}

// Transform JSON array to Record<string, string> for compatibility
const GLOSSARY: Record<string, string> = GLOSSARY_DATA.reduce(
	(acc, item) => {
		acc[item.term] = item.definition;
		return acc;
	},
	{} as Record<string, string>,
);

// Normaliza as chaves do glossário para busca case-insensitive
const TERMS = Object.keys(GLOSSARY).sort((a, b) => b.length - a.length); // Ordena por tamanho para casar termos compostos primeiro

interface InteractiveTextProps {
	text: string;
}

export function InteractiveText({ text }: InteractiveTextProps) {
	if (!text) return null;

	// Cria uma regex que busca todos os termos
	const regex = new RegExp(`(${TERMS.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join("|")})`, "gi");

	const parts = text.split(regex);

	return (
		<TooltipProvider delayDuration={0}>
			<span className="leading-relaxed">
				{parts.map((part, i) => {
					// Verifica se a parte é um termo (case insensitive)
					const termKey = TERMS.find(
						(t) => t.toLowerCase() === part.toLowerCase(),
					);

					if (termKey) {
						const definition = GLOSSARY[termKey];
						return (
							<Tooltip key={`${i}-${part}`}>
								<TooltipTrigger asChild>
									<span className="text-blue-400 font-bold border-b border-dashed border-blue-500/50 cursor-help hover:text-blue-300 hover:border-blue-300 transition-colors">
										{part}
									</span>
								</TooltipTrigger>
								<TooltipContent className="bg-slate-900 border-slate-700 text-slate-200 max-w-xs p-3 text-xs leading-5 shadow-xl z-[60]">
									<p>
										<strong className="block text-yellow-500 mb-1 uppercase tracking-wider text-[10px]">
											{termKey}
										</strong>
										{definition}
									</p>
								</TooltipContent>
							</Tooltip>
						);
					}

					return <span key={`${i}-${part}`}>{part}</span>;
				})}
			</span>
		</TooltipProvider>
	);
}
