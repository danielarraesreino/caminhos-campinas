---
description: Modo noturno - auditoria, correção e testes autônomos sem intervenção humana
---
// turbo-all

# Workflow: Modo Noturno Autônomo

Este workflow executa auditoria, correção e testes exaustivos sem intervenção humana.

## Fase 1: Auditoria e Correção de Código

1. Verificar tipagem TypeScript:
```bash
npm run build 2>&1 | tee /tmp/build-output.txt
```

2. Se houver erros de build, analisar `/tmp/build-output.txt` e corrigir automaticamente.

3. Rodar linting:
```bash
npm run lint 2>&1 | tee /tmp/lint-output.txt
```

4. Corrigir erros de lint automaticamente:
```bash
npm run format
```

## Fase 2: Testes Unitários

5. Rodar testes unitários:
```bash
npm run test:unit 2>&1 | tee /tmp/test-output.txt || true
```

6. Se não existirem testes, criar testes básicos para:
   - `src/data/RealityAtlas.ts` (multiplicadores de risco)
   - `src/features/game-loop/` (lógica de dilemas)

## Fase 3: Testes E2E com Browser

7. Iniciar servidor de desenvolvimento:
```bash
npm run dev &
```

8. Aguardar servidor iniciar (5 segundos)

9. Usar Browser Tool para testar:
   - Navegar para http://localhost:3000/jogar
   - Completar fluxo de criação de avatar
   - Testar interações com dilemas
   - Verificar drawer de locais
   - Capturar screenshots de cada etapa

10. Matar servidor de desenvolvimento ao final

## Fase 4: Relatório

11. Gerar artefato `autonomous-report.md` com:
    - Erros encontrados e corrigidos
    - Cobertura de testes
    - Screenshots de validação visual
    - Status final do build

## Notas de Configuração

- **Terminal Policy**: Turbo (auto-approve all commands)
- **Review Policy**: Always Proceed
- **Model Fallback**: Se cota esgotar em Gemini 3 Pro, usar Gemini 3 Flash
