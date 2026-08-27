import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { apiMetrics } from "@/utils/apiMetrics";

export async function GET(req: Request) {
	try {
		const session = await auth();
		const authHeader = req.headers.get("authorization");
		const apiKey = process.env.ADMIN_API_KEY;

		const hasValidApiKey = apiKey && authHeader === `Bearer ${apiKey}`;

		if (!session && !hasValidApiKey) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

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
