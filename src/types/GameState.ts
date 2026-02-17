/**
 * Metas ODS específicas para população em situação de rua
 * Baseado em: Relatórios Luz, Relatório Nacional Voluntário 2024, Censo FEAC 2024
 */
export type ODSTarget =
	| "1.3" // Proteção Social / CadÚnico
	| "1.4" // Acesso a serviços básicos e recursos econômicos
	| "2.1" // Acesso a alimento seguro o ano todo
	| "3.5" // Prevenção/tratamento abuso de substâncias (Redução de Danos)
	| "3.8" // Cobertura universal de saúde
	| "6.2" // Acesso a saneamento/higiene (Banho/Banheiro)
	| "8.5" // Emprego pleno e trabalho decente
	| "10.2" // Inclusão social independente de condição
	| "11.1" // Habitação/abrigo seguro
	| "16.9" // Identidade legal (Documentos)
	| "18"; // Igualdade Étnico-Racial (ODS proposto pelo Brasil)

/**
 * Barreiras de acesso a serviços - dados reais do Censo FEAC 2024
 * Cada barreira representa um bloqueio institucional que exclui pessoas
 */
export type AccessBarrier =
	| "REQUIRES_RG" // Exige RG
	| "REQUIRES_CPF" // Exige CPF
	| "REQUIRES_SOBRIETY" // Exige sobriedade
	| "NO_ANIMALS" // Não aceita animais
	| "NO_CARTS" // Não aceita carroças
	| "REQUIRES_APPOINTMENT" // Exige agendamento prévio (digital)
	| "REQUIRES_REFERRAL" // Exige encaminhamento técnico
	| "DRESS_CODE" // Exige vestimenta adequada
	| "TIME_RESTRICTED" // Horário rígido de entrada
	| "CAPACITY_LIMITED"; // Vagas limitadas por dia

/**
 * Registro ODS para telemetria e auditoria social
 */
export interface ODSMetadata {
	target: ODSTarget;
	label: string;
	description: string;
	color: string;
}

export interface Avatar {
	name: string;
	gender:
		| "masculino"
		| "feminino"
		| "mulher_trans"
		| "homem_trans"
		| "travesti"
		| "nao-binario";
	ethnicity: "branco" | "preto" | "pardo" | "indigena";
	ageRange: "jovem" | "adulto" | "idoso";
	timeOnStreet: "recente" | "veterano";
	startingSkill: "reciclagem" | "artesao" | "vendedor" | "nenhuma";
	avatarImage?: string;
}

export interface Item {
	id: string;
	name: string;
	weight: number;
	type: "valioso" | "sobrevivencia";
}

export type PDUObjective =
	| "SOCIAL" // Encaminhamentos Sociais
	| "SAUDE" // Saúde Física/Mental
	| "EDUCACAO" // Formação/Educação
	| "TRABALHO" // Trabalho/Renda
	| "FINANCAS" // Organização Financeira
	| "FAMILIA" // Vínculos Familiares
	| "CONVIVENCIA" // Regras de Convivência
	| "MORADIA" // Plano de Saída/Locação
	| "CIDADANIA"; // Acesso à Justiça/Direitos

export interface PDUState {
	isActive: boolean;
	objective: PDUObjective | null;
	currentStageId: string; // ex: "tirar_rg"
	completedStages: string[]; // ex: ["entrevista_inicial"]
	stressLevel: number; // "Fadiga Burocrática"
}

