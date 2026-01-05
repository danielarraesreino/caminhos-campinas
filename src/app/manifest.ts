import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: "Caminhos Campinas",
		short_name: "Caminhos",
		description:
			"Serious Game sobre a realidade da população de rua em Campinas.",
		start_url: "/",
		display: "standalone",
		orientation: "portrait",
		background_color: "#020617", // Slate 950
		theme_color: "#020617", // Slate 950
		icons: [
			{
				src: "/globe.svg",
				sizes: "192x192",
				type: "image/svg+xml",
			},
			{
				src: "/globe.svg",
				sizes: "512x512",
				type: "image/svg+xml",
			},
		],
	};
}
