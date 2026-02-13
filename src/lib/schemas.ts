import { z } from "zod";

// --- Enums & Basic Types ---

export const AvatarSchema = z.object({
	name: z.string().default("Unknown"),
	gender: z
		.enum([
			"masculino",
			"feminino",
			"mulher_trans",
			"homem_trans",
			"travesti",
			"nao-binario",
		])
		.default("masculino"),
	ethnicity: z.enum(["branco", "preto", "pardo", "indigena"]).default("pardo"),
	ageRange: z.enum(["jovem", "adulto", "idoso"]).default("adulto"),
	timeOnStreet: z.enum(["recente", "veterano"]).default("recente"),
	startingSkill: z
		.enum(["reciclagem", "artesao", "vendedor", "nenhuma"])
		.default("nenhuma"),
	avatarImage: z.string().optional(),
});

export const ItemSchema = z.object({
	id: z.string(),
	name: z.string(),
	weight: z.number().default(1),
	type: z.enum(["valioso", "sobrevivencia"]).default("sobrevivencia"),
});

export const PDUObjectiveSchema = z.enum([
	"TRABALHO",
	"FAMILIA",
	"SAUDE",
	"MORADIA",
]);

export const PDUStateSchema = z.object({
	isActive: z.boolean().default(false),
	objective: PDUObjectiveSchema.nullable().default(null),
	currentStageId: z.string().default(""),
	completedStages: z.array(z.string()).default([]),
	stressLevel: z.number().default(0),
});

export const WorkToolSchema = z.object({
	type: z.enum(["CARRINHO_RECICLAGEM", "SACO_PRETO"]).nullable().default(null),
	condition: z.number().default(100),
	capacity: z.number().default(0),
	riskFactor: z.number().default(0),
	isConfiscated: z.boolean().default(false),
});

export const DocumentsSchema = z.object({
	hasRG: z.boolean().default(false),
	hasCPF: z.boolean().default(true),
	hasCarteiraTrabalho: z.boolean().default(false),
	hasComprovanteResidencia: z.boolean().default(false),
	rgPhoto: z.string().optional(),
	cpfPhoto: z.string().optional(),
	carteiraTrabalhoPhoto: z.string().optional(),
});

export const SocialThermometerSchema = z.object({
	fome: z.number().default(0),
	higiene: z.number().default(0),
	violencia: z.number().default(0),
	saude: z.number().default(0),
});

export const GameEventSchema = z.object({
	id: z.string(),
	type: z.enum(["VIOLATION", "ACHIEVEMENT", "STATISTIC", "BARRIER"]),
	timestamp: z.number(),
	tags: z.array(z.string()).default([]),
	description: z.string(),
});

// --- Main Game State ---

export const GameStateSchema = z.object({
	health: z.number().default(100),
	hunger: z.number().default(100),
	hygiene: z.number().default(50),
	sanity: z.number().default(80),
	energy: z.number().default(100),
	dignity: z.number().default(50),
	socialStigma: z.number().default(10),
	stabilityGap: z.number().default(20),
	money: z.number().default(10),

	pdu: PDUStateSchema.default({
		isActive: false,
		objective: null, // explicit null
		currentStageId: "",
		completedStages: [],
		stressLevel: 0,
	}),

	workTool: WorkToolSchema.default({
		type: null, // explicit null
		condition: 100,
		capacity: 0,
		riskFactor: 0,
		isConfiscated: false,
	}),

	documents: DocumentsSchema.default({
		hasRG: false,
		hasCPF: true,
		hasCarteiraTrabalho: false,
		hasComprovanteResidencia: false,
	}),

	socialThermometer: SocialThermometerSchema.default({
		fome: 0,
		higiene: 0,
		violencia: 0,
		saude: 0,
	}),

	flags: z.record(z.string(), z.boolean()).default({}),
	activeBuffs: z.array(z.string()).default([]),
	isAtShelter: z.boolean().default(false),
	inventory: z.array(ItemSchema).default([]),

	day: z.number().default(1),
	time: z.number().default(8),

	resolvedDilemmas: z.array(z.string()).default([]),
	activeDilemmaId: z.string().nullable().default(null),

	criticalHealth: z.boolean().default(false),
	avatar: AvatarSchema.nullable().default(null),

	phoneBattery: z.number().default(100),
	userPosition: z.tuple([z.number(), z.number()]).nullable().default(null),
	isPaused: z.boolean().default(false),

	addiction: z.number().default(0),
	trust: z.number().default(50),
	employed_formal: z.boolean().default(false),
	citizenship: z.number().default(0),
	knowledge: z.number().default(0),
	score: z.number().default(0),
	security: z.number().default(0),

	history: z.array(GameEventSchema).default([]),
	activeArcId: z.string().nullable().default(null),
});

// For PouchDB
export const SavedGameStateSchema = GameStateSchema.extend({
	_id: z.string(),
	_rev: z.string().optional(),
	version: z.string(),
});
