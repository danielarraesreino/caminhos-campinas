export enum TelemetryAction {
	CLICK = "CLICK",
	VIEW = "VIEW",
	ERROR = "ERROR",
	GAME_EVENT = "GAME_EVENT",
	SYNC = "SYNC",
}

export interface TelemetryEvent {
	id: string;
	timestamp: number;
	action_type: TelemetryAction;
	metadata: Record<string, any>;
	synced: number; // 0 = false, 1 = true (booleans are not always valid keys in TS definitions)
}

const DB_NAME = "telemetry_db";
const STORE_NAME = "events";
const DB_VERSION = 1;

class TelemetryService {
	private static instance: TelemetryService;
	private dbPromise: Promise<IDBDatabase> | null = null;

	private constructor() {
		this.initDB();
	}

	public static getInstance(): TelemetryService {
		if (!TelemetryService.instance) {
			TelemetryService.instance = new TelemetryService();
		}
		return TelemetryService.instance;
	}

	private initDB(): Promise<IDBDatabase> {
		if (this.dbPromise) return this.dbPromise;

		if (typeof window === "undefined" || !("indexedDB" in window)) {
			// Handle server-side or non-supported environments gracefully
			return Promise.reject("IndexedDB not supported");
		}

		this.dbPromise = new Promise((resolve, reject) => {
			const request = indexedDB.open(DB_NAME, DB_VERSION);

			request.onerror = (event) => {
				console.error("TelemetryDB error:", event);
				reject(event);
			};

			request.onsuccess = (event) => {
				resolve((event.target as IDBOpenDBRequest).result);
			};

			request.onupgradeneeded = (event) => {
				const db = (event.target as IDBOpenDBRequest).result;
				if (!db.objectStoreNames.contains(STORE_NAME)) {
					const objectStore = db.createObjectStore(STORE_NAME, {
						keyPath: "id",
					});
					objectStore.createIndex("synced", "synced", { unique: false });
				}
			};
		});

		return this.dbPromise;
	}

	public async track(
		action_type: TelemetryAction,
		metadata: Record<string, any> = {},
	): Promise<void> {
		try {
			const db = await this.initDB();
			const event: TelemetryEvent = {
				id: crypto.randomUUID(),
				timestamp: Date.now(),
				action_type,
				metadata,
				synced: 0,
			};

			return new Promise((resolve, reject) => {
				const transaction = db.transaction([STORE_NAME], "readwrite");
				const store = transaction.objectStore(STORE_NAME);
				const request = store.add(event);

				request.onsuccess = () => resolve();
				request.onerror = () => reject(request.error);
			});
		} catch (error) {
			console.warn("Failed to track telemetry event:", error);
		}
	}

	public async getUnsyncedEvents(): Promise<TelemetryEvent[]> {
		try {
			const db = await this.initDB();
			return new Promise((resolve, reject) => {
				const transaction = db.transaction([STORE_NAME], "readonly");
				const store = transaction.objectStore(STORE_NAME);
				const index = store.index("synced");
				// use 0 for unsynced
				const request = index.getAll(0);

				request.onsuccess = () => {
					resolve(request.result);
				};
				request.onerror = () => reject(request.error);
			});
		} catch (_error) {
			return [];
		}
	}

	public async markAsSynced(ids: string[]): Promise<void> {
		try {
			const db = await this.initDB();
			// We need to update items.
			// Efficient way: read them, update, put back.
			// Or cursor.
			// For simplicity/safety in async context:
			const transaction = db.transaction([STORE_NAME], "readwrite");
			const store = transaction.objectStore(STORE_NAME);

			return new Promise((resolve, reject) => {
				// We'll just do it individually for now as IDB bulk ops are manual
				let completed = 0;
				if (ids.length === 0) {
					resolve();
					return;
				}

				ids.forEach((id) => {
					const getReq = store.get(id);
					getReq.onsuccess = () => {
						const item = getReq.result as TelemetryEvent;
						if (item) {
							item.synced = 1;
							store.put(item);
						}
						completed++;
						if (completed === ids.length) resolve();
					};
					getReq.onerror = () => {
						completed++; // count errors to avoid hanging
						if (completed === ids.length) resolve();
					};
				});

				transaction.onerror = () => reject(transaction.error);
				transaction.oncomplete = () => resolve();
			});
		} catch (error) {
			console.error("Failed to mark synced:", error);
		}
	}
}

export const telemetryService = TelemetryService.getInstance();
