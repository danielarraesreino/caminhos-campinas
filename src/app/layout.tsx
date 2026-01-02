import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Clarity from "@/components/analytics/Clarity";
import "leaflet/dist/leaflet.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GameProvider } from "@/contexts/GameContext";
import { ServicesProvider } from "@/contexts/ServicesContext";
import { SurvivalModeProvider } from "@/features/ui/SurvivalModeContext";
import { ClientLayoutWrapper } from "@/app/ClientLayoutWrapper";
import { Providers } from "@/components/Providers";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { RealitySwitcher } from "@/components/ui/RealitySwitcher";

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
};

export const viewport: Viewport = {
	themeColor: "#000000",
	width: "device-width",
	initialScale: 1,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="pt-BR" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
				suppressHydrationWarning
			>
				<Providers>
					<SurvivalModeProvider>
						<GameProvider>
							<ServicesProvider>
								<ClientLayoutWrapper>{children}</ClientLayoutWrapper>
								<SpeedInsights />
								<Clarity />
								<Analytics />
								<ServiceWorkerRegister />
								<RealitySwitcher />
							</ServicesProvider>
						</GameProvider>
					</SurvivalModeProvider>
				</Providers>
			</body>
		</html>
	);
}
