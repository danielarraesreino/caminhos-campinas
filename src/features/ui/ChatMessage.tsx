import Image from "next/image";
import { memo } from "react";
import {
	GLOSSARY_TERMS,
	GlossaryTooltip,
} from "@/components/ui/GlossaryTooltip";

// Pre-compile regex for Chat Messages
const GLOSSARY_KEYS = Object.keys(GLOSSARY_TERMS);
// Correctly escape special characters for regex
const GLOSSARY_REGEX = new RegExp(
	`(${GLOSSARY_KEYS.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
	"gi",
);

function MessageContent({ content }: { content: string }) {
	// Simple split by regex
	const parts = (content || "").split(GLOSSARY_REGEX);

	return (
		<>
			{parts.map((part, i) => {
				const matchedTerm = GLOSSARY_KEYS.find(
					(t) => t.toLowerCase() === part.toLowerCase(),
				);
				if (matchedTerm) {
					return (
						// biome-ignore lint/suspicious/noArrayIndexKey: parts index is stable for static text
						<GlossaryTooltip key={`${i}-${matchedTerm}`} term={matchedTerm}>
							{part}
						</GlossaryTooltip>
					);
				}
				// Wrap text nodes in span to prevent hydration mismatch/node removal errors
				// biome-ignore lint/suspicious/noArrayIndexKey: static text split
				return <span key={i}>{part}</span>;
			})}
		</>
	);
}

// biome-ignore lint/suspicious/noExplicitAny: messages are loosely typed in ai-sdk
export const ChatMessage = memo(function ChatMessage({ m }: { m: any }) {
	return (
		<div
			className={`flex gap-3 w-full px-2 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}
		>
			<div className="flex-shrink-0 mt-1">
				{m.role === "user" ? (
					<div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-sm">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
							className="text-white"
							role="img"
							aria-label="User Avatar"
						>
							<title>User Avatar</title>
							<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
							<circle cx="12" cy="7" r="4" />
						</svg>
					</div>
				) : (
					<div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shadow-sm border border-purple-200">
						<Image
							src="/avatars/avatar_1.png"
							alt="Mestre"
							width={32}
							height={32}
							className="rounded-full"
						/>
					</div>
				)}
			</div>
			<div
				className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm ${m.role === "user" ? "bg-blue-600 text-white rounded-tr-none" : "bg-white dark:bg-gray-800 border border-slate-100 dark:border-slate-700 rounded-tl-none"}`}
			>
				{m.role === "assistant" ? (
					<MessageContent content={m.content} />
				) : (
					m.content
				)}
			</div>
		</div>
	);
});