export interface GameState {
	health: number;
	hunger: number;
	hygiene: number;
	sanity: number;
	energy: number;
	dignity: number;
	socialStigma: number;
	stabilityGap: number;
	money: number;
	pdu: PDUState;
	workTool: {
		type: "CARRINHO_RECICLAGEM" | "SACO_PRETO" | null;
		condition: number;
		capacity: number;
		riskFactor: number;
		isConfiscated: boolean;
	};
	documents: {
		hasRG: boolean;
		hasCPF: boolean;
		hasCarteiraTrabalho: boolean;
		hasComprovanteResidencia: boolean;
		rgPhoto?: string;
		cpfPhoto?: string;
		carteiraTrabalhoPhoto?: string;
	};
	socialThermometer: {
		fome: number;
		higiene: number;
		violencia: number;
		saude: number;
	};
	flags: Record<string, boolean>;
	activeBuffs: string[];
	isAtShelter: boolean;
	inventory: Item[];
	day: number;
	time: number;
	resolvedDilemmas: string[];
	activeDilemmaId: string | null;
	criticalHealth: boolean;
	avatar: Avatar | null;
	phoneBattery: number; // 0-100
	userPosition: [number, number] | null;
	isPaused: boolean;
	addiction: number;
	trust: number;
	employed_formal: boolean;
	citizenship: number; // 0-100 gauge of institutional access
	knowledge: number; // 0-100 (Rualogia)
	score: number; // Legacy score
	security: number; // 0-100 (Moradia/Segurança)
	history: GameEvent[];
	activeArcId: string | null;
	isProcessingGameOver: boolean; // [NEW] Prevent double-game-over during transitions
	hasHydrated: boolean;
}

export interface GameEvent {
	id: string;
	type: "VIOLATION" | "ACHIEVEMENT" | "STATISTIC" | "BARRIER";
	timestamp: number;
	tags: string[];
	description: string;
}

export type GameAction =
	| { type: "SET_STATE"; payload: GameState }
	| { type: "MODIFY_STAT"; payload: { stat: keyof GameState; amount: number } }
	| { type: "ADD_MONEY"; payload: number }
	| { type: "ADVANCE_TIME"; payload: number }
	| { type: "RESOLVE_DILEMMA"; payload: string }
	| { type: "SET_ACTIVE_DILEMMA"; payload: string | null }
	| { type: "SET_AT_SHELTER"; payload: boolean }
	| { type: "SET_WORK_TOOL"; payload: GameState["workTool"] }
	| { type: "ADD_BUFF"; payload: string }
	| { type: "REMOVE_BUFF"; payload: string }
	| { type: "ADD_INVENTORY"; payload: Item }
	| { type: "REMOVE_INVENTORY"; payload: string }
	| { type: "SET_AVATAR"; payload: Avatar }
	| { type: "SET_PAUSED"; payload: boolean }
	| { type: "SET_USER_POSITION"; payload: [number, number] | null }
	| { type: "INIT_PDU"; payload: { objective: PDUObjective } }
	| { type: "UPDATE_PDU_STAGE"; payload: { stageId: string } }
	| { type: "COMPLETE_PDU_STAGE"; payload: { stageId: string } }
	| { type: "RESET_GAME" }
	| { type: "SLEEP" }
	| { type: "UPDATE_DOCUMENTS"; payload: Partial<GameState["documents"]> }
	| { type: "SET_EMPLOYED_FORMAL"; payload: boolean }
	| { type: "LOG_EVENT"; payload: GameEvent }
	| { type: "SET_FLAG"; payload: { key: string; value: boolean } }
	| { type: "SET_ACTIVE_ARC"; payload: string | null }
	| { type: "SET_PROCESSING_GAME_OVER"; payload: boolean }
	| { type: "REGISTER_OCCURRENCE"; payload: string };
export interface RiskFactor {
	id: string;
	label: string;
	probability: number; // 0-1
	intensity: number; // multiplier for impact
	description: string;
}

export interface Resource {
	id: string;
	label: string;
	cost: number;
	impact: {
		stat: keyof GameState;
		amount: number;
	}[];
	timeRequired: number; // in hours
}

export interface Location {
	id: string;
	name: string;
	coords: { lat: number; lng: number };
	description: string;
	resources: Resource[];
	risks: RiskFactor[];
	stigmaMultiplier: number; // how much social stigma affects risks here
	sanityDrainBase: number; // base sanity drain per hour
}
