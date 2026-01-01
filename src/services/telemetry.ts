import { anonymizeLocation, applyTimeJitter } from "@/utils/anonymization";

export enum TelemetryAction {
	CLICK = "CLICK",
	VIEW = "VIEW",
	ERROR = "ERROR",
	GAME_EVENT = "GAME_EVENT",
	SYNC = "SYNC",
	ODS_METRIC = "ODS_METRIC",
	DECISION_MADE = "DECISION_MADE",
	SERVICE_USED = "SERVICE_USED",
}

export interface TelemetryEvent {
	id: string;
	timestamp: number;
	action_type: TelemetryAction;
	metadata: Record<string, unknown>;
	ods_category?: string; // Step 2.2
	ods_target?: string;
	violation_type?: string;
	resource_gap?: string;
	user_hash: string; // Step 2.3
	synced: number;
}

const DB_NAME = "telemetry_db";
const STORE_NAME = "events";
const DB_VERSION = 1;

class TelemetryService {
	private static instance: TelemetryService;
	private dbPromise: Promise<IDBDatabase> | null = null;
	private sessionHash: string;

	private constructor() {
		// Lazy init: Do not call this.initDB() here. It will be called by track() when needed.
		// prevents "Unhandled Rejection" on server-side where IndexedDB is missing.

		// Step 2.3: Session-based rotating hash (not persistent user ID)
		this.sessionHash = crypto.randomUUID();
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
		metadata: Record<string, unknown> = {},
		options?: {
			ods_category?: string;
			violation_type?: string;
			resource_gap?: string;
		},
	): Promise<void> {
		try {
			const db = await this.initDB();

			// Step 1 & 2.1: Anonymization (Time Jitter + Location Fuzzing)
			const safeTimestamp = applyTimeJitter(Date.now());
			const safeMetadata = { ...metadata };

			if (
				typeof safeMetadata.lat === "number" &&
				typeof safeMetadata.lng === "number"
			) {
				const { lat, lng } = safeMetadata;
				safeMetadata.location = anonymizeLocation(lat, lng);
				delete safeMetadata.lat;
				delete safeMetadata.lng;
			}

			const event: TelemetryEvent = {
				id: crypto.randomUUID(),
				timestamp: safeTimestamp, // Jittered
				action_type,
				metadata: safeMetadata,
				ods_category: options?.ods_category,
				violation_type: options?.violation_type,
				resource_gap: options?.resource_gap,
				user_hash: this.sessionHash, // Anonymous Session ID
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
		return this.getAllEvents(true);
	}

	public async getAllEvents(onlyUnsynced = false): Promise<TelemetryEvent[]> {
		try {
			const db = await this.initDB();
			return new Promise((resolve, reject) => {
				const transaction = db.transaction([STORE_NAME], "readonly");
				const store = transaction.objectStore(STORE_NAME);

				let request: IDBRequest;
				if (onlyUnsynced) {
					const index = store.index("synced");
					request = index.getAll(0);
				} else {
					request = store.getAll();
				}

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
