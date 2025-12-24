"use client";

import { SessionProvider } from "next-auth/react";
import { useEffect } from "react";

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
			<ToastProvider>{children}</ToastProvider>
		</SessionProvider>
	);
}
