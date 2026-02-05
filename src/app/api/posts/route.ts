import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const PostCreateSchema = z.object({
	title: z.string().max(200).optional(),
	content: z
		.string()
		.min(10, "Texto muito curto")
		.max(5000, "Texto muito longo"),
	category: z.enum(["DENUNCIA", "RELATO", "POESIA"]),
	author: z.string().max(100).optional(),
	contact: z.string().max(100).optional(),
});

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const validated = PostCreateSchema.parse(body);

		const post = await prisma.post.create({
			data: {
				title: validated.title,
				content: validated.content,
				category: validated.category,
				author: validated.author,
				contact: validated.contact,
				status: "PENDING",
			},
		});

		return NextResponse.json(post);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Validation failed", details: error.issues },
				{ status: 400 },
			);
		}
		console.error("Error creating newspaper post:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
