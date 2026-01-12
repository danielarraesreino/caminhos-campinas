import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const partner = await prisma.partner.create({
			data: {
				name: body.name,
				category: body.category,
				whatsapp: body.whatsapp,
				description: body.description,
				address: body.address,
				status: "PENDING",
			},
		});
		return NextResponse.json(partner);
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to create partner" },
			{ status: 500 },
		);
	}
}

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url);
		const status = searchParams.get("status");

		const where = status ? { status } : {};

		const partners = await prisma.partner.findMany({
			where,
			orderBy: { createdAt: "desc" },
		});

		return NextResponse.json(partners);
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to fetch partners" },
			{ status: 500 },
		);
	}
}
