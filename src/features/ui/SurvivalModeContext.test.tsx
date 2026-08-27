import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useSurvivalMode, SurvivalModeProvider } from "./SurvivalModeContext";

describe("useSurvivalMode", () => {
	beforeEach(() => {
		// Suppress console.error in tests for the expected error thrown by React
		vi.spyOn(console, "error").mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
		localStorage.clear();
		document.documentElement.classList.remove("survival-mode");
	});

	it("throws an error when used outside of SurvivalModeProvider", () => {
		expect(() => renderHook(() => useSurvivalMode())).toThrow(
			"useSurvivalMode must be used within a SurvivalModeProvider"
		);
	});

	it("returns context when used within SurvivalModeProvider", () => {
		const { result } = renderHook(() => useSurvivalMode(), {
			wrapper: SurvivalModeProvider,
		});

		expect(result.current.isSurvivalMode).toBe(false);
		expect(typeof result.current.toggleSurvivalMode).toBe("function");
	});

	it("toggles survival mode correctly", () => {
		const { result } = renderHook(() => useSurvivalMode(), {
			wrapper: SurvivalModeProvider,
		});

		expect(result.current.isSurvivalMode).toBe(false);

		act(() => {
			result.current.toggleSurvivalMode();
		});

		expect(result.current.isSurvivalMode).toBe(true);
		expect(document.documentElement.classList.contains("survival-mode")).toBe(true);
		expect(localStorage.getItem("survival-mode")).toBe("true");

		act(() => {
			result.current.toggleSurvivalMode();
		});

		expect(result.current.isSurvivalMode).toBe(false);
		expect(document.documentElement.classList.contains("survival-mode")).toBe(false);
		expect(localStorage.getItem("survival-mode")).toBe("false");
	});

	it("initializes with survival mode from localStorage if present", () => {
		localStorage.setItem("survival-mode", "true");

		const { result } = renderHook(() => useSurvivalMode(), {
			wrapper: SurvivalModeProvider,
		});

		expect(result.current.isSurvivalMode).toBe(true);
		expect(document.documentElement.classList.contains("survival-mode")).toBe(true);
	});
});
