/**
 * IndexedDB Resilience Module
 *
 * Provides robust error handling, retry logic, and health monitoring for IndexedDB operations.
 * Addresses production issues documented in VERCEL_ISSUES.md
 */

type ConnectionState = "closed" | "opening" | "open" | "error";

interface DBHealthStatus {
	state: ConnectionState;
	lastError: Error | null;
	quotaUsed: number;
	quotaAvailable: number;
	lastSuccessfulOperation: Date | null;
}

const healthStatus: DBHealthStatus = {
	state: "closed",
	lastError: null,
	quotaUsed: 0,
	quotaAvailable: 0,
	lastSuccessfulOperation: null,
};

/**
 * Exponential backoff delay for retry logic
 */
function delay(ms: number): Promise<void> {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check IndexedDB quota usage and availability
 */
export async function checkQuota(): Promise<{
	used: number;
	available: number;
	percentUsed: number;
}> {
	// SSR guard
	if (typeof window === "undefined") {
		return { used: 0, available: 0, percentUsed: 0 };
	}

	try {
		if ("storage" in navigator && "estimate" in navigator.storage) {
			const estimate = await navigator.storage.estimate();
			const used = estimate.usage || 0;
			const available = estimate.quota || 0;
			const percentUsed = available > 0 ? (used / available) * 100 : 0;

			healthStatus.quotaUsed = used;
			healthStatus.quotaAvailable = available;

			return { used, available, percentUsed };
		}
	} catch (error) {
		console.warn("[DB Health] Quota check failed:", error);
	}

	return { used: 0, available: 0, percentUsed: 0 };
}

/**
 * Get current health status
 */
export function getDBHealth(): DBHealthStatus {
	return { ...healthStatus };
}

/**
 * Initialize IndexedDB with retry logic for AbortError
 */
export async function initDBWithRetry(
	// biome-ignore lint/suspicious/noExplicitAny: Generic init function
	initFunction: () => Promise<any>,
	maxRetries = 3,
	// biome-ignore lint/suspicious/noExplicitAny: Generic init function
): Promise<any> {
	// SSR guard
	if (typeof window === "undefined") {
		console.log("[DB Health] Skipping initialization (SSR environment)");
		return null;
	}

	healthStatus.state = "opening";

	for (let attempt = 1; attempt <= maxRetries; attempt++) {
		try {
			console.log(
				`[DB Health] Initialization attempt ${attempt}/${maxRetries}`,
			);

			const db = await initFunction();

			healthStatus.state = "open";
			healthStatus.lastError = null;
			healthStatus.lastSuccessfulOperation = new Date();

			console.log("[DB Health] ✅ IndexedDB initialized successfully");
			return db;
		} catch (error) {
			const err = error as Error;

			// AbortError - retry with exponential backoff
			if (err.name === "AbortError" && attempt < maxRetries) {
				const backoffMs = 1000 * 2 ** (attempt - 1);
				console.warn(
					`[DB Health] ⚠️ AbortError detected. Retrying in ${backoffMs}ms... (${attempt}/${maxRetries})`,
				);
				healthStatus.lastError = err;
				await delay(backoffMs);
				continue;
			}

			// [NEW] If AbortError persists after max retries, try a repair if safe
			if (err.name === "AbortError" && attempt === maxRetries) {
				console.error(
					"[DB Health] 🚨 AbortError persisted after max retries. Attempting FORCED REPAIR.",
				);
				try {
					await repairDatabase("pop_rua_game_db");
					console.log(
						"[DB Health] ✅ Repair successful. Retrying one last time.",
					);
					return await initFunction();
				} catch (repairErr) {
					console.error("[DB Health] ❌ Forced repair failed:", repairErr);
					throw err;
				}
			}
		}
	}

	// Shouldn't reach here, but TypeScript needs it
	throw new Error("IndexedDB initialization failed after all retries");
}

/**
 * Repair corrupted database by clearing and reinitializing
 */
export async function repairDatabase(dbName: string): Promise<void> {
	// SSR guard
	if (typeof window === "undefined" || !("indexedDB" in window)) {
		console.log("[DB Health] Skipping repair (no IndexedDB available)");
		return;
	}

	try {
		console.log(`[DB Health] Attempting to repair database: ${dbName}`);

		// Close any open connections
		healthStatus.state = "closed";

		// Delete the corrupted database
		const deleteRequest = indexedDB.deleteDatabase(dbName);

		await new Promise((resolve, reject) => {
			deleteRequest.onsuccess = () => {
				console.log(`[DB Health] ✅ Database ${dbName} deleted successfully`);
				resolve(true);
			};
			deleteRequest.onerror = () => {
				console.error(`[DB Health] ❌ Failed to delete database ${dbName}`);
				reject(deleteRequest.error);
			};
			deleteRequest.onblocked = () => {
				console.warn(
					`[DB Health] ⚠️ Database deletion blocked. Close all tabs using this database.`,
				);
				reject(new Error("Database deletion blocked"));
			};
		});

		console.log(
			"[DB Health] ✅ Database repaired. Reinitialize on next operation.",
		);
	} catch (error) {
		console.error("[DB Health] ❌ Database repair failed:", error);
		throw error;
	}
}

/**
 * Monitor database health and log warnings
 */
export async function monitorDBHealth(): Promise<void> {
	// SSR guard
	if (typeof window === "undefined") {
		return;
	}

	try {
		const quota = await checkQuota();

		// Warn if quota usage is high
		if (quota.percentUsed > 80) {
			console.warn(
				`[DB Health] ⚠️ IndexedDB quota ${quota.percentUsed.toFixed(1)}% full (${quota.used} / ${quota.available} bytes)`,
			);
		}

		// Warn if last operation was long ago
		if (
			healthStatus.lastSuccessfulOperation &&
			Date.now() - healthStatus.lastSuccessfulOperation.getTime() > 60000
		) {
			console.warn(
				"[DB Health] ⚠️ No successful DB operation in last 60 seconds",
			);
		}

		// Log current state
		console.log("[DB Health] Status:", {
			state: healthStatus.state,
			quotaUsed: `${quota.percentUsed.toFixed(1)}%`,
			lastError: healthStatus.lastError?.name || "none",
		});
	} catch (error) {
		console.error("[DB Health] Monitoring failed:", error);
	}
}
