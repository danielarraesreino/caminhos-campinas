# Relatório de Auditoria Técnica - Caminhos de Campinas

**Data:** 04/01/2026
**Status:** Build Estável (Verde)
**Contexto:** Auditoria de 30 dias de desenvolvimento (100+ commits) para consolidação em NotebookLM.

---

## 1. O Motor Híbrido (Realidade vs. IA)

**Diagnóstico:** EXISTENTE e OPERACIONAL.
A lógica "Híbrida" (que decide entre rodar localmente ou chamar a IA) reside no cliente, especificamente no componente de Chat. Isso garante que interações críticas (dilemas roteirizados) funcionem mesmo sem internet ou sem créditos na API, interceptando palavras-chave antes de chegar à Groq.

**Arquivo Fonte:** `src/features/ui/GameChat.tsx` (Linhas 88-124)

### Lógica de Decisão (Snippet Extraído):
```typescript
// O "Motor Híbrido" intercepta o input do usuário antes de enviar para a IA
if (text) {
    // 1. Tenta encontrar um dilema local que corresponda ao texto + localização
    const matchedDilemma = DilemmaMatcher.findBestDilemma(
        text,
        userLocation,
        GAME_DILEMMAS, // Banco de dados local de dilemas JSON
        [], 
    );

    // 2. Se encontrar (Match), INTERCEPTA e roda offline
    if (matchedDilemma) {
        console.log(`[HybridEngine] Interceptado: ${matchedDilemma.id}`);

        // Simula resposta do sistema sem gastar token
        const sysMsg = {
            role: "assistant",
            content: `⚠️ **Evento Identificado**: ${matchedDilemma.title}\n\n(Abrindo interface de decisão...)`,
        };
        setMessages((prev) => [...prev, userMsg, sysMsg]);
        
        // Dispara o Dilema/UI Nativa
        onDilemmaTriggered(matchedDilemma.id); 
        return; // <--- IMPEDE a chamada à API (Groq)
    }
}

// 3. Se não encontrar nada local, segue para a IA (Fallback / Conversa Livre)
await append({ ... }); // Chama /api/chat
```

---

## 2. Estrutura Real dos Dados (Schema de Save)

**Diagnóstico:** SÓLIDO.
O projeto utiliza uma estrutura tipada via TypeScript (`GameState`). O banco de dados (PouchDB) armazena exatamente este objeto JSON. A retrocompatibilidade é gerida por um campo `version` (atualmente "1.1").

**Arquivo Fonte:** `src/contexts/GameContext.tsx`
**Tecnologia:** PouchDB (Adapter: IndexedDB no navegador)

### Exemplo de Documento "Save Game" (JSON Real):
Este é o formato exato que está sendo salvo no navegador do usuário hoje.

```json
{
  "_id": "game_state_v1",
  "version": "1.1",
  "day": 1,
  "time": 8,
  "health": 100,
  "hunger": 100,
  "sanity": 80,
  "energy": 100,
  "money": 10,
  "dignity": 50,
  "socialStigma": 10,
  "isAtShelter": false,
  "isPaused": false,
  "avatar": {
    "name": "Maria",
    "gender": "feminino",
    "ethnicity": "pardo",
    "ageRange": "adulto",
    "timeOnStreet": "recente",
    "startingSkill": "reciclagem"
  },
  "pdu": {
    "isActive": false,
    "objective": null,
    "currentStageId": "",
    "completedStages": [],
    "stressLevel": 0
  },
  "workTool": {
    "type": "CARRINHO_RECICLAGEM",
    "condition": 85,
    "capacity": 50,
    "isConfiscated": false
  },
  "documents": {
    "hasRG": false,
    "hasCPF": true,
    "hasComprovanteResidencia": false
  },
  "inventory": [
    { "id": "cobertor", "name": "Cobertor de Doação", "weight": 2, "type": "sobrevivencia" },
    { "id": "garrafa_agua", "name": "Garrafa Pet", "weight": 0.5, "type": "sobrevivencia" }
  ],
  "resolvedDilemmas": ["intro_acordar_praca", "tutorial_primeiros_passos"],
  "activeBuffs": ["BEM_ALIMENTADO"],
  "history": []
}
```

---

## 3. Conteúdo Narrativo Atual

**Diagnóstico:** POVOADO (Média Densidade).
Ao contrário do receio inicial, o projeto **NÃO** está vazio. O arquivo principal contém centenas de linhas de conteúdo estruturado, cobrindo múltiplos ODS e cenários.

**Fontes:**
1. `src/data/dilemmas-campinas.json` (Principal, ~1373 linhas indicadas, ~30+ dilemas complexos)
2. `src/features/game-loop/dilemmas-real.ts` (~15 dilemas adicionais em TS)

### Amostra de Títulos Reais Implementados:
- *A Geografia do Medo* (Violência Institucional/GM)
- *A Tosse Que Não Passa* (Tuberculose/Saúde)
- *Dilema do Ciclo* (Pobreza Menstrual)
- *O Fiel Companheiro* (Abrigos que não aceitam Pets)
- *A Tempestade de Verão* (Clima vs. Bens materiais)
- *O Muro Invisível* (Aporofobia em bairros nobres)
- *A Burocracia da Fome* (CadÚnico desatualizado)
- *Solidariedade de Rua* (Pagar fiança de amigo vs. Botas novas)

**Veredito:** O conteúdo narrativo acompanhou o desenvolvimento técnico. Há "substância" sociológica real implementada.

---

## 4. Auditoria de Segurança de API

**Diagnóstico:** PROTEÇÃO BÁSICA ATIVA.
As rotas de API não estão expostas de forma irresponsável. Existe uma camada de validação e Rate Limiting implementada no servidor (Next.js API Route).

**Arquivo Fonte:** `src/app/api/groq/route.ts`

### Mecanismos de Defesa Identificados:
1.  **Server-Side Only Key:** A chave `GROQ_API_KEY` é lida apenas no servidor (não tem `NEXT_PUBLIC`), impedindo vazamento no frontend.
2.  **Rate Limiting (Memória):** Existe um mapa `requestCounts` que limita IPs a **10 requisições por minuto**.
    *   *Nota:* Como é em memória, reinicia se o servidor reiniciar (Serverless function boot), mas previne spam massivo de um único usuário em curto prazo.
3.  **Validação de Input:**
    *   Verifica se `prompt` é string.
    *   **Limite de Caracteres:** Corta prompts maiores que **2000 caracteres**, prevenindo injeção de contextos gigantes que drenariam tokens/custos.

```typescript
// Snippet de src/app/api/groq/route.ts
if (prompt.length > 2000) {
    return NextResponse.json(
        { success: false, error: "Prompt muito longo (máx 2000 caracteres)" },
        { status: 400 },
    );
}
```
