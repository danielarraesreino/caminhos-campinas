import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AvatarCreation } from "./AvatarCreation";

const mockShowToast = vi.fn();

vi.mock("@/contexts/ToastContext", () => ({
	useToast: () => ({ showToast: mockShowToast }),
}));

vi.mock("@/contexts/GameContext", () => ({
	useGameContext: () => ({
		setAvatar: vi.fn(),
		resetGame: vi.fn(),
		setActiveArc: vi.fn(),
	}),
}));

describe("AvatarCreation", () => {
	let originalFetch: typeof global.fetch;
	let originalFileReader: typeof global.FileReader;

	beforeEach(() => {
		vi.clearAllMocks();
		originalFetch = global.fetch;
		originalFileReader = global.FileReader;
	});

	afterEach(() => {
		global.fetch = originalFetch;
		global.FileReader = originalFileReader;
	});

	const navigateToStep2 = async (user: ReturnType<typeof userEvent.setup>) => {
		render(<AvatarCreation onComplete={vi.fn()} onBack={vi.fn()} />);

		// Step 1: Name
		const nameInput = screen.getByPlaceholderText(
			"Ex: Zé do Pátio, Maria da Praça...",
		);
		await user.type(nameInput, "Test Name");

		const nextButton = screen.getByText(/Próximo Passo/i);
		await user.click(nextButton);

		// Now on Step 2
		expect(
			screen.getByText("Selecione uma Imagem de Identidade"),
		).toBeInTheDocument();
	};

	it("handles AI image generation success", async () => {
		const user = userEvent.setup();
		await navigateToStep2(user);

		// Create a mock blob to return
		const mockBlob = new Blob(["test image content"], { type: "image/png" });

		// Create a deferred promise to control the fetch resolution
		let resolveFetch: (value: any) => void;
		const fetchPromise = new Promise((resolve) => {
			resolveFetch = resolve;
		});

		global.fetch = vi.fn().mockImplementation(() => fetchPromise);

		// Mock FileReader to avoid actual reading
		const mockFileReader = {
			readAsDataURL: vi.fn(function (this: any, blob: Blob) {
				setTimeout(() => {
					this.result = "data:image/png;base64,fakebase64data";
					if (this.onloadend) this.onloadend();
				}, 0);
			}),
		};
		global.FileReader = vi.fn(() => mockFileReader) as any;

		const generateBtn = screen.getByText("Criar com IA");

		// Start the generation (awaiting this time)
		await user.click(generateBtn);

		// Wait for the button to change text to "Gerando..."
		await waitFor(() => {
			expect(screen.getByText("Gerando...")).toBeInTheDocument();
		});

		// Resolve the fetch promise
		resolveFetch!({
			ok: true,
			blob: () => Promise.resolve(mockBlob),
		});

		// Wait for the final success toast
		await waitFor(() => {
			expect(mockShowToast).toHaveBeenCalledWith(
				"Retrato gerado com sucesso!",
				"success",
			);
		});

		// Verify fetch was called with correct url
		expect(global.fetch).toHaveBeenCalledWith(
			"https://api-inference.huggingface.co/models/runwayml/stable-diffusion-v1-5",
			expect.objectContaining({ method: "POST" }),
		);
	});

	it("handles AI image generation failure", async () => {
		const user = userEvent.setup();
		await navigateToStep2(user);

		// Mock fetch to simulate failure
		global.fetch = vi.fn().mockResolvedValue({
			ok: false,
			status: 500,
		});

		const generateBtn = screen.getByText("Criar com IA");
		await user.click(generateBtn);

		// Wait for the failure to be processed
		await waitFor(() => {
			expect(mockShowToast).toHaveBeenCalledWith(
				"Erro ao gerar retrato IA. Escolha uma foto da galeria ou envie sua própria imagem.",
				"error",
			);
		});

		// Generate button should be back to original state
		expect(screen.getByText("Criar com IA")).toBeInTheDocument();
	});
});
