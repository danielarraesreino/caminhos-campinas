// src/utils/anonymization.ts
const GRID_SIZE_DEG = 0.0045; // Aprox 500m
const TIME_JITTER_WINDOW = 1000 * 60 * 60 * 4; // 4 horas

export function anonymizeLocation(lat: number, lng: number): string {
	// Arredonda para o centro da célula da grade mais próxima
	// Isso impede a localização exata de onde a pessoa está dormindo
	let latGrid = Math.round(lat / GRID_SIZE_DEG) * GRID_SIZE_DEG;
	let lngGrid = Math.round(lng / GRID_SIZE_DEG) * GRID_SIZE_DEG;

	// Previne a string "-0.0000"
	if (latGrid === 0) latGrid = 0;
	if (lngGrid === 0) lngGrid = 0;

	return `${latGrid.toFixed(4)},${lngGrid.toFixed(4)}`;
}

export function applyTimeJitter(timestamp: number): number {
	// Adiciona um atraso aleatório negativo para desvincular o evento do tempo real
	return timestamp - Math.floor(Math.random() * TIME_JITTER_WINDOW);
}
