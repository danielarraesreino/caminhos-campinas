/**
 * Protocolo Anti-Chacina: Utilitários de Anonimização Espacial e Temporal
 */

const GRID_SIZE_DEG = 0.0045; // Aproximadamente 500m em latitude

/**
 * Converte coordenadas exatas em uma célula de grade (Grid Cell).
 * Isso remove a precisão milimétrica e agrupa usuários em blocos de ~500m.
 */
export function toGrid(lat: number, lng: number): string {
	const latGrid = Math.round(lat / GRID_SIZE_DEG) * GRID_SIZE_DEG;
	const lngGrid = Math.round(lng / GRID_SIZE_DEG) * GRID_SIZE_DEG;
	return `${latGrid.toFixed(4)},${lngGrid.toFixed(4)}`;
}

/**
 * Adiciona um atraso temporal (jitter) para evitar rastreamento em tempo real.
 */
export function applyTimeJitter(timestamp: number): number {
	// Adiciona um atraso aleatório entre 1 e 2 horas (em milissegundos)
	const jitter = (60 + Math.random() * 60) * 60 * 1000;
	return timestamp - jitter;
}

/**
 * Implementa k-anonymity básica.
 * Se o número de registros em uma célula for menor que o limite, os dados são suprimidos.
 */
export function filterByDensity<T>(
	gridData: Map<string, T[]>,
	minDensity = 5,
): Map<string, T[]> {
	const filtered = new Map<string, T[]>();
	for (const [grid, events] of gridData.entries()) {
		if (events.length >= minDensity) {
			filtered.set(grid, events);
		}
	}
	return filtered;
}
