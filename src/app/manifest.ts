import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Caminhos Campinas",
		short_name: "Caminhos",
		description:
			"Simulador de sobrevivência e guia de direitos baseado em dados reais de Campinas/SP.",
		start_url: "/",
		display: "standalone",
		orientation: "portrait",
		background_color: "#020617", // Slate 950
		theme_color: "#020617", // Slate 950
		icons: [
			{
				src: "/icon-192.png",
				sizes: "192x192",
				type: "image/png",
			},
			{
				src: "/icon-512.png",
				sizes: "512x512",
				type: "image/png",
			},
		],
	};
}
