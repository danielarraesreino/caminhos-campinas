"use client";

import glossaryData from "@/data/glossary.json";

// Transform JSON array to Record<string, string> for compatibility
const GLOSSARY: Record<string, string> = glossaryData.reduce(
	(acc, item) => {
		acc[item.term] = item.definition;
		return acc;
	},
	{} as Record<string, string>,
);

interface InteractiveTextProps {
	text: string;
	className?: string;
}

export function InteractiveText({
	text,
	className = "",
}: InteractiveTextProps) {
	// Simple tokenization to preserve punctuation and spacing might be tricky with regex replace.
	// We will iterate through glossary keys and wrap found matching terms.
	// To handle multiple terms efficiently and correctly (without nesting), we can use a segments approach.

	// However, for a simple implementation, let's split by space and check,
	// BUT multi-word terms like "Arquitetura Hostil" need priority.

	const terms = Object.keys(GLOSSARY).sort((a, b) => b.length - a.length); // Match longest first

	// We can allow the regex to be case insensitive
	// We need to escape special regex chars in terms if any (glossary keys seem safe mostly)

	// Helper to escape regex special characters
	const escapeRegExp = (string: string) => {
		return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
	};

	const parts: { text: string; term?: string }[] = [{ text }];

	for (const term of terms) {
		for (let i = 0; i < parts.length; i++) {
			if (parts[i].term) continue; // Already matched

			const segment = parts[i].text;
			// Negative lookbehind/ahead for word boundaries allows partial matches if needed,
			// but usually we want whole words or at least distinct phrases.
			// Let's us \b boundaries for now, but Portuguese accents can mess up \b.
			// Simplified approach: string split with capturing group

			const escapedTerm = escapeRegExp(term);
			const regex = new RegExp(`(${escapedTerm})`, "gi");
			const split = segment.split(regex);

			if (split.length > 1) {
				// Reconstruct parts
				const newSegments: { text: string; term?: string }[] = [];
				split.forEach((s) => {
					if (s.toLowerCase() === term.toLowerCase()) {
						newSegments.push({ text: s, term: term }); // Keep original casing from text, link to term key
					} else if (s !== "") {
						newSegments.push({ text: s });
					}
				});

				// Replace current parts[i] with newSegments
				parts.splice(i, 1, ...newSegments);
				// Adjust index to skip the newly added segments
				i += newSegments.length - 1;
			}
		}
	}

	return (
		<span className={className}>
			{parts.map((part, idx) => {
				if (part.term) {
					const definition = GLOSSARY[part.term];
					// Using native title for simplicity as requested,
					// or we could use a custom lightweight tooltip style.
					// Let's stick to the requested visual: border-b-2 border-dotted
					return (
						<span
							// biome-ignore lint/suspicious/noArrayIndexKey: Static text splitting guarantees stable order
							key={idx}
							className="border-b-2 border-dotted border-purple-400 cursor-help hover:bg-purple-900/30 transition-colors relative group"
							title={definition} // Native fallback
						>
							{part.text}
							{/* Custom Tooltip on Hover */}
							<span className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white shadow-xl z-50 pointer-events-none">
								<span className="font-bold block mb-1 text-purple-300">
									{part.term}
								</span>
								{definition}
								{/* Arrow */}
								<span className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900"></span>
							</span>
						</span>
					);
				}
				// biome-ignore lint/suspicious/noArrayIndexKey: Static text splitting guarantees stable order
				return <span key={idx}>{part.text}</span>;
			})}
		</span>
	);
}
