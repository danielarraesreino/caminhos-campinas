"use client";

import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSurvivalMode } from "./SurvivalModeContext";

export function SurvivalToggle() {
	const { isSurvivalMode, toggleSurvivalMode } = useSurvivalMode();

	return (
		<Button
			variant="outline"
			size="icon"
			onClick={toggleSurvivalMode}
			className={
				isSurvivalMode
					? "bg-yellow-400 text-black font-bold border-4 border-black"
					: ""
			}
			aria-label={
				isSurvivalMode
					? "Desativar Modo Sobrevivência"
					: "Ativar Modo Sobrevivência"
			}
		>
			{isSurvivalMode ? (
				<Eye className="h-4 w-4" />
			) : (
				<EyeOff className="h-4 w-4" />
			)}
		</Button>
	);
}
