import { describe, expect, it } from "vitest";
import { calculateDistance } from "./geo";

describe("calculateDistance", () => {
	it("should return 0 when the coordinates are identical", () => {
		expect(calculateDistance(0, 0, 0, 0)).toBe(0);
		expect(calculateDistance(10, 10, 10, 10)).toBe(0);
		expect(calculateDistance(-22.9055, -47.0608, -22.9055, -47.0608)).toBe(0); // Campinas coordinates
	});

	it("should calculate correct distance for 1 degree difference on the equator", () => {
		// 1 degree of latitude/longitude at the equator is approx 111.19 km
		// (Math.PI / 180) * 6371 ≈ 111.1949
		expect(calculateDistance(0, 0, 0, 1)).toBeCloseTo(111.19, 1);
		expect(calculateDistance(0, 0, 1, 0)).toBeCloseTo(111.19, 1);
	});

	it("should calculate distance between known coordinates (e.g. New York to London)", () => {
		// NY: 40.7128° N, 74.0060° W
		// London: 51.5074° N, 0.1278° W
		// Expected distance is ~5570 km
		const nyLat = 40.7128;
		const nyLon = -74.006;
		const lonLat = 51.5074;
		const lonLon = -0.1278;

		const distance = calculateDistance(nyLat, nyLon, lonLat, lonLon);

		// The exact formula implementation gives a slightly specific distance based on Earth being perfectly spherical.
		// Using 6371 km for radius, NY to London is about 5570 km.
		expect(distance).toBeGreaterThan(5500);
		expect(distance).toBeLessThan(5600);
	});

	it("should handle anti-podal points (opposite sides of the earth)", () => {
		// (0,0) and (0, 180) should be half the circumference
		// Circumference = 2 * PI * R
		// Half circumference = PI * 6371 ≈ 20015
		expect(calculateDistance(0, 0, 0, 180)).toBeCloseTo(Math.PI * 6371, 0);
		expect(calculateDistance(90, 0, -90, 0)).toBeCloseTo(Math.PI * 6371, 0); // North pole to South pole
	});

	it("should be commutative (distance from A to B is same as B to A)", () => {
		const dist1 = calculateDistance(40.7128, -74.006, 51.5074, -0.1278);
		const dist2 = calculateDistance(51.5074, -0.1278, 40.7128, -74.006);

		expect(dist1).toBe(dist2);
	});
});
