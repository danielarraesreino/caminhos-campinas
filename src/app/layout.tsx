import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { ServicesProvider } from "@/contexts/ServicesContext";
import { SurvivalModeProvider } from "@/features/ui/SurvivalModeContext";
import { GameProvider } from "@/contexts/GameContext";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Caminhos Campinas",
	description: "Serious Game sobre a realidade da população de rua em Campinas.",
	manifest: "/manifest.json",
	themeColor: "#000000",
	viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
};

import { Providers } from "@/components/Providers";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
				suppressHydrationWarning
			>
				<Providers>
					<SurvivalModeProvider>
						<GameProvider>
							<ServicesProvider>{children}</ServicesProvider>
						</GameProvider>
					</SurvivalModeProvider>
				</Providers>
			</body>
		</html>
	);
}
