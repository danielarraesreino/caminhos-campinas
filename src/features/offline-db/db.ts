let dbInstance: PouchDB.Database | null = null;

export const getDB = async () => {
	// 1. Absolute Server Guard (Next.js specific)
	if (typeof process !== "undefined" && process.env.NEXT_RUNTIME === "nodejs") {
		return null;
	}

	// 2. Browser Environment Guard
	if (typeof window === "undefined") {
		return null;
	}

	// Only create instance once on client
	if (!dbInstance) {
		try {
			// Dynamic import to prevent SSR module evaluation
			const PouchDBModule = await import("pouchdb-browser");
			const PouchDB = PouchDBModule.default || PouchDBModule;

			dbInstance = new PouchDB("pop_rua_game_db", {
				auto_compaction: true,
				adapter: "idb", // Force IndexedDB adapter to avoid guessing
			});
			console.log("✅ PouchDB initialized successfully (client-side)");
		} catch (error) {
			// Suppress "IndexedDB not supported" error on environments that look like browser but aren't
			console.warn("⚠️ PouchDB initialization skipped:", error);
			return null;
		}
	}

	return dbInstance;
};
