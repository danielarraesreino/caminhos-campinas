export function getAssetUrl(path: string): string {
	const baseUrl = process.env.NEXT_PUBLIC_ASSETS_URL;
	// If no remote URL is set, fallback to local public folder
	if (!baseUrl) return path.startsWith("/") ? path : `/${path}`;

	// Clean inputs to avoid double slashes
	const cleanBase = baseUrl.replace(/\/$/, "");
	const cleanPath = path.replace(/^\//, "");

	return `${cleanBase}/${cleanPath}`;
}
