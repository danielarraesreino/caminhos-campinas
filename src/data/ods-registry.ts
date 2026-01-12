/**
 * Catálogo central de metas ODS para auditoria social
 * Baseado em: Relatórios Luz, Relatório Nacional Voluntário 2024, Censo FEAC 2024
 */

import type { ODSMetadata, ODSTarget } from "@/types/GameState";

export const ODS_REGISTRY: Record<ODSTarget, ODSMetadata> = {
	"1.3": {
		target: "1.3",
		label: "Proteção Social",
		description:
			"Implementar medidas e sistemas de proteção social (CadÚnico, Bolsa Família)",
		color: "#E5243B",
	},
	"1.4": {
		target: "1.4",
		label: "Acesso a Serviços Básicos",
		description: "Garantir acesso a serviços básicos e recursos econômicos",
		color: "#E5243B",
	},
	"2.1": {
		target: "2.1",
		label: "Fome Zero",
		description:
			"Acabar com a fome e garantir acesso a alimentos seguros o ano todo",
		color: "#DDA63A",
	},
	"3.5": {
		target: "3.5",
		label: "Redução de Danos",
		description:
			"Prevenção e tratamento do abuso de substâncias (narcóticos e álcool)",
		color: "#4C9F38",
	},
	"3.8": {
		target: "3.8",
		label: "Cobertura de Saúde",
		description:
			"Atingir cobertura universal de saúde (acesso a medicamentos e vacinas)",
		color: "#4C9F38",
	},
	"6.2": {
		target: "6.2",
		label: "Saneamento e Higiene",
		description:
			"Acesso a saneamento e higiene adequados (banho, banheiro, dignidade)",
		color: "#26BDE2",
	},
	"8.5": {
		target: "8.5",
		label: "Trabalho Decente",
		description: "Emprego pleno e trabalho decente para todos",
		color: "#A21942",
	},
	"10.2": {
		target: "10.2",
		label: "Inclusão Social",
		description:
			"Empoderar e promover a inclusão social, independentemente de raça ou condição",
		color: "#DD1367",
	},
	"11.1": {
		target: "11.1",
		label: "Habitação Segura",
		description: "Garantir acesso a habitação segura e adequada para todos",
		color: "#FD9D24",
	},
	"16.9": {
		target: "16.9",
		label: "Identidade Legal",
		description:
			"Fornecer identidade legal para todos (registro de nascimento, RG, CPF)",
		color: "#00689D",
	},
	"18": {
		target: "18",
		label: "Igualdade Étnico-Racial",
		description:
			"Enfrentamento ao racismo estrutural (ODS proposto pelo Brasil)",
		color: "#19486A",
	},
} as const;

/**
 * Mapeia tipos de serviço para metas ODS primárias
 */
export const SERVICE_TYPE_TO_ODS: Record<string, ODSTarget[]> = {
	ALIMENTACAO: ["2.1"],
	ABRIGO: ["11.1"],
	SAUDE: ["3.8"],
	HEALTH_MENTAL: ["3.5", "3.8"],
	ASSISTENCIA: ["1.3", "1.4"],
	HIGIENE: ["6.2"],
	TRABALHO: ["8.5"],
	DOCUMENTOS: ["16.9"],
	CIDADANIA: ["10.2", "16.9"],
	LGBT: ["10.2"],
};

/**
 * Retorna descrição amigável de barreira de acesso
 */
export const BARRIER_LABELS: Record<string, string> = {
	REQUIRES_RG: "Exige RG",
	REQUIRES_CPF: "Exige CPF",
	REQUIRES_SOBRIETY: "Exige sobriedade",
	NO_ANIMALS: "Não aceita animais",
	NO_CARTS: "Não aceita carroças",
	REQUIRES_APPOINTMENT: "Exige agendamento prévio",
	REQUIRES_REFERRAL: "Via encaminhamento",
	DRESS_CODE: "Exige vestimenta adequada",
	TIME_RESTRICTED: "Horário rígido",
	CAPACITY_LIMITED: "Vagas limitadas",
};
