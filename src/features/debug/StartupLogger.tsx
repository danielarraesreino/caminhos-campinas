"use client";

import { useEffect } from "react";

export function StartupLogger() {
	useEffect(() => {
		console.log(
			"%c[System] Game Client Initializing...",
			"color: cyan; font-weight: bold;",
		);
		console.log(`[System] User Agent: ${navigator.userAgent}`);
		console.log(`[System] Screen: ${window.innerWidth}x${window.innerHeight}`);

		const handleLoad = () =>
			console.log("%c[System] Window Loaded", "color: green");
		window.addEventListener("load", handleLoad);

		return () => {
			window.removeEventListener("load", handleLoad);
		};
	}, []);

	return null;
}
