import { useEffect, useState } from "react";
import { getDB } from "./db";

export const useOfflineDB = (collection?: string) => {
	const [db, setDb] = useState<PouchDB.Database | null>(null);

	useEffect(() => {
		// This only runs on client-side
		async function initDB() {
			try {
				const database = await getDB();
				if (database) {
					setDb(database);
				}
			} catch (error) {
				console.error("Error initializing offline DB:", error);
			}
		}

		initDB();
	}, []);

	// Helper for easy saving
	const saveLocally = async (doc: any) => {
		if (!db) return;
		try {
			// Add _id if missing to avoid conflicts or let PouchDB handle it?
			// Generally PouchDB handles it if let empty, but good to ensure valid object.
			await db.post(doc);
			console.log("Saved to offline DB:", doc);
		} catch (err) {
			console.error("Offline DB save error:", err);
			throw err;
		}
	};

	return { db, saveLocally };
};
