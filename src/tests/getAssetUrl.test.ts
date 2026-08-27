import { describe, expect, it, vi, afterEach } from "vitest";
import { getAssetUrl } from "../utils/getAssetUrl";

describe("getAssetUrl", () => {
	afterEach(() => {
		vi.unstubAllEnvs();
	});

	describe("when NEXT_PUBLIC_ASSETS_URL is not set", () => {
		it("should return the path starting with a slash when it already starts with a slash", () => {
			vi.stubEnv("NEXT_PUBLIC_ASSETS_URL", "");
			expect(getAssetUrl("/image.png")).toBe("/image.png");
		});

		it("should return the path starting with a slash when it does not start with a slash", () => {
			vi.stubEnv("NEXT_PUBLIC_ASSETS_URL", "");
			expect(getAssetUrl("image.png")).toBe("/image.png");
		});

		it("should handle undefined env variable correctly", () => {
			delete process.env.NEXT_PUBLIC_ASSETS_URL;
			expect(getAssetUrl("image.png")).toBe("/image.png");
		});
	});

	describe("when NEXT_PUBLIC_ASSETS_URL is set", () => {
		it("should return the full URL when path starts with a slash", () => {
			vi.stubEnv("NEXT_PUBLIC_ASSETS_URL", "https://cdn.example.com");
			expect(getAssetUrl("/image.png")).toBe("https://cdn.example.com/image.png");
		});

		it("should return the full URL when path does not start with a slash", () => {
			vi.stubEnv("NEXT_PUBLIC_ASSETS_URL", "https://cdn.example.com");
			expect(getAssetUrl("image.png")).toBe("https://cdn.example.com/image.png");
		});

		it("should avoid double slashes when base URL ends with a slash", () => {
			vi.stubEnv("NEXT_PUBLIC_ASSETS_URL", "https://cdn.example.com/");
			expect(getAssetUrl("/image.png")).toBe("https://cdn.example.com/image.png");
		});

		it("should avoid double slashes when base URL ends with a slash and path does not start with a slash", () => {
			vi.stubEnv("NEXT_PUBLIC_ASSETS_URL", "https://cdn.example.com/");
			expect(getAssetUrl("image.png")).toBe("https://cdn.example.com/image.png");
		});
	});
});
