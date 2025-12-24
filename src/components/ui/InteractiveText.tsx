import type React from "react";
import { GLOSSARY_TERMS } from "@/data/glossary";

interface InteractiveTextProps {
	text: string;
}

export const InteractiveText: React.FC<InteractiveTextProps> = ({ text }) => {
	// 1. Create a regex from the keys of GLOSSARY_TERMS (escape special chars if needed)
	// We want to match whole words or exact phrases, case-insensitive (maybe).
	// For "Consultório na Rua", it's a phrase.
	// Sort keys by length (descending) to match longer phrases first.
	const terms = Object.keys(GLOSSARY_TERMS).sort((a, b) => b.length - a.length);

	// Create regex pattern: (term1|term2|...)
	// Use \\b boundaries for single words, but be careful with phrases or portuguese accents.
	// Actually for simplicity in this MVP, simple replacement is safer than complex regex boundaries with unicode.
	// We'll use a simple case-insensitive match.
	const pattern = new RegExp(`(${terms.join("|")})`, "gi");

	// Split text by the pattern
	const parts = text.split(pattern);

	return (
		<span>
			{parts.map((part, index) => {
				// Check if this part is a glossary key (case insensitive check)
				// We need to find the exact key casing to look up the definition
				const normalizedPart = part;
				const glossaryKey = terms.find(
					(term) => term.toLowerCase() === conversationKey(part),
				);

				if (glossaryKey) {
					const definition = GLOSSARY_TERMS[glossaryKey];
					return (
						<span
							key={`${index}-${part.substring(0, 10)}`}
							className="group relative inline-block cursor-help decoration-dotted underline underline-offset-4 decoration-amber-500/50 hover:decoration-amber-400 hover:text-amber-200 transition-colors"
						>
							{part}
							{/* Tooltip */}
							<span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-950 border border-slate-800 rounded-lg shadow-xl text-xs text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity z-[100] text-left">
								<strong className="block text-amber-400 mb-1">
									{glossaryKey}
								</strong>
								{definition}
								{/* Arrow */}
								<span className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-950" />
							</span>
						</span>
					);
				}

				return <span key={`${index}-${part.substring(0, 10)}`}>{part}</span>;
			})}
		</span>
	);
};

// Helper to normalize for comparison (though find logic above handles it)
function conversationKey(str: string) {
	return str.toLowerCase();
}
