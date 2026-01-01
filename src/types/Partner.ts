export type PartnerType =
	| "ONG"
	| "COLETIVO"
	| "INSTITUICAO"
	| "MOVIMENTO_SOCIAL";

export type PartnerService =
	| "ALIMENTACAO"
	| "BANHO"
	| "JURIDICO"
	| "SAUDE"
	| "ACOLHIMENTO"
	| "EDUCACAO"
	| "CULTURA"
	| "DOACOES";

export interface PartnerLocation {
	lat: number;
	lng: number;
}

export interface Partner {
	id: string;
	name: string;
	description: string;
	type: PartnerType;
	services: PartnerService[];
	location: PartnerLocation;
	address: string;
	phone?: string;
	website?: string;
	constraints: string[]; // e.g., "Apenas mulheres", "Proibido animais"
	verified: boolean;
	createdAt: number;
}
