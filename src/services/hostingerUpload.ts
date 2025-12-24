export async function uploadUserDilemma(
	audioBlob: Blob,
	text: string,
	contact?: string,
): Promise<{ success: boolean; message: string }> {
	try {
		const formData = new FormData();
		formData.append("audio", audioBlob, "dilemma_audio.webm");
		formData.append("text", text);
		if (contact) formData.append("contact", contact);

		const apiUrl = process.env.NEXT_PUBLIC_HOSTINGER_API_URL;

		if (!apiUrl) {
			console.warn("HOSTINGER_API_URL not set. Simulating upload.");
			await new Promise((resolve) => setTimeout(resolve, 2000));
			return { success: true, message: "Upload simulado (ENV missing)" };
		}

		const response = await fetch(apiUrl, {
			method: "POST",
			body: formData,
		});

		if (!response.ok) {
			throw new Error(`Upload failed: ${response.statusText}`);
		}

		return { success: true, message: "Relato enviado com sucesso!" };
	} catch (error) {
		console.error("Error uploading dilemma:", error);
		return { success: false, message: "Erro ao enviar relato." };
	}
}
