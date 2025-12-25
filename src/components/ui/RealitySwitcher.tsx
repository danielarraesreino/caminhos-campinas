"use client";

import { Gamepad2, HeartHandshake } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export function RealitySwitcher() {
	const pathname = usePathname();
	const router = useRouter();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	const isGameMode = pathname.includes("/jogar");
	const isRealityMode = pathname.includes("/apoie");

	// Don't show on other pages for now, or maybe show "Enter Simulation" on landing
	if (!isGameMode && !isRealityMode) return null;

	const toggleReality = () => {
		if (isGameMode) {
			router.push("/apoie");
		} else {
			router.push("/jogar");
		}
	};

	return createPortal(
		<div className="fixed bottom-6 left-6 z-[9999] group">
			<button
				type="button"
				onClick={toggleReality}
				className={`
					relative flex items-center justify-center w-16 h-16 rounded-full shadow-2xl transition-all duration-500 transform hover:scale-110
					${
						isGameMode
							? "bg-gradient-to-br from-amber-400 to-orange-600 hover:shadow-orange-500/50 ring-4 ring-orange-400/30"
							: "bg-gradient-to-br from-slate-800 to-slate-950 hover:shadow-slate-500/50 ring-4 ring-slate-400/30"
					}
				`}
				title={isGameMode ? "Voltar para Realidade" : "Entrar na Simulação"}
			>
				<div
					className={`absolute inset-0 rounded-full animate-spin-slow opacity-20 ${
						isGameMode ? 'bg-[url("/texture-noise.png")]' : ""
					}`}
				/>

				<div className="relative z-10 text-white">
					{isGameMode ? (
						<HeartHandshake className="w-8 h-8 animate-pulse" />
					) : (
						<Gamepad2 className="w-8 h-8" />
					)}
				</div>

				{/* Label Tooltip */}
				<div className="absolute right-full mr-4 bg-black/80 text-white text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none backdrop-blur-sm border border-white/10">
					{isGameMode ? "Apoiar na Realidade" : "Voltar ao Jogo"}
					<div className="absolute top-1/2 -right-1 w-2 h-2 bg-black/80 transform -translate-y-1/2 rotate-45" />
				</div>
			</button>
		</div>,
		document.body,
	);
}
