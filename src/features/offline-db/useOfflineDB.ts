import { useEffect, useState } from "react";
import { getDB } from "./db";

export const useOfflineDB = () => {
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

	return db;
};
