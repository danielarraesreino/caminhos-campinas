# Relatório de Auditoria: Deep Dive (Estado Real)

**Data:** 04/01/2026
**Alvo:** Código Fonte (`src/`) vs Documentação Antiga (`TUDAO.md`)

---

## 1. O Cérebro Narrativo (Cadeias Confirmadas)
**Status:** ✅ ATIVO E EM PRODUÇÃO.
O sistema de "Arcos" não é apenas teórico. Encontrei implementação explícita de encadeamento no JSON mestre.

**Prova de Vida (`src/data/dilemmas-campinas.json`):**
O dilema `chain_bagageiro_01_start` possui a propriedade hardcoded `nextDilemmaId: "chain_bagageiro_02_checkin"`.
Isso prova que a lógica de "História Continuada" (Arcos) já está populada nos dados, superando a documentação que listava apenas eventos aleatórios.

**Trecho Extraído:**
```json
{
    "id": "chain_bagageiro_01_start",
    "title": "A Corrida Contra o Relógio",
    "trigger": { "type": "TIME_SPECIFIC", "value": 16.5 },
    "options": [
        {
            "label": "Correr para o Bagageiro",
            "nextDilemmaId": "chain_bagageiro_02_checkin" // <--- O ELO DA CORRENTE
        }
    ]
}
```

---

## 2. A "Cara" do Projeto (Unified Dashboard)
**Status:** ✅ MODERNIZADO ("Realismo Sóbrio").
A Landing Page (`src/app/page.tsx`) não renderiza mais textos genéricos. Ela carrega o componente `UnifiedDashboard`.

**Textos Reais em Produção:**
- **Título:** "Caminhos CPS | 019 - Tecnologia Social & Sobrevivência"
- **Versão:** "0.19.0 (Beta)"
- **Cards Ativos:**
    1.  **Simulador:** "Enfrente dilemas reais, sobreviva à burocracia..."
    2.  **Jornal da Rua:** "Notícias, denúncias... tradução de leis."
    3.  **Formação:** "Área educativa para Redutores de Danos."
    4.  **Rede de Apoio:** "Mapa de ONGs, cadastro de parceiros."

*A estética é "Dark Mode" (slate-950) com acentos funcionais (Blue/Purple/Emerald/Pink), alinhada à sua visão de seriedade.*

---

## 3. O Mapa de Rotas (Ocultas & Órfãs)
**Status:** ⚠️ COMPLEXIDADE OCULTA.
O sistema possui muito mais rotas do que o Menu Principal revela.

**Rotas Visíveis (Navbar):**
- `/jogar`, `/impacto`, `/transparencia`, `/jornal`, `/parceiros`, `/recursos`, `/apoie`

**Rotas "Submersas" (Existem no código, mas invisíveis no menu):**
- `/cofre` & `/vault` -> Provável área administrativa ou *easter egg*.
- `/hub` -> Interface da "Rede de Apoio" (Card existe, mas não está no Menu Topo).
- `/curso` & `/educacao` -> Área de Formação (Card existe).
- `/sugerir` -> Feedback?
- `/test-features` -> Área de Debug (Desenvolvedor).

---

## 4. O Motor Lógico (Game Loop)
**Status:** ✅ HÍBRIDO E FUNCIONAL.
O arquivo `useGameLoop.ts` é o coração pulsante. Ele não apenas sorteia dilemas, mas gerencia:
- **Decaimento Metabólico:** Saúde/Fome/Sanidade decaem a cada 10s (tempo real) ou trigger.
- **Checagem Sistêmica:** Verifica triggers de *Tempo*, *Localização* e *Arcos* (checagem de PDU Victory).
- **Intervenção Climática:** Chuva x Abrigo afeta sanidade.

**Conclusão da Auditoria:**
O projeto está tecnicamente muito à frente da documentação `TUDAO.md`. Você tem um sistema complexo de RPG de Sobrevivência, com narrativas ramificadas e múltiplas interfaces de apoio social já implementadas, mascaradas sob uma interface "Beta".
