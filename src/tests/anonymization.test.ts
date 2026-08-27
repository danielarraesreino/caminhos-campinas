import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { anonymizeLocation, applyTimeJitter } from "../utils/anonymization";

describe("anonymizeLocation", () => {
	const GRID_SIZE_DEG = 0.0045;

	it("should round positive coordinates to nearest grid cell", () => {
		// Just slightly over the halfway point rounds up
		const lat = GRID_SIZE_DEG * 1.51; // 0.006795 -> rounds to 2 * GRID = 0.0090
		const lng = GRID_SIZE_DEG * 2.1; // 0.00945 -> rounds to 2 * GRID = 0.0090
		expect(anonymizeLocation(lat, lng)).toBe("0.0090,0.0090");
	});

	it("should round negative coordinates to nearest grid cell", () => {
		// Just slightly under halfway rounds down (closer to 0)
		const lat = -GRID_SIZE_DEG * 1.49; // -0.006705 -> rounds to -1 * GRID = -0.0045
		const lng = -GRID_SIZE_DEG * 2.9; // -0.01305 -> rounds to -3 * GRID = -0.0135
		expect(anonymizeLocation(lat, lng)).toBe("-0.0045,-0.0135");
	});

	it("should handle zero coordinates correctly", () => {
		expect(anonymizeLocation(0, 0)).toBe("0.0000,0.0000");
	});

	it("should handle exact grid centers correctly", () => {
		// Center of grid cell at index 1 is GRID_SIZE_DEG
		const lat = GRID_SIZE_DEG;
		const lng = -GRID_SIZE_DEG;
		expect(anonymizeLocation(lat, lng)).toBe("0.0045,-0.0045");
	});

	it("should handle exact boundaries correctly (rounding half up)", () => {
		// Exactly at the boundary (e.g., halfway between 0 and 1)
		const lat = GRID_SIZE_DEG / 2; // 0.00225 -> rounds to 1 * GRID = 0.0045
		const lng = -GRID_SIZE_DEG / 2; // -0.00225 -> rounds to 0 * GRID = 0.0000 (Math.round(-0.5) is -0)
		expect(anonymizeLocation(lat, lng)).toBe("0.0045,0.0000");
	});
});

describe("applyTimeJitter", () => {
	const TIME_JITTER_WINDOW = 1000 * 60 * 60 * 4; // 4 hours in ms

	beforeEach(() => {
		vi.spyOn(Math, "random");
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("should apply maximum jitter when random is close to 1", () => {
		vi.mocked(Math.random).mockReturnValue(0.999999);
		const baseTime = 1000000000000;
		const expectedJitter = Math.floor(0.999999 * TIME_JITTER_WINDOW);
		expect(applyTimeJitter(baseTime)).toBe(baseTime - expectedJitter);
	});

	it("should apply zero jitter when random is 0", () => {
		vi.mocked(Math.random).mockReturnValue(0);
		const baseTime = 1000000000000;
		expect(applyTimeJitter(baseTime)).toBe(baseTime);
	});

	it("should apply 50% jitter when random is 0.5", () => {
		vi.mocked(Math.random).mockReturnValue(0.5);
		const baseTime = 1000000000000;
		const expectedJitter = Math.floor(0.5 * TIME_JITTER_WINDOW);
		expect(applyTimeJitter(baseTime)).toBe(baseTime - expectedJitter);
	});

	it("should subtract jitter (return time before baseTime)", () => {
		// Don't mock, just verify behavior
		vi.restoreAllMocks();
		const baseTime = Date.now();
		const jitteredTime = applyTimeJitter(baseTime);
		expect(jitteredTime).toBeLessThanOrEqual(baseTime);
		expect(jitteredTime).toBeGreaterThan(baseTime - TIME_JITTER_WINDOW);
	});
});
