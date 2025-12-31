import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "api.dicebear.com",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "lightseagreen-horse-933009.hostingersite.com",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "imgur.com",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "i.imgur.com",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "raw.githubusercontent.com",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "lightseagreen-horse-933009.hostingersite.com",
				pathname: "/**",
			},
		],
	},
	// Optimization to avoid timeouts in Serverless Functions
	experimental: {
		serverActions: {
			bodySizeLimit: "2mb",
		},
	},
};

export default nextConfig;
