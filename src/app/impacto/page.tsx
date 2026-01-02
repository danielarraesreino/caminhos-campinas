// biome-ignore lint/suspicious/noExplicitAny: Temporary fix for build as requested
"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ImpactDashboard } from "@/features/dashboard/ImpactDashboard";

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
