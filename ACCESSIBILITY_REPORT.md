# ♿ Relatório de Acessibilidade (WCAG AA)

**Data:** 05/02/2026
**Ferramenta:** axe-core (via Playwright)
**Status:** ✅ 100% Aprovado

## Resumo Executivo

Todas as 16 rotas principais da aplicação foram testadas quanto à conformidade com as diretrizes WCAG 2.1 nível AA. Nenhum erro de acessibilidade foi encontrado nas páginas testadas.

## Rotas Auditadas

| Rota | Descrição | Status |
|------|-----------|--------|
| `/` | Landing Page | ✅ Passou |
| `/jogar` | Game Page (HUD/Map) | ✅ Passou |
| `/impacto` | Dashboard de Impacto | ✅ Passou |
| `/jornal` | Feed de Notícias | ✅ Passou |
| `/transparencia` | Portal da Transparência | ✅ Passou |
| `/auditoria` | Landing Auditoria | ✅ Passou |
| `/auditoria/validar` | Ferramenta de Validação | ✅ Passou |
| `/sobre` | Sobre o Projeto | ✅ Passou |
| `/sobre/demo-mode` | Documentação Demo Mode | ✅ Passou |
| `/curso` | Curso Agilizadores | ✅ Passou |
| `/apoie` | Página de Doação | ✅ Passou |
| `/login` | Autenticação | ✅ Passou |
| `/parceiros` | Área de Parceiros | ✅ Passou |
| `/parcerias` | Rota Alternativa Parceiros | ✅ Passou |
| `/sugerir` | Sugestão de Dilemas | ✅ Passou |
| `/recursos` | Guia de Recursos | ✅ Passou |

## Metodologia de Teste

Utilizamos a biblioteca `@axe-core/playwright` integrada aos testes E2E para verificar violações comuns, incluindo:

- [x] Contraste de cores (texto/fundo)
- [x] Texto alternativo em imagens (alt tags)
- [x] Rótulos de formulários (labels)
- [x] Estrutura de cabeçalhos (h1-h6)
- [x] Pontos de referência ARIA (landmarks)
- [x] Acessibilidade de teclado (tabindex)

## Próximos Passos

1. **Monitoramento Contínuo**: O teste `accessibility.spec.ts` deve ser executado antes de cada deploy.
2. **Novas Funcionalidades**: Qualquer nova página deve ser adicionada à lista de rotas no teste.
3. **Testes Manuais**: Recomenda-se testes manuais periódicos com leitores de tela (NVDA/TalkBack) para validar a experiência de uso além das regras automatizadas.

---
**Responsável:** Agente de Auditoria (Antigravity)
