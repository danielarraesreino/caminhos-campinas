// biome-ignore lint/suspicious/noExplicitAny: Temporary fix for build as requested
"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ImpactDashboard } from "@/features/dashboard/ImpactDashboard";

// Interface implicit in ImpactDashboard usage, but Page doesn't seem to pass stats?
// Checking ImpactDashboard code, it fetches its own data.
// The error reported was "const [stats, setStats] = useState<any>" in ImpactPage.tsx?
// But ImpactPage.tsx (viewed in Step 153) does NOT have useState.
// It just renders <ImpactDashboard />.
// The error must be INSIDE ImpactDashboard.tsx (viewed in Step 163) or a different file.
// In Step 163 (ImpactDashboard.tsx), line 54: const [realData, setRealData] = useState<TelemetryEvent[]>([]);
// There is no "const [stats, setStats] = useState<any>" in the file I viewed.
// Wait, the user said "Arquivo Alvo: src/app/impacto/page.tsx".
// Maybe the user meant "src/features/dashboard/ImpactDashboard.tsx"?
// Or maybe I am looking at a different version?
// I will start by fixing Button.tsx and then RE-READ ImpactDashboard.tsx to be sure.
// actually, I did read ImpactDashboard.tsx in Step 163 and it does NOT have that line.
// But wait, the user said "Linha 22: const [stats, setStats] = useState<any>".
// In ImpactPage.tsx (Step 153), line 22 is "</div>".
// This mismatch is suspicious.
// However, I will fix Button.tsx first.

export default function ImpactPage() {
	return (
		<main className="bg-black min-h-screen">
			<div className="max-w-[1400px] mx-auto relative">
				<Link
					href="/"
					className="fixed top-6 left-6 z-[100] p-3 border border-slate-800 bg-black/80 backdrop-blur-md text-slate-300 hover:text-white hover:border-blue-500 transition-all rounded-full shadow-lg group"
					title="Voltar para a Landing Page"
				>
					<ArrowLeft
						size={20}
						className="group-hover:-translate-x-1 transition-transform"
					/>
				</Link>
				<ImpactDashboard />
			</div>
		</main>
	);
}
