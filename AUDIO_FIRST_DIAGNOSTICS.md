# 📡 Diagnóstico Técnico: Audio-First Survival Radio

## 🔴 PROBLEMAS IDENTIFICADOS

### 1. "Metralhadora Caótica" - Ausência de Queue Manager

**Root Cause:** [`useEventEngine.ts`](file:///home/dan/Área de Trabalho/caminhos-campinas/src/hooks/useEventEngine.ts) não possui controle de taxa (throttle/debounce) ❌

**Evidência:**
- Line 50-55: `triggerDilemma()` é síncrono e imediato
- Line 76-98: `findTriggeredDilemma()` executa em CADA tick do game loop
- **Nenhum** sistema de fila para eventos pendentes

**Consequência:** Múltiplos dilemas podem tentar disparar simultaneamente, causando sobreposições visuais.

---

### 2. Z-Index Hierarchy (Caos Visual)

**Hierarquia Atual:**

| Layer | Z-Index | Componente | Arquivo |
|-------|---------|-----------|--------|
| **9** | `z-[9999]` | GameOverModal, RealitySwitcher | GameOverModal.tsx:51, RealitySwitcher.tsx:33 |
| **8** | `z-[2500]` | SurvivalMap (popup interno) | SurvivalMap.tsx:185 |
| **7** | `z-[2000]` | SurvivalMap (overlay) | SurvivalMap.tsx:217 |
| **6** | `z-[1500]` | SurvivalMap (banner) | SurvivalMap.tsx:238 |
| **5** | `z-[1000]` | SurvivalMap (controles) | SurvivalMap.tsx:245,255,264 |
| **4** | `z-[200]` | InteractiveText (Glossário) | InteractiveText.tsx:59 |
| **3** | `z-[160]` | Jogar/page loading screen | page.tsx:235 |
| **2** | `z-[150]` | Chat/Game dialogs | page.tsx:191,206,212 |
| **1** | `z-[100]` | DilemmaModal, Navbar, Toast | DilemmaModal.tsx:193, Navbar.tsx:78, ToastContext.tsx:46 |

**❌ PROBLEMA CRÍTICO:**
- `DilemmaModal` (z-100) está ABAIXO do Chat (z-150)
- Não há hierarquia semântica: números arbitrários sem governança
- `GameOverModal` em z-9999 bloqueia TUDO, incluindo ferramentas de debug

---

### 3. Service Worker: Estratégia Errada para Audio-First

**Config Atual:** [`public/sw.js`](file:///home/dan/Área de Trabalho/caminhos-campinas/public/sw.js)

```javascript
// Line 46: Stale-While-Revalidate
event.respondWith(
  caches.match(event.request).then((cachedResponse) => {
    const fetchPromise = fetch(event.request)...
    return cachedResponse || fetchPromise; // ❌ Network fallback
  })
);
```

**Por que isso é RUIM para Audio-First:**
- Áudios grandes podem falhar no primeiro acesso offline
- Prioriza busca de rede sobre cache
- `ASSETS_TO_CACHE` (linha 2-8) **não inclui arquivos de áudio**

**Solução Ideal:**
```javascript
// Cache-First Strategy for Audio
if (event.request.url.includes('/audio/')) {
  event.respondWith(
    caches.match(event.request).then(cached => 
      cached || fetch(event.request) // Cache SEMPRE primeiro
    )
  );
}
```

---

## 📊 ESTADO DO SISTEMA

### GameState Structure (23 Propriedades)

[`src/types/GameState.ts:71-124`](file:///home/dan/Área de Trabalho/caminhos-campinas/src/types/GameState.ts#L71-L124)

```typescript
export interface GameState {
  // Stats Básicos
  health: number;
  hunger: number;
  hygiene: number;
  sanity: number;
  energy: number;
  dignity: number;

  // Sistemas Sociais
  socialStigma: number;
  stabilityGap: number;
  addiction: number;
  trust: number;
  citizenship: number; // 0-100 (acesso institucional)

  // Recursos
  money: number;
  phoneBattery: number; // 0-100

  // PDU (Permanência Definitiva no Urbano)
  pdu: PDUState; // Quest system

  // Equipamento
  workTool: {
    type: "CARRINHO_RECICLAGEM" | "SACO_PRETO" | null;
    condition: number;
    capacity: number;
    riskFactor: number;
    isConfiscated: boolean;
  };

  // Documentos
  documents: {
    hasRG: boolean;
    hasCPF: boolean;
    hasCarteiraTrabalho: boolean;
    hasComprovanteResidencia: boolean;
  };

  // Termômetro Social (Métricas de Censo)
  socialThermometer: {
    fome: number;
    higiene: number;
    violencia: number;
    saude: number;
  };

  // Inventário & Flags
  inventory: Item[];
  flags: Record<string, boolean>;
  activeBuffs: string[];

  // Temporal & Espacial
  day: number;
  time: number; // 0-23.99 (float hours)
  userPosition: [number, number] | null; // [lat, lng]

  // Evento & Narrativa
  resolvedDilemmas: string[];
  activeDilemmaId: string | null;
  history: GameEvent[];

  // Avatar
  avatar: Avatar | null;

  // Estado da UI
  isAtShelter: boolean;
  isPaused: boolean;
  criticalHealth: boolean;
  hasHydrated: boolean;
  tutorialActive?: boolean; // ✅ Tutorial Block (Line 123)
  
  // Trabalho formal
  employed_formal: boolean;

  // Legado
  knowledge: number; // "Rualogia"
  security: number;
  score: number;
}
```

**✅ JÁ EXISTE `tutorialActive`!**
- Linha 123: `tutorialActive?: boolean; // [NEW] Tutorial Block`
- Usado em [`DilemmaManager.ts:93-98`](file:///home/dan/Área de Trabalho/caminhos-campinas/src/features/game-loop/DilemmaManager.ts#L93-L98) para bloquear dilemas durante o tutorial

---

### DilemmaManager: Lógica de Fila (Comportamento Atual)

**Bloqueios Existentes:**

```typescript
// Line 93-98: Tutorial Block ✅
if (tutorialActive) {
  console.log("[DilemmaManager] Dilemmas blocked: Tutorial is active.");
  return null;
}

// Line 104: Active Dilemma Block ✅
if (activeDilemmaId) return null; // Não dispara novo dilema se já há um ativo
```

**❌ MAS NÃO HÁ:**
- Fila de eventos pendentes (`pendingEvents: Dilemma[]`)
- Throttle/cooldown entre disparos (`lastTriggeredTime`)
- Priorização por `audioNarrationComplete`

**Solução:** Criar `ModalQueueManager` context com:
```typescript
interface ModalQueue {
  pending: {event: Dilemma, priority: number}[];
  activeModal: 'tutorial' | 'dilemma' | 'chat' | null;
  audioPlaying: boolean;
  enqueue(event: Dilemma): void;
  dequeue(): Dilemma | null;
}
```

---

### AudioReader.tsx: Controle Passivo ❌

[`src/components/ui/AudioReader.tsx`](file:///home/dan/Área de Trabalho/caminhos-campinas/src/components/ui/AudioReader.tsx)

**Arquitetura Atual:**
- Line 22-38: `togglePlay()` é **UI-driven** (botão ativa áudio)
- Sem callbacks `onStart`, `onEnd` para sincronizar com modais
- Sem controle de fila (um áudio por vez)

**Para Audio-First, precisamos:**
```typescript
interface AudioDirectorProps {
  text: string;
  onNarrationStart?: () => void;   // ← Pausa UI
  onNarrationComplete?: () => void; // ← Dispara modal
  priority?: 'critical' | 'ambient';
}
```

**Analogia do "Walkie-Talkie":**
```
Current: 📱 Botão → 🔊 Áudio → 👁️ Visual (desconectados)
Target:  🔊 Áudio → ⏸️  UI pausa → 👁️ Modal (orquestrado)
```

---

## 🎯 ROADMAP: AUDIO-FIRST TRANSFORMATION

### Phase 1: Queue Manager & Z-Index Governance

**1.1 Criar `src/contexts/ModalQueueContext.tsx`**

```typescript
export const ModalQueueProvider = ({ children }) => {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);
  const [audioPlaying, setAudioPlaying] = useState(false);

  const canShowModal = () => !audioPlaying && !activeModal;

  const enqueue = (item: QueueItem) => {
    setQueue(prev => [...prev, item].sort((a, b) => b.priority - a.priority));
  };

  const processQueue = () => {
    if (canShowModal() && queue.length > 0) {
      const next = queue[0];
      setQueue(prev => prev.slice(1));
      setActiveModal(next.type);
      return next;
    }
    return null;
  };

  return (
    <ModalQueueContext.Provider value={{queue, enqueue, processQueue, setAudioPlaying}}>
      {children}
    </ModalQueueContext.Provider>
  );
};
```

**1.2 Padronizar Z-Index em `globals.css`**

```css
:root {
  --z-base: 0;
  --z-navbar: 10;
  --z-toast: 50;
  --z-dilemma-modal: 100;
  --z-chat: 150;
  --z-tutorial: 200;
  --z-audio-director: 250; /* ← Survival Radio */
  --z-game-over: 300;
  --z-debug: 9999;
}
```

---

### Phase 2: Audio Director (Survival Radio)

**2.1 Criar `src/components/core/AudioDirector.tsx`**

```typescript
export function AudioDirector({ dilemma, onReady }: AudioDirectorProps) {
  const { setAudioPlaying } = useModalQueue();
  const [isNarrating, setIsNarrating] = useState(false);

  const startNarration = (text: string) => {
    setAudioPlaying(true);
    setIsNarrating(true);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'pt-BR';
    utterance.rate = 1.1;
    
    utterance.onend = () => {
      setIsNarrating(false);
      setAudioPlaying(false);
      onReady(); // ← DISPARA MODAL AQUI
    };

    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (dilemma) {
      startNarration(dilemma.description);
    }
  }, [dilemma]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[250]">
      {isNarrating && (
        <div className="bg-black/90 px-6 py-3 rounded-full border border-yellow-500 animate-pulse">
          <Mic className="inline mr-2" />
          <span className="text-yellow-300 font-mono">OUVINDO...</span>
        </div>
      )}
    </div>
  );
}
```

**2.2 Modificar `DilemmaModal.tsx`**

```typescript
// Line 117: Substitui o open imediato
const [modalVisible, setModalVisible] = useState(false);

<AudioDirector 
  dilemma={dilemma}
  onReady={() => setModalVisible(true)}
/>

<Dialog open={!!dilemma && modalVisible} onOpenChange={handleClose}>
  {/* ... */}
</Dialog>
```

---

### Phase 3: Service Worker Audio-First

**3.1 Modificar `public/sw.js`**

```javascript
const AUDIO_CACHE = 'caminhos-audio-v1';
const AUDIO_FILES = [
  '/audio/bom_prato_ambiente.mp3',
  '/audio/praca_noite.mp3',
  '/audio/dialogo_rua.mp3',
  // ← PRÉ-CACHE de áudios críticos
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(AUDIO_CACHE).then(cache => cache.addAll(AUDIO_FILES))
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('/audio/')) {
    // Cache-First para áudios
    event.respondWith(
      caches.match(event.request).then(cached => 
        cached || fetch(event.request).then(response => {
          caches.open(AUDIO_CACHE).then(cache => cache.put(event.request, response.clone()));
          return response;
        })
      )
    );
  } else {
    // Stale-While-Revalidate para o resto
    // ... lógica existente
  }
});
```

---

### Phase 4: Survival Radio Component

**Interface Primária = Walkie-Talkie**

```typescript
export function SurvivalRadio() {
  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const { processQueue } = useModalQueue();

  const startVoiceInput = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'pt-BR';
    recognition.continuous = false;

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setRecognizedText(text);

      // Processamento offline (keywords)
      if (text.includes('alimento') || text.includes('comida')) {
        processQueue(); // Dispara dilema "Buscar Comida"
      }

      // Processamento online (Groq/Llama)
      fetch('/api/groq', {
        method: 'POST',
        body: JSON.stringify({ prompt: text })
      }).then(res => res.json()).then(data => {
        // TTS da resposta
        const utterance = new SpeechSynthesisUtterance(data.response);
        window.speechSynthesis.speak(utterance);
      });
    };

    recognition.start();
    setIsListening(true);
  };

  return (
    <button 
      onClick={startVoiceInput}
      className="fixed bottom-6 right-6 z-[250] w-16 h-16 bg-amber-500 rounded-full shadow-lg"
    >
      <Mic className={isListening ? 'animate-pulse' : ''} />
    </button>
  );
}
```

---

## 🖼️ REDESIGN VISUAL & ASSETS

### Vercel Blob Integration

**Setup:**
```bash
npm i @vercel/blob
```

**Upload de Imagens Reais:**
```typescript
import { put } from '@vercel/blob';

export async function uploadCampinasPhoto(file: File) {
  const blob = await put(`campinas/${file.name}`, file, {
    access: 'public',
    token: process.env.BLOB_READ_WRITE_TOKEN
  });
  
  return blob.url; // Use em <img src={blob.url} />
}
```

**Wikimedia Commons API:**
```typescript
export async function getWikimediaImage(query: string) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${query}+Campinas&gsrnamespace=6&prop=imageinfo&iiprop=url&format=json`;
  
  const res = await fetch(url);
  const data = await res.json();
  
  return data.query.pages[Object.keys(data.query.pages)[0]].imageinfo[0].url;
}
```

---

### Expanded Avatar Creation

**Adicionar ao `Avatar` interface:**

```typescript
interface Avatar {
  // ... campos existentes ...
  
  // [NEW] Inventário Inicial
  startingItems: {
    hasBackpack: boolean;
    hasBlanket: boolean;
    hasPhone: boolean;
  };

  // [NEW] Histórico de Vínculos
  bonds: {
    hasFamilyContact: boolean; // Dificulta recuperação se false
    hasFormerJob: boolean; // Facilita reemprego
    timeOnStreet: 'recente' | 'veterano'; // Já existe, mover aqui
  };

  // [NEW] Condições de Saúde
  healthConditions: {
    chronicIllness: boolean; // Aumenta dificuldade
    mentalHealth: 'estavel' | 'fragil' | 'critico';
  };
}
```

**Impacto no Jogo:**
```typescript
// No início do jogo
if (avatar.bonds.hasFormerJob) {
  modifyStat('citizenship', +20); // Mais fácil acessar trabalho
}
if (avatar.healthConditions.chronicIllness) {
  modifyStat('health', -30); // Início mais difícil
}
```

---

## 🧪 PRÓXIMOS PASSOS (Pedir à IDX)

Agora que tenho o diagnóstico completo, solicite à IDX para implementar **PHASE 1** primeiro:

1. ✅ Criar `ModalQueueContext.tsx`
2. ✅ Padronizar Z-Index em `globals.css`
3. ✅ Modificar `DilemmaModal.tsx` para usar fila
4. ✅ Adicionar throttle em `useEventEngine.ts`

**Comando para IDX:**
```markdown
Implemente o Queue Manager seguindo o design em `AUDIO_FIRST_DIAGNOSTICS.md`. 
Priorize:
- ModalQueueContext com enqueue/dequeue
- Z-Index governance em globals.css
- Throttle de 2 segundos em DilemmaManager.findTriggeredDilemma()
```

---

## 📈 MÉTRICAS DE SUCESSO

**Antes (Caótico):**
- ❌ Tutorial sobreposto por dilemas
- ❌ Chat escondido sob modais
- ❌ 3-5 eventos simultâneos
- ❌ Audio desconectado da UI

**Depois (Walkie-Talkie):**
- ✅ Fila ordenada por prioridade
- ✅ Z-Index semântico (navegável)
- ✅ 1 evento por vez
- ✅ Audio → Pausa → Visual (sincronizado)

---

*Documentação gerada: 2026-01-13 00:56 UTC-3*  
*Base: Caminhos Campinas v1.2*
