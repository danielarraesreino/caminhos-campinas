
export interface SimAgent {
    id: string;
    demographics: {
        race: 'PRETA_PARDA' | 'BRANCA' | 'OUTRA'; // 67.8% Preta/Parda [Fonte: Censo 2024]
        gender: 'MASCULINO' | 'FEMININO'; // 81.1% Masculino
    };
    status: {
        sheltered: boolean; // Apenas 16.5% estão acolhidos [Fonte: Censo 2024]
        hungry: boolean;    // 38.5% risco de fome extrema [Fonte: Censo 2024]
        sanitationAccess: 'PUBLICO' | 'COMERCIO' | 'RUA'; // Baseado no Censo: 52% Público, 17% Rua [Fonte: Censo FEAC]
        menstrualDignity: boolean; // Para mulheres: 9.1% sem acesso [Fonte: Censo FEAC]
    };
    outcome: 'SUCESSO' | 'VIOLACAO_ODS_1' | 'VIOLACAO_ODS_2' | 'VIOLACAO_ODS_11' | 'VIOLACAO_ODS_6';
}

// Capacidade Real de Campinas (Hard Constraints)
const RESOURCES = {
    SHELTER_BEDS: 300, // SAMIM (~130) + Cáritas/Outros (~170)
    FREE_MEALS: 200,   // Refeitório da Cidadania (Jantar)
    CHEAP_MEALS: 2700, // Bom Prato (R$ 1,00) - Requer dinheiro
};

export function runCensusSimulation(): SimAgent[] {
    const TOTAL_POPULATION = 1557; // [Fonte: Censo 2024]
    const agents: SimAgent[] = [];

    let shelterSlots = RESOURCES.SHELTER_BEDS;
    let freeMealSlots = RESOURCES.FREE_MEALS;

    for (let i = 0; i < TOTAL_POPULATION; i++) {
        // 1. Gerar Demografia Real
        const isBlackOrBrown = Math.random() < 0.678;
        const isMale = Math.random() < 0.811;

        // 2. Simular Acesso a Abrigo (ODS 11.1)
        // O Censo diz que 16.5% já estão acolhidos. Vamos simular a disputa pelos restantes.
        let isSheltered = false;
        // Se o agente já faz parte dos 16.5% estatísticos
        if (Math.random() < 0.165) {
            isSheltered = true;
            shelterSlots--;
        } else if (shelterSlots > 0 && Math.random() < 0.1) {
            // 10% de chance de conseguir vaga extra se houver (muito raro)
            isSheltered = true;
            shelterSlots--;
        }

        // 3. Simular Fome (ODS 2.1)
        // 38.5% relataram fome extrema na última semana
        let isHungry = false;
        const hasMoney = Math.random() > 0.5; // Simulação: 50% tem R$ 1,00 pro Bom Prato

        if (!hasMoney && freeMealSlots > 0) {
            freeMealSlots--; // Conseguiu Refeitório Grátis
        } else if (!hasMoney) {
            isHungry = true; // Sem dinheiro e sem vaga no gratuito
        }

        // 4. Simular Saneamento (Jornada da Higiene)
        // Baseado no Censo: 52% Público, 17% Rua, ~30% Comercio/Favor
        // Se estigma for alto ou horario > 22h, bloqueia e empurra para rua.
        let sanitationAccess: SimAgent['status']['sanitationAccess'] = 'PUBLICO';
        const randSanitation = Math.random();

        if (randSanitation < 0.522) {
            sanitationAccess = 'PUBLICO';
        } else if (randSanitation < 0.522 + 0.167) {
            sanitationAccess = 'COMERCIO';
            // Simulação de Negação: Se não tiver "aparência adequada" (simulado aqui aleatoriamente como risco de 30%)
            // empurra para rua
            if (Math.random() < 0.3) {
                sanitationAccess = 'RUA';
            }
        } else {
            sanitationAccess = 'RUA';
        }

        // 5. Simular Dignidade Menstrual
        // Mulheres (~19% da pop)
        let menstrualDignity = true;
        if (!isMale) {
            // Censo: 9.1% das mulheres não usam absorventes (improvisam) e 10.9% não têm acesso a nada. Total ~20% vulnerabilidade total.
            // Vamos simplificar para o dado de 9.1% sem insumo adequado, mas considerar o risco maior.
            if (Math.random() < 0.091) {
                menstrualDignity = false;
            }
        }

        // 6. Determinar Resultado (Violência Institucional/Negação de Direitos)
        let outcome: SimAgent['outcome'] = 'SUCESSO';
        if (!isSheltered) outcome = 'VIOLACAO_ODS_11'; // Déficit Habitacional
        if (isHungry) outcome = 'VIOLACAO_ODS_2';      // Insegurança Alimentar
        if (sanitationAccess === 'RUA') outcome = 'VIOLACAO_ODS_6'; // Falta de Saneamento

        agents.push({
            id: `agent-${i}`,
            demographics: {
                race: isBlackOrBrown ? 'PRETA_PARDA' : isBlackOrBrown ? 'BRANCA' : 'OUTRA',
                gender: isMale ? 'MASCULINO' : 'FEMININO'
            },
            status: {
                sheltered: isSheltered,
                hungry: isHungry,
                sanitationAccess,
                menstrualDignity
            },
            outcome
        });
    }

    return agents;
}
