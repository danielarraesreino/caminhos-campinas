/**
 * Story Arcs Expanded - Narrativas Temáticas Aprofundadas
 * 
 * Expande o sistema de arcos narrativos com novos temas baseados em:
 * - Censo Pop Rua 2024
 * - Pesquisa Nacional sobre População em Situação de Rua
 * - Análise de impacto narrativo e player agency
 */

import type { StoryArc } from "./story-arcs";

/**
 * Arc 4: Caminho da Dignidade
 * Foco em autoestima, reconexão social e superação do estigma
 */
export const ARC_DIGNIDADE: StoryArc = {
    id: "caminho_dignidade",
    name: "Caminho da Dignidade",
    description:
        "A luta contra o estigma social e a busca por reconhecimento como cidadão",
    theme:
        "estigma, dignidade, reconhecimento, autoestima, olhar do outro, invisibilidade social",
    dilemmaSequence: [
        "primeira_higiene_centro_pop", // Banho no Centro Pop (dignidade física)
        "olhar_de_nojo_restaurante", // Ser barrado em estabelecimento
        "escolha_aparencia_entrevista", // Dilema: roupa limpa vs. preservar mochila
        "apelido_vs_nome_civil", // Ser chamado por apelido ofensivo
        "compartilhar_historia_podcast", // Oportunidade de ser ouvido
        "primeiro_emprego_formal", // Contratação com carteira assinada
        "reconciliacao_antiga_amizade", // Reencontro com amigo do passado
        "palestra_escola_testemunho", // Compartilhar vivência para educar
    ],
    audioProfile: {
        ambience: "hope", // Sons de reconstrução, vozes amigas
        intensity: "MEDIUM",
        narrator: "Voz Interna (Empoderada)",
    },
    ods: ["ODS 1", "ODS 10", "ODS 16"],
};

/**
 * Arc 5: Economia Solidária
 * Trabalho cooperativo, economia informal, redes de catadores
 */
export const ARC_ECONOMIA_SOLIDARIA: StoryArc = {
    id: "economia_solidaria",
    name: "Economia Solidária",
    description:
        "Organização coletiva, trabalho informal e autonomia econômica através da cooperação",
    theme:
        "cooperativa, reciclagem, trabalho coletivo, autonomia, organização popular, solidariedade econômica",
    dilemmaSequence: [
        "primeira_coleta_papelao", // Iniciar como catador
        "roubo_carrinho_reciclagem", // Perda de ferramenta de trabalho
        "proposta_cooperativa_catadores", // Convite para se juntar à cooperativa
        "gestao_dinheiro_coletivo", // Dilema: caixa comum ou individual
        "negociacao_preco_atravessador", // Confronto com intermediário explorador
        "expansao_rota_conflito", // Território com outro catador
        "feira_economia_solidaria", // Vender produtos em feira comunitária
        "formacao_nova_cooperativa", // Fundar sua própria cooperativa
    ],
    audioProfile: {
        ambience: "urban_work", // Sons de carrinhos, papel, movimento
        intensity: "MEDIUM",
        narrator: "Companheiro de Trabalho (Voz Experiente)",
    },
    ods: ["ODS 8", "ODS 11", "ODS 12", "ODS 17"],
};

/**
 * Arc 6: Território e Raiz
 * Construção de comunidade, identidade territorial, resistência cultural
 */
export const ARC_TERRITORIO: StoryArc = {
    id: "territorio_raiz",
    name: "Território e Raiz",
    description:
        "A criação de vínculos com o espaço urbano e a construção de identidade coletiva",
    theme:
        "território, pertencimento, comunidade, resistência, identidade, ocupação, memória do lugar",
    dilemmaSequence: [
        "descobrir_praca_segura", // Encontrar local de descanso
        "ritual_matinal_praca", // Estabelecer rotina no território
        "conflito_comerciantes_vizinhos", // Tensão com moradores locais
        "defesa_morador_ameacado", // Proteger companheiro de agressão
        "organizacao_mutirao_limpeza", // Limpar espaço coletivo
        "ocupacao_predio_abandonado", // Entrar em movimento de moradia
        "festa_comunitaria_resistencia", // Celebração no território
        "articulacao_movimento_nacional", // Conectar-se ao MNPR
    ],
    audioProfile: {
        ambience: "community", // Vozes, música, vida comunitária
        intensity: "LOW",
        narrator: "Voz da Comunidade (Coral)",
    },
    ods: ["ODS 11", "ODS 16", "ODS 17"],
};

