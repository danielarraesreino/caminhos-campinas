import { NextResponse } from "next/server";
import { apiMetrics } from "@/utils/apiMetrics";

export async function GET() {
	try {
		const stats = apiMetrics.getStats();
		const recent = apiMetrics.getRecent(20);

		return NextResponse.json({
			success: true,
			stats,
			recent,
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		console.error("[Metrics API] Erro:", error);
		return NextResponse.json(
			{
				success: false,
				error: "Erro ao obter métricas",
			},
			{ status: 500 },
		);
	}
}
