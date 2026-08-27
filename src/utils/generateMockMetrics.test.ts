import { describe, it, expect } from "vitest";
import { generateMockMetrics } from "./generateMockMetrics";

describe("generateMockMetrics", () => {
	it("should generate exactly 1000 items by default", () => {
		const metrics = generateMockMetrics();
		expect(metrics).toHaveLength(1000);
	});

	it("should generate the requested number of items", () => {
		const metrics = generateMockMetrics(5);
		expect(metrics).toHaveLength(5);
	});

	it("should handle 0 count by returning an empty array", () => {
		const metrics = generateMockMetrics(0);
		expect(metrics).toHaveLength(0);
	});

	it("should handle negative count by returning an empty array", () => {
		const metrics = generateMockMetrics(-10);
		expect(metrics).toHaveLength(0);
	});

	it("should generate objects with the correct structure and valid properties", () => {
		const metrics = generateMockMetrics(10); // generate a few to check

		for (const event of metrics) {
			// Structure
			expect(event).toHaveProperty("id");
			expect(event).toHaveProperty("ods");
			expect(event).toHaveProperty("type");
			expect(event).toHaveProperty("grid");
			expect(event).toHaveProperty("timestamp");
			expect(event).toHaveProperty("systemic_failure");

			// Types
			expect(typeof event.id).toBe("string");
			expect(typeof event.ods).toBe("string");
			expect(typeof event.type).toBe("string");
			expect(typeof event.grid).toBe("string");
			expect(typeof event.timestamp).toBe("number");
			expect(typeof event.systemic_failure).toBe("number");

			// Expected string values
			const validTypes = ["BUSCA_ABRIGO", "SOLICITACAO_REFEICAO", "DOCUMENTACAO", "SAUDE_EMERGENCIA"];
			expect(validTypes).toContain(event.type);

			const validOds = ["ODS_11", "ODS_2", "ODS_10", "ODS_3"];
			expect(validOds).toContain(event.ods);

			// systemic failure should be between 0 and 100
			expect(event.systemic_failure).toBeGreaterThanOrEqual(0);
			expect(event.systemic_failure).toBeLessThanOrEqual(100);

			// timestamp should be valid and in the past
			expect(event.timestamp).toBeLessThanOrEqual(Date.now());
		}
	});

	it("should correctly map type to ods", () => {
		const metrics = generateMockMetrics(100);

		for (const event of metrics) {
			if (event.type === "BUSCA_ABRIGO") expect(event.ods).toBe("ODS_11");
			if (event.type === "SOLICITACAO_REFEICAO") expect(event.ods).toBe("ODS_2");
			if (event.type === "DOCUMENTACAO") expect(event.ods).toBe("ODS_10");
			if (event.type === "SAUDE_EMERGENCIA") expect(event.ods).toBe("ODS_3");
		}
	});
});
