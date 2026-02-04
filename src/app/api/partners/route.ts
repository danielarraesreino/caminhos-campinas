import { z } from "zod";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 🛡️ Input Validation Schema
const PartnerCreateSchema = z.object({
	name: z.string().min(2, "Nome muito curto").max(200, "Nome muito longo"),
	category: z.enum(["NGO", "GOV", "COMPANY"], {
		message: "Categoria inválida. Use NGO, GOV ou COMPANY",
	}),
	whatsapp: z
		.string()
		.regex(/^\+?[1-9]\d{9,14}$/, "Número de WhatsApp inválido (mínimo 10 dígitos)")
		.optional()
		.or(z.literal("").transform(() => undefined)),
	description: z
		.string()
		.max(1000, "Descrição muito longa (máx 1000 caracteres)")
		.optional()
		.or(z.literal("").transform(() => undefined)),
	pixKey: z
		.string()
		.max(100, "Chave PIX muito longa")
		.optional()
		.or(z.literal("").transform(() => undefined)),
	address: z
		.string()
		.max(500, "Endereço muito longo")
		.optional()
		.or(z.literal("").transform(() => undefined)),
	latitude: z.number().min(-90).max(90).optional(),
	longitude: z.number().min(-180).max(180).optional(),
});

// 🛡️ Database Health Check
async function checkDBHealth(): Promise<boolean> {
	try {
		await prisma.$queryRaw`SELECT 1`;
		return true;
	} catch (error) {
		console.error("❌ Database health check failed:", error);
		return false;
	}
}

// 🛡️ Generate Request ID for tracing
function generateRequestId(): string {
	return `req_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}

export async function POST(request: Request) {
	const requestId = generateRequestId();

	try {
		// 1. Parse and validate input
		const body = await request.json();
		const validated = PartnerCreateSchema.parse(body);

		// 2. Check database health
		const isDBHealthy = await checkDBHealth();
		if (!isDBHealthy) {
			console.error(`[${requestId}] Database is unhealthy`);
			return NextResponse.json(
				{
					error: "Service temporarily unavailable",
					requestId,
				},
				{ status: 503 },
			);
		}

		// 3. Log incoming data for debugging
		console.log(`[${requestId}] Partner registration attempt:`, {
			name: validated.name,
			category: validated.category,
			hasWhatsapp: !!validated.whatsapp,
			hasPix: !!validated.pixKey,
		});

		// 4. Create partner
		const partner = await prisma.partner.create({
			data: {
				name: validated.name,
				category: validated.category,
				whatsapp: validated.whatsapp ?? null,
				description: validated.description ?? null,
				pixKey: validated.pixKey ?? null,
				address: validated.address ?? null,
				latitude: validated.latitude ?? null,
				longitude: validated.longitude ?? null,
				status: "PENDING",
			},
		});

		console.log(`[${requestId}] ✅ Partner created: ${partner.id}`);

		return NextResponse.json({
			...partner,
			requestId,
		});
	} catch (error) {
		// 🛡️ Zod Validation Errors
		if (error instanceof z.ZodError) {
			console.warn(`[${requestId}] Validation error:`, error.issues);
			return NextResponse.json(
				{
					error: "Validation failed",
					details: error.issues.map((issue) => ({
						field: issue.path.join("."),
						message: issue.message,
					})),
					requestId,
				},
				{ status: 400 },
			);
		}

		// 🛡️ Database Errors (don't expose details in production)
		const err = error as Error;
		console.error(`[${requestId}] ❌ Error creating partner:`, {
			name: err.name,
			message: err.message,
			// Do NOT log stack in production (security risk)
			...(process.env.NODE_ENV === "development" && { stack: err.stack }),
		});

		return NextResponse.json(
			{
				error: "Failed to create partner",
				// Only show error details in development
				...(process.env.NODE_ENV === "development" && {
					details: err.message,
				}),
				requestId,
			},
			{ status: 500 },
		);
	}
}

export async function GET(request: Request) {
	const requestId = generateRequestId();

	try {
		const { searchParams } = new URL(request.url);
		const status = searchParams.get("status");

		// Check database health
		const isDBHealthy = await checkDBHealth();
		if (!isDBHealthy) {
			console.error(`[${requestId}] Database is unhealthy`);
			return NextResponse.json(
				{
					error: "Service temporarily unavailable",
					requestId,
				},
				{ status: 503 },
			);
		}

		const where = status ? { status } : {};

		const partners = await prisma.partner.findMany({
			where,
			orderBy: { createdAt: "desc" },
		});

		return NextResponse.json({
			partners,
			requestId,
		});
	} catch (error) {
		const err = error as Error;
		console.error(`[${requestId}] ❌ Error fetching partners:`, {
			name: err.name,
			message: err.message,
		});

		return NextResponse.json(
			{
				error: "Failed to fetch partners",
				requestId,
			},
			{ status: 500 },
		);
	}
}
