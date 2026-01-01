"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";

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
