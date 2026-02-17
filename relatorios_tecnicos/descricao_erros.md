# Descrição dos Erros - Caminhos Campinas

Este documento formaliza as "alucinações" (bugs e comportamentos inesperados) reportados para análise.

## 1. Loop em Dilemas
**Sintoma:** Dilemas narrativos são disparados, mas em alguns casos entram em loop ou não são marcados como resolvidos corretamente, reaparecendo para o usuário.
**Possível Causa:** Desincronia entre o estado local (React State/Context) e o gerenciador de eventos (`useEventEngine`), ou falha na flag `isResolved`.
**Arquivos Relacionados:** `useEventEngine.ts`, `activeDilemmaId` no `GameContext`.

## 2. Autenticação Google OAuth (401 Invalid Client)
**Sintoma:** Erro de autenticação ao tentar login com Google, retornando `401: invalid_client`.
**Contexto:** Variáveis de ambiente (`AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`) podem estar mal configuradas ou as URIs de redirecionamento no console do Google Cloud não coincidem com a URL da aplicação em produção/dev.
**Arquivos Relacionados:** `src/auth.ts`, `.env`.

## 3. Acessibilidade em Mapas (Markers)
**Sintoma:** Marcadores do mapa (Leaflet) capturam foco do teclado/screen reader mas não possuem rótulos acessíveis (ARIA labels), violando diretrizes WCAG.
**Contexto:** Marcadores gerados dinamicamente via `LocationList` ou `SurvivalMap`.

## 4. Reset de Estado "Morto"
**Sintoma:** O jogo às vezes não reseta corretamente quando a saúde chega a 0, ou entra em um estado inconsistente onde o modal de "Game Over" conflita com outros modais.
**Arquivos Relacionados:** `src/app/jogar/page.tsx` (`useEffect` de verificação de game over).

## 5. Áudio e Performance (Flicker)
**Sintoma:** Troca de estados do jogo causa "flicker" na tela ou engasgos no áudio.
**Contexto:** Renderizações desnecessárias em `GamePage` ou inicialização pesada de contextos de áudio (`AudioDirector`).
