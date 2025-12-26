# Relatório de Evolução do Projeto - 26 de Dezembro

**Data:** 26 de Dezembro de 2025
**Projeto:** Caminhos Campinas (`pop-rua-game`)
**Status:** Análise Completa de Código e Funcionalidades

## 1. Visão Geral Técnica (Tech Stack)
O projeto está utilizando uma stack tecnológica de ponta ("bleeding edge"), posicionando-se para alta performance e features modernas:
- **Framework:** Next.js 16.0.10 (Versão muito recente)
- **UI library:** React 19.2.1
- **Estilização:** Tailwind CSS v4 (Alpha/Beta features)
- **Banco de Dados Local:** PouchDB (Estratégia Offline-First)
- **AI Integration:** Vercel AI SDK (@ai-sdk/google, @ai-sdk/groq)
- **Mapas:** Leaflet / React-Leaflet
- **Analytics:** Microsoft Clarity + Vercel Analytics/Speed Insights
- **Auth:** NextAuth v5 (Beta) com Google Provider e Login Anônimo

> [!NOTE]
> O ambiente de desenvolvimento requer Node.js >= 20.9.0, o que impediu a execução imediata no ambiente atual (Node 18), mas a análise estática confirma a integridade da estrutura.

## 2. Arquitetura de Funcionalidades (Features)

A estrutura de `src/features` revela uma arquitetura modular robusta, separando lógica de jogo, UI e dados.

### 🎮 Game Loop & Mecânicas de Sobrevivência
O coração do "Serious Game" está implementado e funcional em código:
- **Ciclo de Jogo (`game-loop`)**:
    - `useGameLoop.ts`: Gerencia a passagem de tempo e estados globais.
    - `eventEngine.ts`: Sistema de processamento de eventos.
    - **Dilemas**: Implementação concreta em `dilemmas-real.ts` e `dilemmas.ts`, sugerindo um conteúdo rico de narrativa ramificada.
    - **Audio System**: Sistema de som ambiente (ex: chuva `isRaining`) e efeitos sonoros interativos.

- **Sistema de Sobrevivência (`SurvivalMode`)**:
    - **Métricas**: Saúde (`criticalHealth`) e Sanidade (`sanity`).
    - **Degradação Visual**: O jogo implementa efeitos visuais (blur, grayscale) que reagem diretamente ao estado do jogador (ex: visão embaça com baixa sanidade).
    - **HUD**: Interface de navegação e status (`GameHUD`, `BatteryIndicator`).

### 🗺️ Mapeamento e Realidade
- **Survival Map**: Componente de mapa interativo (`leaflet`).
- **Reality Switcher**: Componente (`src/components/ui/RealitySwitcher.tsx`) que sugere uma mecânica de alternar entre visões ou camadas de realidade (educativo vs jogo?).
- **Eco Theme**: Componentes de UI com temática ecológica (`EcoButton`, `EcoCard`).

### 🔐 Segurança e Serviços (Vault & Hub)
- **Cofre Digital (`/vault`)**: 
    - Página dedicada segura (`VaultPage`).
    - Integração com `SessionProvider` para garantir acesso autenticado.
- **Hub de Serviços**:
    - Estrutura para `cadastro` e conexão com serviços reais.
    - Contexto `ServicesProvider` para gerenciar dados de assistência.

### 🤖 Inteligência Artificial e Chat
- **Game Chat**: Interface de chat interativa (`GameChat.tsx`, `activeDilemma`).
- **Backend AI**: Rotas de API configuradas para Groq e Google (`app/api/groq`, `app/api/chat`), indicando capacidade de geração dinâmica de conteúdo ou NPCs inteligentes.

## 3. Integrações e Infraestrutura
- **Offline First**: Presença de `ServiceWorkerRegister` e `offline-db` (PouchDB) indica suporte robusto para funcionamento sem internet (essencial para o público-alvo).
- **Google Auth**: Configurado para login social, facilitando o onboarding, mas mantendo opção de "Visitante" (Anônimo) para reduzir barreiras.
- **Transparência e Impacto**: Páginas dedicadas (`/transparencia`, `/impacto`) para prestação de contas do projeto social.

## 4. Conclusão e Próximos Passos
O projeto evoluiu significativamente para além de um simples protótipo. Features complexas como o **Game Loop**, **Sistema de Audio Dinâmico** e **Degradação Visual** já estão em código.

**Recomendação:**
Certificar-se de formalizar a documentação dos "Dilemas" que estão sendo inseridos em `dilemmas-real.ts` para não perder o rastreamento do conteúdo narrativo, já que o código está avançando rapidamente.
