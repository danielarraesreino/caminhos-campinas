"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/ui/Footer";
import { Navbar } from "@/components/ui/Navbar";

export function ClientLayoutWrapper({
	children,
}: {
	children: React.ReactNode;
}) {
	const pathname = usePathname();
	const isGamePage = pathname?.startsWith("/jogar");

	return (
		<>
			{!isGamePage && <Navbar />}
			{children}
			{!isGamePage && <Footer />}
		</>
	);
}
