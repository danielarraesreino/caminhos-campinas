import { type NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // SEM NEXT_PUBLIC
const GEMINI_URL =
	"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent";

// Rate limiting simples (em produção, usar Upstash Redis ou Vercel KV)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(identifier: string): boolean {
	const now = Date.now();
	const limit = requestCounts.get(identifier);

	if (!limit || now > limit.resetTime) {
		requestCounts.set(identifier, { count: 1, resetTime: now + 60000 }); // 1 minuto
		return true;
	}

	if (limit.count >= 10) {
		// Máximo 10 requisições por minuto
		return false;
	}

	limit.count++;
	return true;
}

export async function POST(req: NextRequest) {
	try {
		// Validação da chave de API
		if (!GEMINI_API_KEY) {
			console.error("[Gemini API] Chave de API não configurada");
			return NextResponse.json(
				{ success: false, error: "Configuração do servidor incompleta" },
				{ status: 500 },
			);
		}

		// Rate limiting básico
		const ip =
			req.headers.get("x-forwarded-for") ||
			req.headers.get("x-real-ip") ||
			"unknown";
		if (!checkRateLimit(ip)) {
			return NextResponse.json(
				{ success: false, error: "Muitas requisições. Aguarde um momento." },
				{ status: 429 },
			);
		}

		// Parse do body
		const body = await req.json();
		const { prompt, type } = body;

		if (!prompt || typeof prompt !== "string") {
			return NextResponse.json(
				{ success: false, error: "Prompt inválido" },
				{ status: 400 },
			);
		}

		// Validação de tamanho (evita abuso)
		if (prompt.length > 2000) {
			return NextResponse.json(
				{ success: false, error: "Prompt muito longo (máx 2000 caracteres)" },
				{ status: 400 },
			);
		}

		// Chamada à API Gemini com retry logic
		const maxRetries = 3;
		const delays = [1000, 2000, 4000];
		let lastError: Error | null = null;

		for (let attempt = 0; attempt <= maxRetries; attempt++) {
			try {
				const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						contents: [{ parts: [{ text: prompt }] }],
					}),
				});

				if (!response.ok) {
					const errorData = await response.json().catch(() => ({}));
					throw new Error(
						`Gemini API error: ${response.status} - ${JSON.stringify(errorData)}`,
					);
				}

				const data = await response.json();
				const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

				if (!text) {
					throw new Error("Resposta vazia da IA");
				}

				// Log de sucesso (em produção, enviar para observability tool)
				console.log(
					`[Gemini API] Sucesso - IP: ${ip}, Type: ${type || "none"}`,
				);

				return NextResponse.json({
					success: true,
					text,
					metadata: {
						model: "gemini-2.5-flash",
						timestamp: new Date().toISOString(),
					},
				});
			} catch (error) {
				lastError = error as Error;
				if (attempt < maxRetries) {
					await new Promise((resolve) => setTimeout(resolve, delays[attempt]));
				}
			}
		}

		// Se chegou aqui, todas as tentativas falharam
		console.error("[Gemini API] Erro após retries:", lastError);
		return NextResponse.json(
			{
				success: false,
				error:
					"Erro ao processar requisição. Tente novamente em alguns instantes.",
			},
			{ status: 500 },
		);
	} catch (error) {
		console.error("[Gemini API] Erro não tratado:", error);
		return NextResponse.json(
			{ success: false, error: "Erro interno do servidor" },
			{ status: 500 },
		);
	}
}
