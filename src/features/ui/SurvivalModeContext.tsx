"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

interface SurvivalModeContextType {
	isSurvivalMode: boolean;
	toggleSurvivalMode: () => void;
}

const SurvivalModeContext = createContext<SurvivalModeContextType | undefined>(
	undefined,
);

export function SurvivalModeProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [isSurvivalMode, setIsSurvivalMode] = useState(false);

	useEffect(() => {
		// Check local storage or system preference
		const stored = localStorage.getItem("survival-mode");
		if (stored === "true") {
			setIsSurvivalMode(true);
			document.documentElement.classList.add("survival-mode");
		}
	}, []);

	const toggleSurvivalMode = () => {
		setIsSurvivalMode((prev) => {
			const newValue = !prev;
			if (newValue) {
				document.documentElement.classList.add("survival-mode");
				localStorage.setItem("survival-mode", "true");
			} else {
				document.documentElement.classList.remove("survival-mode");
				localStorage.setItem("survival-mode", "false");
			}
			return newValue;
		});
	};

	return (
		<SurvivalModeContext.Provider
			value={{ isSurvivalMode, toggleSurvivalMode }}
		>
			{children}
		</SurvivalModeContext.Provider>
	);
}

export function useSurvivalMode() {
	const context = useContext(SurvivalModeContext);
	if (context === undefined) {
		throw new Error(
			"useSurvivalMode must be used within a SurvivalModeProvider",
		);
	}
	return context;
}
