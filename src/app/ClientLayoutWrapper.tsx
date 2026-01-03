"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/ui/Footer";
import { Navbar } from "@/components/ui/Navbar";
import { useGameContext } from "@/contexts/GameContext";

export function ClientLayoutWrapper({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const { avatar } = useGameContext();
	const isGamePage = pathname?.startsWith("/jogar");

	// Show Navbar/Footer if NOT game page OR if it IS game page but game hasn't started yet (!avatar)
	const shouldShowUI = !isGamePage || (isGamePage && !avatar);

	return (
		<>
			{shouldShowUI && <Navbar />}
			<main className="flex-grow flex flex-col min-h-screen">{children}</main>
			{shouldShowUI && <Footer />}
		</>
	);
}
