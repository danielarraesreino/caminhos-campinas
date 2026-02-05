// Verification Script for Partners API Validation
// Simulates POST requests to strict validate the new Zod schema in route.ts

const mockRequest = (body: any) => {
	return new Request("http://localhost:3000/api/partners", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});
};

import { POST } from "./src/app/api/partners/route";

async function verifyAPI() {
	console.log("🚀 Starting Partners API Verification...\n");

	// 1. VALID PAYLOAD
	console.log("1️⃣ Test Valid Payload (Complete)");
	const validBody = {
		name: "Casa do Caminho",
		category: "NGO",
		whatsapp: "+5519999999999",
		description: "Abrigo noturno com alimentação.",
		pixKey: "email@casadocaminho.org",
		address: "Rua das Flores, 123",
		latitude: -22.9056,
		longitude: -47.0608,
	};
	try {
		const res = await POST(mockRequest(validBody));
		const data = await res.json();
		if (res.status === 200 && data.name === validBody.name) {
			console.log("✅ PASS: Created successfully.");
		} else {
			console.error("❌ FAIL: Unexpected response", res.status, data);
		}
	} catch (e) {
		console.error("❌ FAIL: Exception thrown", e);
	}

	// 2. INVALID CATEGORY
	console.log("\n2️⃣ Test Invalid Category");
	try {
		const res = await POST(mockRequest({ ...validBody, category: "INVALID" }));
		const data = await res.json();
		if (
			res.status === 400 &&
			data.details[0].message.includes("Categoria inválida")
		) {
			console.log("✅ PASS: Correctly rejected invalid category.");
		} else {
			console.error("❌ FAIL: Should have rejected category", res.status, data);
		}
	} catch (e) {
		console.error(e);
	}

	// 3. INVALID WHATSAPP
	console.log("\n3️⃣ Test Invalid WhatsApp");
	try {
		const res = await POST(mockRequest({ ...validBody, whatsapp: "12345" })); // Too short
		const data = await res.json();
		if (res.status === 400 && data.details[0].message.includes("inválido")) {
			console.log("✅ PASS: Correctly rejected invalid WhatsApp.");
		} else {
			console.error("❌ FAIL: Should have rejected WhatsApp", res.status, data);
		}
	} catch (e) {
		console.error(e);
	}

	// 4. MISSING REQUIRED FIELDS
	console.log("\n4️⃣ Test Missing Name");
	try {
		const { name, ...missingName } = validBody;
		const res = await POST(mockRequest(missingName));
		const data = await res.json();
		if (res.status === 400) {
			console.log("✅ PASS: Rejected missing name.");
		} else {
			console.error(
				"❌ FAIL: Should have rejected missing name",
				res.status,
				data,
			);
		}
	} catch (e) {
		console.error(e);
	}
}

// Note: To run this, we need 'prisma' usage to be ignored or mocked if no DB connection is present,
// but since we are in the environment with DB credentials, it might actually try to write.
// IF DB connection fails, we expect 503 or 500. that is also a valid test.

if (require.main === module) {
	verifyAPI();
}
