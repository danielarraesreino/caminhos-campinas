ARTEFATO 2: A FÁBRICA DE DILEMAS (PROMPT & EXEMPLOS)
Use este prompt para gerar conteúdo massivo e realista. A ideia é que você possa entrevistar pessoas ou pegar notícias e converter em código de jogo instantaneamente.
🤖 Prompt para Gerar Dilemas (Copie e cole na sua IA)
ATUE COMO: Game Designer Social e Sociólogo Brasileiro.
TAREFA: Converter relatos reais e dados estatísticos em "Dilemas de Jogo" (formato JSON) para o projeto "Caminhos Campinas".

CONTEXTO:
O jogo simula a vida em situação de rua. O objetivo não é vencer, é sobreviver.
Os dilemas devem ser cruéis, burocráticos e baseados nos ODS (Objetivos de Desenvolvimento Sustentável) e na realidade brasileira (Relatório Luz/IPEA).

ESTRUTURA DO JSON:
{
  "id": "slug-do-dilema",
  "title": "Título Curto",
  "description": "Texto imersivo em 2ª pessoa descrevendo a situação. Use linguagem da rua, mas respeitosa.",
  "source_fact": "A fonte real (ex: 'Relatório Luz 2024: Aumento de 50% na violência policial')",
  "trigger": { "type": "LOCATION" | "STATUS" | "RANDOM", "value": "ex: Centro" },
  "options": [
    {
      "label": "Ação A (Curto Prazo/Arriscada)",
      "consequence": "O que acontece imediatamente.",
      "effect": { "health": -10, "money": +5, "dignity": -20, "socialStigma": +10 }
    },
    {
      "label": "Ação B (Longo Prazo/Digna)",
      "consequence": "O resultado da escolha ética ou burocrática.",
      "effect": { "health": -5, "sanity": -10, "dignity": +10 }
    }
  ]
}

AGORA, GERE 5 DILEMAS BASEADOS NOS SEGUINTES TEMAS REAIS:
1. Aporofobia (Medo/Aversão a pobre) em áreas nobres.
2. Menstruação na rua (Pobreza Menstrual - ODS 3/5).
3. Violência Policial / Guarda Municipal (Confisco de bens).
4. O Dilema do Cachorro (Abrigos não aceitam animais).
5. Chuva e Doença (A escolha entre se molhar para proteger o papelão ou correr para marquise lotada).

