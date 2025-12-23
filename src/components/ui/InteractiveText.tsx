import { GLOSSARY_TERMS } from "@/data/glossary";

interface InteractiveTextProps {
	content: string;
}

export function InteractiveText({ content }: InteractiveTextProps) {
	// Create a regex pattern from glossary keys
	// Sort by length slightly to match longer terms first if needed, though usually strict matching is fine
	const terms = Object.keys(GLOSSARY_TERMS);
	if (terms.length === 0) return <p>{content}</p>;

	const pattern = new RegExp(`(${terms.join("|")})`, "gi");
	const parts = content.split(pattern);

	return (
		<p>
			{parts.map((part, index) => {
				// Check if this part is a glossary term (case-insensitive check)
				const matchedKey = terms.find(
					(t) => t.toUpperCase() === part.toUpperCase(),
				);

				if (matchedKey) {
					return (
						// biome-ignore lint/suspicious/noArrayIndexKey: order is stable
						<span
							key={`${part}-${index}`}
							className="group relative inline-block"
						>
							<button
								type="button"
								className="cursor-help decoration-dotted decoration-yellow-500 underline text-slate-200 font-medium bg-transparent border-0 p-0"
								aria-describedby={`tooltip-${index}`}
							>
								{part}
							</button>
							<span
								id={`tooltip-${index}`}
								role="tooltip"
								className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 border border-slate-700 text-slate-100 text-xs rounded shadow-xl z-50 pointer-events-none"
							>
								<span className="font-bold block mb-1 uppercase tracking-wider text-yellow-500">
									{matchedKey}
								</span>
								{GLOSSARY_TERMS[matchedKey]}
								{/* Decorative arrow */}
								<span className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-4 border-transparent border-t-slate-900" />
							</span>
						</span>
					);
				}
				// biome-ignore lint/suspicious/noArrayIndexKey: order is stable
				return <span key={`${part}-${index}`}>{part}</span>;
			})}
		</p>
	);
}
