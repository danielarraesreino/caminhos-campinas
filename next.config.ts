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
		],
	},
};

export default nextConfig;
