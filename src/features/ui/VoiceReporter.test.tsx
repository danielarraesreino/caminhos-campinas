import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { VoiceReporter } from "./VoiceReporter";

vi.mock("@/features/offline-db/useOfflineDB", () => ({
	useOfflineDB: () => ({
		saveLocally: vi.fn(),
	}),
}));

describe("VoiceReporter", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should handle error when mediaDevices.getUserMedia throws", async () => {
		const mockGetUserMedia = vi.fn().mockRejectedValue(new Error("NotAllowedError: Permission denied"));

		const originalMediaDevices = global.navigator.mediaDevices;

		Object.defineProperty(global.navigator, "mediaDevices", {
			value: {
				getUserMedia: mockGetUserMedia,
			},
			configurable: true,
		});

		render(<VoiceReporter />);

		// Verify initially no error message
		expect(screen.queryByText("Erro ao salvar")).toBeNull();

		const buttons = screen.getAllByRole("button");
		const micButton = buttons.find(b => b.className.includes("w-20 h-20 rounded-full"));

		if (micButton) {
			fireEvent.click(micButton);
		} else {
			throw new Error("Mic button not found");
		}

		// we need to wait for state updates
		await waitFor(() => {
			expect(screen.getByText("Erro ao salvar")).toBeTruthy();
		});

		// reset mock
		if (originalMediaDevices) {
			Object.defineProperty(global.navigator, "mediaDevices", {
				value: originalMediaDevices,
				configurable: true,
			});
		} else {
            // @ts-ignore
            delete global.navigator.mediaDevices;
        }
	});
});
