import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const StoryCreateSchema = z.object({
	content: z
		.string()
		.min(10, "Relato muito curto (mínimo 10 caracteres)")
		.max(2000, "Relato muito longo"),
	source: z.string().default("web-direct"),
});

export async function GET() {
	try {
		const stories = await prisma.communityStory.findMany({
			orderBy: { createdAt: "desc" },
			take: 50,
		});
		return NextResponse.json(stories);
	} catch (error) {
		console.error("Error fetching stories:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const validated = StoryCreateSchema.parse(body);

		const story = await prisma.communityStory.create({
			data: {
				content: validated.content,
				source: validated.source,
				isVerified: false,
			},
		});

		return NextResponse.json(story);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Validation failed", details: error.issues },
				{ status: 400 },
			);
		}
		console.error("Error creating community story:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
