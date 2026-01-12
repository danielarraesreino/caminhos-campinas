import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/partners
 * Cadastro de novo parceiro.
 */
export async function POST(request: Request) {
	try {
		const body = await request.json();

		if (!body.name || !body.category || !body.whatsapp) {
			return NextResponse.json(
				{ success: false, error: "Nome, Categoria e WhatsApp são obrigatórios." },
				{ status: 400 }
			);
		}

		const partner = await prisma.partner.create({
			data: {
				name: body.name,
				category: body.category,
				whatsapp: body.whatsapp,
				description: body.description || null,
				pixKey: body.pixKey || null,
				address: body.address || null,
				latitude: body.latitude || null,
				longitude: body.longitude || null,
				status: "PENDING",
			},
		});

		return NextResponse.json({ success: true, partner });
	} catch (error) {
		console.error("Erro no cadastro de parceiro:", error);
		return NextResponse.json(
			{ success: false, error: "Erro interno no servidor." },
			{ status: 500 }
		);
	}
}

/**
 * GET /api/partners
 * Listagem de parceiros aprovados.
 */
export async function GET() {
	try {
		// Por simplicidade, retornamos apenas os aprovados (regra de segurança)
		// Se desejar debug, pode mudar para buscar todos PENDING tb.
		const partners = await prisma.partner.findMany({
			where: {
				status: "APPROVED",
			},
			orderBy: {
				createdAt: "desc",
			},
		});

		return NextResponse.json({ success: true, data: partners });
	} catch (error) {
		console.error("Erro ao listar parceiros:", error);
		return NextResponse.json(
			{ success: false, error: "Erro interno no servidor." },
			{ status: 500 }
		);
	}
}
