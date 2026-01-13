import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import GLOSSARY_DATA from "@/data/glossary.json";

// biome-ignore lint/suspicious/noExplicitAny: Data structure
const glossData: any = GLOSSARY_DATA;

// Transform JSON array to Record<string, string> for compatibility
const GLOSSARY: Record<string, string> = glossData.reduce(
	(acc: Record<string, string>, item: { term: string; definition: string }) => {
		acc[item.term] = item.definition;
		return acc;
	},
	{} as Record<string, string>,
);

// Normaliza as chaves do glossário para busca case-insensitive
const TERMS = Object.keys(GLOSSARY).sort((a, b) => b.length - a.length); // Ordena por tamanho para casar termos compostos primeiro

// Pre-compile regex outside the component
const GLOSSARY_REGEX = new RegExp(
	`(${TERMS.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
	"gi",
);

interface InteractiveTextProps {
	text: string;
}

export function InteractiveText({ text }: InteractiveTextProps) {
	if (!text) return null;

	const parts = text.split(GLOSSARY_REGEX);

	return (
		<span className="leading-relaxed">
			{parts.map((part, i) => {
				// Verifica se a parte é um termo (case insensitive)
				const termKey = TERMS.find(
					(t) => t.toLowerCase() === part.toLowerCase(),
				);

				if (termKey) {
					const definition = GLOSSARY[termKey];
					return (
						<Dialog key={`${i}-${part}`}>
							<DialogTrigger asChild>
								<span className="text-blue-400 font-bold border-b border-dashed border-blue-500/50 cursor-help hover:text-blue-300 hover:border-blue-300 transition-colors">
									{part}
								</span>
							</DialogTrigger>
							{/* Z-Index 200 to overlay DilemmaModal (100) and Chat (150) */}
							<DialogContent className="z-[var(--z-glossary)] max-w-xs bg-slate-900 border-slate-700 text-slate-200">
								<DialogHeader>
									<DialogTitle className="text-yellow-500 uppercase tracking-wider text-sm">
										{termKey}
									</DialogTitle>
								</DialogHeader>
								<DialogDescription className="text-sm leading-relaxed mt-2 text-slate-300">
									{definition}
								</DialogDescription>
							</DialogContent>
						</Dialog>
					);
				}

				return <span key={`${i}-${part}`}>{part}</span>;
			})}
		</span>
	);
}
