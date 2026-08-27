import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DilemmaCache } from "./dilemmaCache";

describe("DilemmaCache", () => {
	const mockDilemma = {
		scenario: "Test scenario",
		options: ["Option 1", "Option 2"],
	};

	beforeEach(() => {
		localStorage.clear();
		// Use fake timers for TTL tests
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.clearAllMocks();
		localStorage.clear();
	});

	describe("Core Functionality", () => {
		it("should set and get a dilemma", () => {
			DilemmaCache.set("test_key", mockDilemma);

			const retrieved = DilemmaCache.get("test_key");

			expect(retrieved).not.toBeNull();
			expect(retrieved?.scenario).toBe(mockDilemma.scenario);
			expect(retrieved?.options).toEqual(mockDilemma.options);
			expect(retrieved?.timestamp).toBeTypeOf("number");
		});

		it("should return null for non-existent key", () => {
			const retrieved = DilemmaCache.get("non_existent_key");
			expect(retrieved).toBeNull();
		});

		it("should remove a specific dilemma", () => {
			DilemmaCache.set("test_key_1", mockDilemma);
			DilemmaCache.set("test_key_2", mockDilemma);

			DilemmaCache.remove("test_key_1");

			expect(DilemmaCache.get("test_key_1")).toBeNull();
			expect(DilemmaCache.get("test_key_2")).not.toBeNull();
		});

		it("should clear all cached dilemmas", () => {
			DilemmaCache.set("test_key_1", mockDilemma);
			DilemmaCache.set("test_key_2", mockDilemma);

			// Put something else in localStorage to ensure it's not removed
			localStorage.setItem("other_key", "some value");

			DilemmaCache.clear();

			expect(DilemmaCache.get("test_key_1")).toBeNull();
			expect(DilemmaCache.get("test_key_2")).toBeNull();
			expect(localStorage.getItem("other_key")).toBe("some value");
		});
	});

	describe("TTL Expiration", () => {
		it("should return null and remove item if TTL is expired", () => {
			DilemmaCache.set("test_key", mockDilemma);

			// Advance time by 24 hours + 1 ms
			const TTL = 24 * 60 * 60 * 1000;
			vi.advanceTimersByTime(TTL + 1);

			const retrieved = DilemmaCache.get("test_key");
			expect(retrieved).toBeNull();
			expect(localStorage.getItem("dilemma_cache_test_key")).toBeNull();
		});

		it("should return item if TTL is not expired", () => {
			DilemmaCache.set("test_key", mockDilemma);

			// Advance time by 23 hours
			const almostTTL = 23 * 60 * 60 * 1000;
			vi.advanceTimersByTime(almostTTL);

			const retrieved = DilemmaCache.get("test_key");
			expect(retrieved).not.toBeNull();
		});
	});

	describe("Cache Limit Cleanup", () => {
		it("should keep only the 10 most recent items", () => {
			// Add 12 items with advancing timestamps
			for (let i = 1; i <= 12; i++) {
				DilemmaCache.set(`key_${i}`, mockDilemma);
				vi.advanceTimersByTime(1000); // 1 second apart
			}

			// Items 1-5 should be removed (5 oldest are removed if > 10)
			// Wait, the logic is: if length > 10, remove 5 oldest.
			// Let's trace it:
			// After 10: 10 items.
			// After 11: 11 items. cleanup() runs -> removes 5 oldest (1,2,3,4,5). Leaves 6 items (6,7,8,9,10,11).
			// After 12: adds 1, total 7 items. cleanup() runs -> length is 7 (not > 10). Leaves 7 items (6,7,8,9,10,11,12).

			expect(DilemmaCache.get("key_1")).toBeNull();
			expect(DilemmaCache.get("key_5")).toBeNull();
			expect(DilemmaCache.get("key_6")).not.toBeNull();
			expect(DilemmaCache.get("key_12")).not.toBeNull();

			const stats = DilemmaCache.getStats();
			expect(stats.total).toBe(7);
		});
	});

	describe("getStats", () => {
		it("should return correct stats for empty cache", () => {
			const stats = DilemmaCache.getStats();
			expect(stats).toEqual({ total: 0, oldest: null, newest: null });
		});

		it("should return correct stats for populated cache", () => {
			const time1 = Date.now();
			DilemmaCache.set("test_key_1", mockDilemma);

			vi.advanceTimersByTime(5000);
			const time2 = Date.now();
			DilemmaCache.set("test_key_2", mockDilemma);

			const stats = DilemmaCache.getStats();
			expect(stats.total).toBe(2);
			expect(stats.oldest?.getTime()).toBe(time1);
			expect(stats.newest?.getTime()).toBe(time2);
		});
	});

	describe("Error Handling", () => {
		it("should handle invalid JSON gracefully in get", () => {
			localStorage.setItem("dilemma_cache_bad_json", "invalid json {");

			const consoleSpy = vi
				.spyOn(console, "error")
				.mockImplementation(() => {});

			const retrieved = DilemmaCache.get("bad_json");

			expect(retrieved).toBeNull();
			// JSON.parse throws, caught by try/catch
			expect(consoleSpy).toHaveBeenCalled();
			consoleSpy.mockRestore();
		});

		it("should handle localStorage errors in set", () => {
			// Mock setItem to throw
			const originalSetItem = Storage.prototype.setItem;
			Storage.prototype.setItem = vi.fn(() => {
				throw new Error("Storage full");
			});

			const consoleSpy = vi
				.spyOn(console, "error")
				.mockImplementation(() => {});

			DilemmaCache.set("test_key", mockDilemma);

			expect(consoleSpy).toHaveBeenCalled();
			consoleSpy.mockRestore();
			Storage.prototype.setItem = originalSetItem;
		});
	});

	describe("SSR Safety", () => {
		it("should return null/safe values when window is undefined", () => {
			// Temporarily unset window
			const originalWindow = global.window;
			// @ts-expect-error
			delete global.window;

			expect(DilemmaCache.get("key")).toBeNull();

			// Should not throw
			expect(() => DilemmaCache.set("key", mockDilemma)).not.toThrow();
			expect(() => DilemmaCache.remove("key")).not.toThrow();
			expect(() => DilemmaCache.clear()).not.toThrow();

			expect(DilemmaCache.getStats()).toEqual({
				total: 0,
				oldest: null,
				newest: null,
			});

			// Restore window
			global.window = originalWindow;
		});
	});
});
