interface CachedDilemma {
	scenario: string;
	options: string[];
	timestamp: number;
}

// biome-ignore lint/complexity/noStaticOnlyClass: utility class pattern
export class DilemmaCache {
	private static TTL = 24 * 60 * 60 * 1000; // 24 horas
	private static PREFIX = "dilemma_cache_";

	static get(key: string): CachedDilemma | null {
		if (typeof window === "undefined") return null; // SSR safety

		try {
			const cached = localStorage.getItem(`${DilemmaCache.PREFIX}${key}`);
			if (!cached) return null;

			const data: CachedDilemma = JSON.parse(cached);

			// Verificar se expirou
			if (Date.now() - data.timestamp > DilemmaCache.TTL) {
				DilemmaCache.remove(key);
				return null;
			}

			return data;
		} catch (error) {
			console.error("Erro ao ler cache:", error);
			return null;
		}
	}

	static set(key: string, dilemma: Omit<CachedDilemma, "timestamp">): void {
		if (typeof window === "undefined") return; // SSR safety

		try {
			const cacheData: CachedDilemma = {
				...dilemma,
				timestamp: Date.now(),
			};

			localStorage.setItem(
				`${DilemmaCache.PREFIX}${key}`,
				JSON.stringify(cacheData),
			);

			// Limpar cache antigo (manter apenas últimos 10)
			DilemmaCache.cleanup();
		} catch (error) {
			console.error("Erro ao salvar cache:", error);
		}
	}

	static remove(key: string): void {
		if (typeof window === "undefined") return;
		localStorage.removeItem(`${DilemmaCache.PREFIX}${key}`);
	}

	static clear(): void {
		if (typeof window === "undefined") return;

		Object.keys(localStorage)
			.filter((k) => k.startsWith(DilemmaCache.PREFIX))
			.forEach((k) => {
				localStorage.removeItem(k);
			});
	}

	private static cleanup(): void {
		if (typeof window === "undefined") return;

		const cacheKeys = Object.keys(localStorage).filter((k) =>
			k.startsWith(DilemmaCache.PREFIX),
		);

		// Se tiver mais de 10, remover os mais antigos
		if (cacheKeys.length > 10) {
			const cacheItems = cacheKeys
				.map((key) => {
					try {
						const data = JSON.parse(localStorage.getItem(key) || "{}");
						return { key, timestamp: data.timestamp || 0 };
					} catch {
						return { key, timestamp: 0 };
					}
				})
				.sort((a, b) => a.timestamp - b.timestamp);

			// Remover os 5 mais antigos
			cacheItems.slice(0, 5).forEach((item) => {
				localStorage.removeItem(item.key);
			});
		}
	}

	static getStats() {
		if (typeof window === "undefined")
			return { total: 0, oldest: null, newest: null };

		const cacheKeys = Object.keys(localStorage).filter((k) =>
			k.startsWith(DilemmaCache.PREFIX),
		);

		if (cacheKeys.length === 0) {
			return { total: 0, oldest: null, newest: null };
		}

		const timestamps = cacheKeys
			.map((key) => {
				try {
					const data = JSON.parse(localStorage.getItem(key) || "{}");
					return data.timestamp || 0;
				} catch {
					return 0;
				}
			})
			.filter((ts) => ts > 0);

		return {
			total: cacheKeys.length,
			oldest: timestamps.length > 0 ? new Date(Math.min(...timestamps)) : null,
			newest: timestamps.length > 0 ? new Date(Math.max(...timestamps)) : null,
		};
	}
}
