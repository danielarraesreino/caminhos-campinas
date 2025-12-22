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
					className="absolute top-8 left-8 z-50 p-2 border border-slate-900 bg-slate-950 text-slate-500 hover:text-white transition-colors"
					title="Voltar para a Landing Page"
				>
					<ArrowLeft size={16} />
				</Link>
				<ImpactDashboard />
			</div>
		</main>
	);
}
