"use client";

import dynamic from "next/dynamic";

const LandingPage = dynamic(() => import("@/features/ui/LandingPage"), {
	ssr: false,
});

export default function Home() {
	return (
		<div className="min-h-screen bg-slate-50">
			<LandingPage />
		</div>
	);
}
