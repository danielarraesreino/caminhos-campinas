import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GameProvider } from "@/contexts/GameContext";
import { ServicesProvider } from "@/contexts/ServicesContext";
import { SurvivalModeProvider } from "@/features/ui/SurvivalModeContext";

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
	description:
		"Serious Game sobre a realidade da população de rua em Campinas.",
	manifest: "/manifest.json",
};

export const viewport: Viewport = {
	themeColor: "#000000",
	width: "device-width",
	initialScale: 1,
	// Accessibility: Allow users to zoom for better readability
	// maximumScale: 1,
	// userScalable: false,
};

import { Providers } from "@/components/Providers";
import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";

import { Navbar } from "@/components/ui/Navbar";
import { RealitySwitcher } from "@/components/ui/RealitySwitcher";

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
							<ServicesProvider>
								<Navbar />
								{children}
								<SpeedInsights />
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