/**
 * Arc Progression Tracking System
 * Extends base StoryArc with player impact and thematic weight
 */
export interface ArcProgress {
    arcId: string;
    dilemmasCompleted: string[];
    thematicWeight: number; // 0-100: How much player engaged with this theme
    playerChoiceAlignment: "cooperative" | "individualist" | "neutral"; // Player tendency
    impactScore: number; // Narrative impact of choices (affects future arcs)
}

/**
 * Calculates thematic weight based on player choices
 * This influences which arcs get prioritized in DilemmaManager
 */
export function calculateThematicWeight(
    arc: StoryArc,
    completedDilemmas: string[],
    playerChoices: Record<string, string>,
): number {
    const arcDilemmas = arc.dilemmaSequence.filter((id) =>
        completedDilemmas.includes(id),
    );

    if (arcDilemmas.length === 0) return 0;

    // Base weight: percentage of arc completed
    const baseWeight =
        (arcDilemmas.length / arc.dilemmaSequence.length) * 100;

    // Bonus weight: if player made meaningful choices in this arc
    let meaningfulChoices = 0;
    for (const dilemmaId of arcDilemmas) {
        const choice = playerChoices[dilemmaId];
        // Choices that align with arc theme add weight
        if (choice && isThematicallyAligned(choice, arc)) {
            meaningfulChoices++;
        }
    }

    const bonusWeight = (meaningfulChoices / arcDilemmas.length) * 20;

    return Math.min(100, Math.round(baseWeight + bonusWeight));
}

/**
 * Checks if player choice aligns with arc theme
 */
function isThematicallyAligned(choiceId: string, arc: StoryArc): boolean {
    // Dignidade arc: choices that preserve dignity
    if (arc.id === "caminho_dignidade") {
        return (
            choiceId.includes("recusar_humilhacao") ||
            choiceId.includes("manter_nome") ||
            choiceId.includes("aceitar_ajuda_digna")
        );
    }

    // Economia Solidária arc: cooperative choices
    if (arc.id === "economia_solidaria") {
        return (
            choiceId.includes("cooperativa") ||
            choiceId.includes("dividir") ||
            choiceId.includes("caixa_comum")
        );
    }

    // Território arc: community-building choices
    if (arc.id === "territorio_raiz") {
        return (
            choiceId.includes("defender_territorio") ||
            choiceId.includes("participar_mutirao") ||
            choiceId.includes("festa_comunitaria")
        );
    }

    return false;
}

/**
 * Determines cross-arc dependencies
 * Example: Completing "Dignidade" unlocks advanced "Território" dilemmas
 */
export function checkCrossArcUnlock(
    playerProgress: Record<string, ArcProgress>,
): string[] {
    const unlockedDilemmas: string[] = [];

    const dignidadeWeight = playerProgress["caminho_dignidade"]?.thematicWeight || 0;
    const economiaWeight = playerProgress["economia_solidaria"]?.thematicWeight || 0;

    // Unlock advanced territory dilemmas if player has high dignity + economy
    if (dignidadeWeight >= 60 && economiaWeight >= 60) {
        unlockedDilemmas.push("articulacao_movimento_nacional");
    }

    // Unlock leadership dilemmas if player completed any arc
    const anyArcCompleted = Object.values(playerProgress).some(
        (progress) => progress.thematicWeight >= 80,
    );

    if (anyArcCompleted) {
        unlockedDilemmas.push("formacao_nova_cooperativa");
        unlockedDilemmas.push("palestra_escola_testemunho");
    }

    return unlockedDilemmas;
}

/**
 * Export all expanded arcs
 */
export const EXPANDED_ARCS: Record<string, StoryArc> = {
    CAMINHO_DIGNIDADE: ARC_DIGNIDADE,
    ECONOMIA_SOLIDARIA: ARC_ECONOMIA_SOLIDARIA,
    TERRITORIO_RAIZ: ARC_TERRITORIO,
};
