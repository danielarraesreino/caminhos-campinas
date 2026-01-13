# Z-Index Migration Guide

## ✅ Concluído

### 1. Governança de Z-Index (`globals.css`)
Criadas variáveis CSS semânticas:
```css
--z-base: 0;
--z-map: 10;
--z-hud: 20;
--z-navbar: 30;
--z-toast: 50;
--z-modal-queue: 100;
--z-chat-overlay: 150;
--z-glossary: 200;
--z-critical-alerts: 250;
--z-game-over: 300;
--z-debug-tools: 9999;
```

### 2. ModalQueueContext (`src/contexts/ModalQueueContext.tsx`)
- ✅ Fila de prioridade para dilemas
- ✅ Throttle de 2 segundos entre modais
- ✅ Bloqueio automático durante `tutorialActive`
- ✅ Controle de áudio (`audioPlaying`)
- ✅ Auto-processamento quando condições permitem

### 3. Service Worker Audio-First (`public/sw.js`)
- ✅ Cache-First para `.mp3`, `.wav`, `.ogg`, `.m4a`, `.aac`
- ✅ Stale-While-Revalidate para outros recursos
- ✅ Dual cache: `CACHE_NAME` (recursos) + `AUDIO_CACHE` (áudio)
- ✅ Logs de debug para rastrear cache hits

---

## 🔧 Próximos Passos: Aplicação das Variáveis

### Componentes a Migrar (z-index hardcoded)

**Priority 1 (Modal Queue System):**
1. `DilemmaModal.tsx` - z-[100] → `z-[var(--z-modal-queue)]`
2. `OnboardingTutorial.tsx` - (verificar se usa z-index)
3. `GameOverModal.tsx` - z-[9999] → `z-[var(--z-game-over)]`

**Priority 2 (Chat & Overlays):**
4. `GameChat` (em page.tsx) - z-[150] → `z-[var(--z-chat-overlay)]`
5. `InteractiveText.tsx` - z-[200] → `z-[var(--z-glossary)]`

**Priority 3 (Map & HUD):**
6. `SurvivalMap.tsx` - múltiplos z-index → consolidar em camadas semânticas
7. `Navbar.tsx` - z-[100] → `z-[var(--z-navbar)]`
8. `RealitySwitcher.tsx` - z-[9999] → `z-[var(--z-debug-tools)]`

---

## 📝 Como Aplicar (Exemplo)

**Antes:**
```tsx
<div className="fixed inset-0 z-[100] bg-black/50">
```

**Depois:**
```tsx
<div className="fixed inset-0 z-[var(--z-modal-queue)] bg-black/50">
```

---

## 🧪 Testes Recomendados

1. **Modal Queue:**
   - Abrir tutorial → disparar dilema → verificar que dilema fica na fila
   - Fechar tutorial → verificar que dilema processa automaticamente após 2s

2. **Z-Index:**
   - Abrir DilemmaModal → abrir Chat → verificar que Chat sobrepõe
   - Abrir Glossário (InteractiveText) → verificar que sobrepõe tudo exceto debug

3. **Audio Cache:**
   - Offline: verificar que áudios carregam do cache
   - Inspecionar DevTools → Application → Cache Storage → `caminhos-audio-v1`

---

## ⚠️ Breaking Changes

**Nenhum.** As mudanças são progressivas e compatíveis com o código existente.

---

*Última atualização: 2026-01-13 01:05 UTC-3*
