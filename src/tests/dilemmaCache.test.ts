import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { DilemmaCache } from "@/utils/dilemmaCache";

describe("DilemmaCache Cleanup Logic", () => {
	beforeEach(() => {
		// Mock window for SSR safety checks
		// Note: jsdom environment already provides window and localStorage,
		// but we ensure it's clean before each test.
		localStorage.clear();
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("should correctly clean up the oldest items when exceeding the limit of 10", () => {
		// Create a dilemma payload structure without timestamp
		const mockDilemmaPayload = {
			scenario: "test_scenario",
			options: ["option1", "option2"],
		};

		// Insert 11 items, incrementing time by 1000ms each time
		// to guarantee they have different timestamps.
		for (let i = 1; i <= 11; i++) {
			DilemmaCache.set(`test_key_${i}`, mockDilemmaPayload);
			vi.advanceTimersByTime(1000);
		}

		// `DilemmaCache.set` calls `cleanup()` under the hood.
		// Since we inserted 11 items, cleanup should have triggered after the 11th.
		// The condition `cacheKeys.length > 10` is met.
		// It should remove the 5 oldest items (keys: 1 to 5).
		// We should have 11 - 5 = 6 items remaining.

		const cacheKeys = Object.keys(localStorage).filter((k) =>
			k.startsWith("dilemma_cache_"),
		);

		expect(cacheKeys.length).toBe(6);

		// The remaining items should be the 6 most recent ones (keys 6 through 11).
		const expectedRemainingKeys = [
			"dilemma_cache_test_key_6",
			"dilemma_cache_test_key_7",
			"dilemma_cache_test_key_8",
			"dilemma_cache_test_key_9",
			"dilemma_cache_test_key_10",
			"dilemma_cache_test_key_11",
		];

		const actualRemainingKeys = cacheKeys.sort();
		expect(actualRemainingKeys).toEqual(expectedRemainingKeys.sort());

		// Specifically verify that older items were removed
		expect(localStorage.getItem("dilemma_cache_test_key_1")).toBeNull();
		expect(localStorage.getItem("dilemma_cache_test_key_5")).toBeNull();
	});

	it("should handle broken JSON in localStorage gracefully during cleanup", () => {
		const mockDilemmaPayload = {
			scenario: "test_scenario",
			options: ["option1", "option2"],
		};

		// 1. Manually add 5 items with invalid JSON directly into localStorage
		for (let i = 1; i <= 5; i++) {
			localStorage.setItem(`dilemma_cache_broken_key_${i}`, "{ invalid json");
			vi.advanceTimersByTime(1000);
		}

		// 2. Add 6 items correctly using DilemmaCache.set
		for (let i = 6; i <= 11; i++) {
			DilemmaCache.set(`valid_key_${i}`, mockDilemmaPayload);
			vi.advanceTimersByTime(1000);
		}

		// Now there are 11 items starting with `dilemma_cache_`.
		// `cleanup()` will trigger on the 11th item insertion.
		// The broken JSON items will throw in JSON.parse and default to a timestamp of 0.
		// Therefore, they will be considered the oldest and will be removed.

		const cacheKeys = Object.keys(localStorage).filter((k) =>
			k.startsWith("dilemma_cache_"),
		);

		expect(cacheKeys.length).toBe(6);

		// None of the broken keys should remain because they were parsed as timestamp 0.
		for (let i = 1; i <= 5; i++) {
			expect(localStorage.getItem(`dilemma_cache_broken_key_${i}`)).toBeNull();
		}

		// All 6 valid keys should remain.
		for (let i = 6; i <= 11; i++) {
			expect(
				localStorage.getItem(`dilemma_cache_valid_key_${i}`),
			).not.toBeNull();
		}
	});
});
