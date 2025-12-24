ARTEFATO 1: STATUS DO PROJETO "CAMINHOS CAMPINAS"
Copie o conteúdo abaixo para um arquivo chamado PROJECT_STATUS.md. Ele serve como seu mapa de navegação atualizado.
# 🏙️ CAMINHOS CAMPINAS - Status do Projeto & Roadmap

**Versão:** 1.4 (Pós-Auditoria de Telas e Arquivos)
**Data:** 23/12/2025

## 1. O Que Está Validado (Executado ✅)
Baseado na análise do código fonte (`src/`), capturas de tela e arquivos MD (`Architecture_Map.md`, `Tech_Stack.md`).

### 🏗️ Infraestrutura & Core
- [x] **Setup Next.js 15 + TypeScript:** Estrutura de pastas correta (`app/`, `features/`, `components/`).
- [x] **Sistema de Mapas:** `SurvivalMap` implementado com Leaflet, exibindo serviços (Bom Prato, SAMIM) com ícones.
- [x] **Persistência Offline:** `PouchDB` configurado para salvar estado localmente (crucial para o público-alvo).
- [x] **Design System:** Componentes UI (`EcoCard`, `EcoButton`, `GameHUD`) com estética "Dark Mode/OLED Saver" implementados.
- [x] **Motor de IA:** Integração com Groq/Llama 3.3 configurada em `api/chat/route.ts` e `GameChat.tsx`.

### 🎮 Gameplay & Mecânicas
- [x] **Criação de Avatar:** Fluxo completo (`AvatarCreation.tsx`) com seleção de Gênero, Etnia e Tempo de Rua (fator de estigma).
- [x] **HUD (Interface):** Mostradores funcionais de Saúde, Fome, Higiene e Dinheiro.
- [x] **Sistema de Inventário:** Lógica de `addToInventory` e peso implementada no Contexto.
- [x] **Feedback Visual:** Efeitos de blur/grayscale quando a sanidade/saúde cai (`SurvivalModeContext`).

### 📱 Conteúdo & Telas
- [x] **Landing Page:** Manifesto "A Rua Tem Voz" e CTAs claros.
- [x] **Hub de Recursos:** Tela de cursos e capacitação (`recursos/page.tsx`).
- [x] **Dashboard de Impacto:** Visualização de dados ODS (embora precise de dados reais).
- [x] **Game Over:** Tela de morte com estatísticas e motivo (Hipotermia, Fome).

---

## 2. O Que Falta (Lacunas & Próximos Passos 🚧)
Baseado nas novas diretrizes de "Dilemas Determinísticos" e "Campanha de Realidade".

### 🧩 Lógica de Jogo (Crítico)
- [ ] **Motor de Dilemas Híbrido:** O código atual (`GameChat`) manda tudo para a IA. *Necessário interceptar palavras-chave (ex: "fome") para disparar os Dilemas Determinísticos (JSON) antes de chamar a IA.*
- [ ] **Consequência de Longo Prazo:** Falta a lógica onde escolhas atuais bloqueiam caminhos futuros (ex: "Perdeu RG hoje" -> "Impossível entrar no abrigo amanhã").
- [ ] **Áudio Imersivo:** A estrutura de arquivos cita `useAudio`, mas não vi a implementação dos sons de ambiente (chuva, trânsito) nas telas.

### 📢 Conteúdo & Campanha
- [ ] **Banco de Dilemas:** O arquivo `dilemmas.ts` tem poucos exemplos. Precisamos popular com as centenas de situações reais (ver seção abaixo).
- [ ] **Mecânica "Sugerir Dilema":** Implementar um botão no menu onde o usuário (população de rua) possa enviar um áudio/texto relatando um dilema real vivido, alimentando o banco de dados.

### 🛠️ Correções Técnicas
- [ ] **Erro "i is not a function":** Relatado no chat, provável erro de versão na biblioteca `ai` ou `groq-sdk`.
- [ ] **Z-Index do Modal:** O Modal de Dilema às vezes fica atrás do Mapa em mobile.

--------------------------------------------------------------------------------

