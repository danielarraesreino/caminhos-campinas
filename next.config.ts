import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	reactStrictMode: true,
	reactCompiler: true,
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "api.dicebear.com",
			},
			{
				protocol: "https",
				hostname: "**.openstreetmap.org",
			},
			{
				protocol: "https",
				hostname: "lightseagreen-horse-933009.hostingersite.com",
			},
			{
				protocol: "https",
				hostname: "imgur.com",
			},
			{
				protocol: "https",
				hostname: "i.imgur.com",
			},
		],
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
	},
};

export default nextConfig;
