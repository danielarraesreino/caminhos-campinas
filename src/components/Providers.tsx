"use client";

import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";

export function Providers({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker
                .register("/sw.js")
                .then((reg) => console.log("SW registered:", reg))
                .catch((err) => console.error("SW failed:", err));
        }
    }, []);

    return <SessionProvider>{children}</SessionProvider>;
}
