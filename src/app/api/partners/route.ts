import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/partners
 * Cadastra um novo parceiro com status PENDING para moderação
 */
export async function POST(request: Request) {
	try {
		const body = await request.json();

		// Validação básica dos campos obrigatórios
		if (!body.name || !body.whatsapp || !body.category) {
			return NextResponse.json(
				{
					success: false,
					error: "Campos obrigatórios faltando: Nome, WhatsApp ou Categoria.",
				},
				{ status: 400 },
			);
		}

		// Grava no PostgreSQL
		const newPartner = await prisma.partner.create({
			data: {
				name: body.name,
				category: body.category,
				whatsapp: body.whatsapp,
				description: body.description || null,
				pixKey: body.pixKey || null,
				address: body.address || null,
				latitude: body.latitude ?? null,
				longitude: body.longitude ?? null,
				status: "PENDING", // Segurança: Entra como pendente para moderação
			},
		});

		console.log("✅ Parceiro salvo no Postgres:", newPartner.id);

		return NextResponse.json({ success: true, partner: newPartner });
	} catch (error) {
		console.error("❌ Erro ao salvar no banco:", error);
		return NextResponse.json(
			{ success: false, error: "Erro de banco de dados." },
			{ status: 500 },
		);
	}
}

/**
 * GET /api/partners
 * Lista todos os parceiros cadastrados (ordenados por data de criação)
 */
export async function GET() {
	try {
		const partners = await prisma.partner.findMany({
			orderBy: { createdAt: "desc" },
		});

		return NextResponse.json({
			success: true,
			count: partners.length,
			data: partners,
		});
	} catch (error) {
		console.error("❌ Erro ao buscar parceiros:", error);
		return NextResponse.json(
			{ success: false, error: "Erro ao buscar parceiros." },
			{ status: 500 },
		);
	}
}
