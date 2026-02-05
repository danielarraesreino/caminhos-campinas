import { initDBWithRetry, monitorDBHealth } from "./db-health";

let dbInstance: PouchDB.Database | null =
	typeof window !== "undefined"
		? (window as any).__POUCH_DB_INSTANCE__ || null
		: null;

async function initPouchDB(): Promise<PouchDB.Database | null> {
	// Dynamic import to prevent SSR module evaluation
	const PouchDBModule = await import("pouchdb-browser");
	const PouchDBFindModule = await import("pouchdb-find");
	const PouchDBIndexedDBModule = await import("pouchdb-adapter-indexeddb");

	const PouchDB = PouchDBModule.default || PouchDBModule;
	const PouchDBFind = PouchDBFindModule.default || PouchDBFindModule;
	const PouchDBIndexedDB =
		PouchDBIndexedDBModule.default || PouchDBIndexedDBModule;

	// Explicitly load modern IndexedDB adapter first
	// This prevents fallback to legacy Level adapters (leveldown, encoding-down)
	if (!(PouchDB as any).__PLUGINS_LOADED__) {
		PouchDB.plugin(PouchDBIndexedDB);
		PouchDB.plugin(PouchDBFind);
		(PouchDB as any).__PLUGINS_LOADED__ = true;
	}

	const db = new PouchDB("pop_rua_game_db", {
		auto_compaction: true,
		adapter: "indexeddb", // Explicit modern adapter (not 'idb' legacy alias)
	});

	if (typeof window !== "undefined") {
		(window as any).__POUCH_DB_INSTANCE__ = db;
	}

	console.log("✅ PouchDB initialized with IndexedDB adapter (client-side)");

	return db;
}

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
			// Use retry logic with health monitoring
			dbInstance = await initDBWithRetry(initPouchDB, 3);

			// Start health monitoring (non-blocking)
			monitorDBHealth().catch((err) =>
				console.warn("[DB] Health monitoring failed:", err),
			);
		} catch (error) {
			// Suppress "IndexedDB not supported" error on environments that look like browser but aren't
			console.warn("⚠️ PouchDB initialization failed:", error);
			return null;
		}
	}

	return dbInstance;
};
