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

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT = 5; // Max requests per window
const TIME_WINDOW = 60 * 1000; // 1 minute in milliseconds
const MAX_MAP_SIZE = 10000; // Prevent memory leak

export async function POST(request: Request) {
	try {
		// Rate limiting check
		const ip = request.headers.get("x-forwarded-for") || "anonymous";
		const now = Date.now();
		const record = rateLimitMap.get(ip);

		// Clean up map occasionally to prevent memory leaks
		if (rateLimitMap.size > MAX_MAP_SIZE) {
			const oldTime = now - TIME_WINDOW;
			for (const [key, value] of rateLimitMap.entries()) {
				if (value.timestamp < oldTime) {
					rateLimitMap.delete(key);
				}
			}
			// If still too large, clear entirely as a fallback
			if (rateLimitMap.size > MAX_MAP_SIZE) {
				rateLimitMap.clear();
			}
		}

		if (record) {
			if (now - record.timestamp < TIME_WINDOW) {
				if (record.count >= RATE_LIMIT) {
					return NextResponse.json(
						{ error: "Too many requests. Please try again later." },
						{ status: 429 },
					);
				}
				record.count++;
			} else {
				rateLimitMap.set(ip, { count: 1, timestamp: now });
			}
		} else {
			rateLimitMap.set(ip, { count: 1, timestamp: now });
		}

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
