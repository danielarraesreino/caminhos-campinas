# Estrutura de Dados do Jogo (Caminhos Campinas)

Abaixo estão as definições de tipo e exemplos de dados reais que alimentam o motor do jogo.

## 1. Definição de Tipos (`src/features/game-loop/dilemma-types.ts`)

Define a estrutura de um "Dilema" e suas opções.

```typescript
export interface Dilemma {
	id: string; // Identificador único (ex: "intro_acordar_praca")
	title: string; // Título exibido no modal
	description: string; // Texto narrativo do cenário
	options: DilemmaOption[]; // Lista de escolhas (buttons)
	
	// Metadados
	wiki_context?: string; // ID do Wikidata (ex: "Q137764129")
	ods?: string[]; // Objetivos de Desenvolvimento Sustentável (ex: "ODS 1")
	tags?: string[]; // Tags para categorização
	
	// Condições de Disparo
	trigger: {
		type: "STATUS" | "LOCATION" | "RANDOM" | "CHAIN" | ...;
		value: number | string;
		locationId?: string; // Se type == LOCATION
		statusCondition?: Record<string, number>; // Se type == STATUS
	};
	
	// Aspectos de Gameplay
	aspect?: "FOOD" | "SECURITY" | "HEALTH" | ...;
	intensity?: "LOW" | "MEDIUM" | "HIGH";
	
	// Condições para aparecer
	conditions?: {
		gender?: "masculino" | "feminino" | "trans" ...;
		minHealth?: number;
		requiredItem?: string;
	};
}

export interface DilemmaOption {
	label: string; // Texto do botão
	consequence: string; // Texto de feedback imediato
	
	// Efeitos no Estado do Jogo (Sucesso)
	effect: {
		health?: number;
		sanity?: number;
		money?: number;
		dignity?: number;
		energy?: number;
		inventoryAdd?: string;
		inventoryRemove?: string | string[];
		addBuff?: string;
		timeAdvance?: number;
		// ... outros stats
	};
	
	// Sistema de Risco/Sorte
	risk?: number; // 0-100 (Chance de falha)
	consequence_failure?: string; // Texto se falhar
	effect_failure?: Partial<GameState>; // Efeitos se falhar
	
	// Encadeamento & Ações
	nextDilemmaId?: string; // ID do próximo dilema (imediato)
	action?: "SET_FLAG";
	flag?: string;
}
```

## 2. Arcos Narrativos (`src/data/story-arcs.ts`)

Os dilemas são agrupados em "Arcos" temáticos para dar coerência à narrativa.

```typescript
export const STORY_ARCS: Record<string, StoryArc> = {
	CRISE_FAMILIAR: {
		id: "crise_familiar",
		name: "Crise Familiar",
		description: "O rompimento de vínculos como causa raiz...",
		dilemmaSequence: [
			"saude_mental_vinculo", 
			"pdu_intro_familia", 
			"egresso_prisao_inicio", 
			"abrigo_separacao_familia",
			"fianca_amigo_preso", 
		],
		audioProfile: {
			ambience: "despair",
			intensity: "HIGH",
			narrator: "Voz Interna (Reflexiva)",
		},
	},
    // ... outros arcos (O_CORRE, BARREIRA_DO_RG, etc.)
};
```

## 3. Exemplo de Dados Reais (`src/data/dilemmas-campinas.json`)

Exemplo de um dilema real do arquivo JSON:

```json
{
    "id": "enquadro_gcm_centro",
    "title": "A Geografia do Medo",
    "legal_reference": {
        "law": "Decreto 7.053/2009",
        "article": "Art. 7º, II e VIII",
        "summary": "Política Nacional garante respeito à dignidade..."
    },
    "description": "Você parou para descansar no Centro. Uma viatura da GM se aproxima...",
    "trigger": {
        "type": "LOCATION_IDLE",
        "value": 2
    },
    "aspect": "SECURITY",
    "intensity": "HIGH",
    "options": [
        {
            "label": "Sair andando (Risco de Abordagem)",
            "consequence": "Você sai rápido. Eles te seguem com o olhar...",
            "risk": 15,
            "effect": {
                "dignity": -10,
                "sanity": -5,
                "energy": -10
            },
            "effect_failure": {
                "dignity": -20,
                "health": -10,
                "addBuff": "ESTIGMA"
            },
            "consequence_failure": "Enquadro Geral. Mãos na parede, revista humilhante..."
        },
        {
            "label": "Ficar parado (Enfreitar)",
            "consequence": "Eles descem. 'Tá fazendo o que aí, cidadão?'.",
            "risk": 60,
            "effect": {
                "dignity": -20,
                "sanity": -20
            },
            "effect_failure": {
                "health": -30,
                "inventoryRemove": ["cobertor"],
                "sanity": -25
            },
            "consequence_failure": "Violência Gratuita. Eles chutam suas coisas..."
        }
    ],
    "ods": ["ODS 16", "ODS 10"]
}
```
