interface ApiMetric {
	timestamp: string;
	responseTime: number;
	success: boolean;
	ip: string;
	type?: string;
	error?: string;
}

class MetricsCollector {
	private metrics: ApiMetric[] = [];
	private maxSize = 1000; // Últimas 1000 requisições

	add(metric: ApiMetric): void {
		this.metrics.push(metric);

		// Manter apenas as últimas maxSize métricas
		if (this.metrics.length > this.maxSize) {
			this.metrics.shift();
		}
	}

	getStats() {
		if (this.metrics.length === 0) {
			return {
				total: 0,
				successful: 0,
				failureRate: "0%",
				avgResponseTime: "0ms",
				last24h: 0,
				last1h: 0,
			};
		}

		const total = this.metrics.length;
		const successful = this.metrics.filter((m) => m.success).length;
		const avgResponseTime =
			this.metrics.reduce((sum, m) => sum + m.responseTime, 0) / total;

		const now = Date.now();
		const last24h = this.metrics.filter(
			(m) => now - new Date(m.timestamp).getTime() < 24 * 60 * 60 * 1000,
		).length;

		const last1h = this.metrics.filter(
			(m) => now - new Date(m.timestamp).getTime() < 60 * 60 * 1000,
		).length;

		return {
			total,
			successful,
			failureRate: `${(((total - successful) / total) * 100).toFixed(2)}%`,
			avgResponseTime: `${Math.round(avgResponseTime)}ms`,
			last24h,
			last1h,
		};
	}

	getRecent(limit = 10): ApiMetric[] {
		return this.metrics.slice(-limit).reverse();
	}

	clear(): void {
		this.metrics = [];
	}
}

export const apiMetrics = new MetricsCollector();
