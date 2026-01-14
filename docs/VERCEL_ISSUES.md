# Caminhos Campinas - Configuração Vercel (Issues de Produção)

## 🚨 Issue #1: Auth 500 Error (CRÍTICO)

### Problema
```
GET /api/auth/session → 500 Internal Server Error
```

### Causa Raiz
NextAuth.js requer variáveis de ambiente que não estão configuradas no dashboard da Vercel.

### ✅ Solução

1. **Gerar NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

2. **Adicionar no Vercel Dashboard:**

Acesse: https://vercel.com/daniels-projects-e430fdfe/caminhos-campinas/settings/environment-variables

**Variáveis obrigatórias:**
```
NEXTAUTH_SECRET=<output do comando acima>
NEXTAUTH_URL=https://caminhos-campinas.vercel.app
```

3. **Redeploy:**
```bash
vercel --prod
```

---

## ⚠️ Issue #2: IndexedDB AbortError (MÉDIO)

### Problema
```
AbortError: Version change transaction was aborted in an upgradeneeded event handler
```

### Causa
PouchDB está tentando migrar schema do IndexedDB mas a transação é abortada.

### Possíveis Causas
1. Múltiplas tabs abertas competindo pelo DB
2. Versão antiga do schema cache no browser
3. Quota excedida

### ✅ Solução Temporária (Dev)
```javascript
// Clear IndexedDB no DevTools:
// Application → Storage → IndexedDB → Delete Database
```

### ✅ Solução Permanente
Adicionar error boundary no `db.ts`:

```typescript
// src/features/offline-db/db.ts
db.createIndex({
  index: { fields: ['timestamp'] }
}).catch(err => {
  if (err.name === 'AbortError') {
    console.warn('[DB] Migration aborted, retrying...');
    // Retry logic aqui
  }
});
```

---

## ⚠️ Issue #3: Modal "Fim de Jogo" ao Iniciar

### Problema
Modal de Game Over aparece imediatamente ao iniciar nova partida.

### Investigação Necessária
Verificar lógica de win/loss conditions em `useGameLoop.ts`:

```typescript
// Possível causa: health/sanity iniciando zerados
if (health <= 0 || sanity <= 0) {
  triggerGameOver(); // ❌ Não deveria acontecer no início
}
```

### Próximos Passos
1. Verificar `initialGameState` em GameContext
2. Confirmar que `resetGame()` restaura valores corretos
3. Adicionar guard: "não mostrar game over nos primeiros 30s"

---

## 📋 Checklist de Deploy

- [ ] Configurar `NEXTAUTH_SECRET` na Vercel
- [ ] Configurar `NEXTAUTH_URL` na Vercel  
- [ ] Redeploy (`vercel --prod`)
- [ ] Testar `/api/auth/session` (deve retornar 200)
- [ ] Limpar IndexedDB local
- [ ] Investigar lógica de Game Over

---

## 🔗 Links Úteis

- [Vercel ENV Vars](https://vercel.com/daniels-projects-e430fdfe/caminhos-campinas/settings/environment-variables)
- [NextAuth Docs](https://next-auth.js.org/configuration/options#nextauth_secret)
- [PouchDB Error Handling](https://pouchdb.com/guides/errors.html)
