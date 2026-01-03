"use client";

import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";

import { TooltipProvider } from "@/components/ui/tooltip";
import { ToastProvider } from "@/contexts/ToastContext";

export function Providers({ children }: { children: React.ReactNode }) {
	useEffect(() => {
		if ("serviceWorker" in navigator) {
			navigator.serviceWorker
				.register("/sw.js")
				.then((reg) => console.log("SW registered:", reg))
				.catch((err) => console.error("SW failed:", err));
		}
	}, []);

	return (
		<SessionProvider>
			<TooltipProvider delayDuration={300}>
				<ToastProvider>{children}</ToastProvider>
			</TooltipProvider>
		</SessionProvider>
	);
}
