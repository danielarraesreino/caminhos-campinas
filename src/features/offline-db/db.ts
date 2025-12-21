let dbInstance: PouchDB.Database | null = null;

export const getDB = async () => {
	// Strong SSR check - return null if running on server
	if (typeof window === "undefined") {
		return null;
	}

	// Only create instance once on client
	if (!dbInstance) {
		try {
			// Dynamic import to prevent SSR module evaluation
			const PouchDB = (await import("pouchdb-browser")).default;
			dbInstance = new PouchDB("pop_rua_game_db");
			console.log("✅ PouchDB initialized successfully (client-side)");
		} catch (error) {
			console.error("❌ Failed to initialize PouchDB:", error);
			return null;
		}
	}

	return dbInstance;
};
