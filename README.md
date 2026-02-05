# 🏙️ Caminhos Campinas

> Serious game sobre a realidade da população em situação de rua em Campinas/SP

Um jogo educacional que simula os desafios enfrentados por pessoas em situação de rua, combinando mecânicas de sobrevivência com narrativas baseadas em dados sociológicos reais de Campinas.

## 🎯 Sobre o Projeto

**Caminhos Campinas** é um serious game que busca conscientizar sobre a complexa realidade das pessoas em situação de rua. Através de uma experiência interativa, o jogador vivencia dilemas reais, gerencia recursos limitados e enfrenta o estigma social, tudo baseado em pesquisas sociológicas sobre Campinas.

### Características Principais

- 🎮 **Mecânicas de Sobrevivência Realistas**: Gerenciamento de fome, energia, saúde e higiene
- 🗺️ **Mapa Interativo de Campinas**: Localizações reais de serviços de apoio
- 🤖 **IA Contextualizada**: Chat com assistente IA que conhece a rede de apoio da cidade
- 📊 **Sistema de Dilemas Determinísticos**: Eventos baseados em estigma social e condições do jogador
- 💾 **Persistência Offline**: Salva o progresso localmente usando IndexedDB
- 📈 **Telemetria de Gameplay**: Coleta dados para análise do comportamento do jogador

## 🚀 Tecnologias

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/)
- **Mapa**: [Leaflet](https://leafletjs.com/) / [React-Leaflet](https://react-leaflet.js.org/)
- **IA**: [Groq API](https://groq.com/) (llama-3.3-70b-versatile) via [Vercel AI SDK](https://sdk.vercel.ai/)
- **Persistência**: [PouchDB](https://pouchdb.com/) (IndexedDB)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Linter**: [Biome](https://biomejs.dev/)

## 📋 Pré-requisitos

- Node.js 18+
- npm, yarn, pnpm ou bun
- Chaves de API:
  - Groq API (para o chat com IA)
  - Google Maps API (para o mapa interativo)

## 🛠️ Instalação

1. **Clone o repositório**

```bash
git clone https://github.com/SEU_USUARIO/caminhos-campinas.git
cd caminhos-campinas
```

1. **Instale as dependências**

```bash
npm install
```

1. **Configure as variáveis de ambiente**

Copie o arquivo `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

Edite `.env.local` e adicione suas chaves:

```env
GROQ_API_KEY=sua_chave_groq_aqui
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=sua_chave_google_maps_aqui
```

1. **Execute o servidor de desenvolvimento**

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no navegador.

## 🚀 Como Fazer Deploy

## 🚀 Como Fazer Deploy

A maneira mais fácil de publicar este projeto é usando a [Vercel](https://vercel.com) (criadores do Next.js).

1. Faça um fork deste repositório para o seu GitHub.
2. Crie uma conta na Vercel e importe o projeto do GitHub.
3. Configure as **Variáveis de Ambiente** (Settings > Environment Variables):

   | Nome | Descrição | Exemplo |
   |------|-----------|---------|
   | `AUTH_SECRET` | **Obrigatório**. Chave para criptografia da sessão. | Gere no terminal: `openssl rand -base64 32` |
   | `GROQ_API_KEY` | **Obrigatório**. API da IA. | `gsk_...` |
   | `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | **Obrigatório**. Mapa. | `AIza...` |
   | `AUTH_GOOGLE_ID` | (Opcional) Para login com Google. | `...apps.googleusercontent.com` |
   | `AUTH_GOOGLE_SECRET` | (Opcional) Para login com Google. | `GOCSPX-...` |

4. Clique em "Deploy".

> **Nota:** Se o login apresentar erro 500, verifique se `AUTH_SECRET` foi adicionado corretamente.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FSEU_USUARIO%2Fcaminhos-campinas)

## 📁 Estrutura do Projeto

```
pop-rua-game/
├── src/
│   ├── app/                    # Rotas Next.js (App Router)
│   │   ├── page.tsx           # Landing page
│   │   ├── jogar/             # Página principal do jogo
│   │   ├── sobre/             # Sobre o projeto
│   │   ├── apoie/             # Como apoiar
│   │   └── api/               # API routes (chat com IA)
│   ├── components/            # Componentes reutilizáveis
│   │   └── ui/                # Componentes UI (shadcn/ui)
│   ├── contexts/              # Contexts API
│   │   ├── GameContext.tsx    # Estado global do jogo
│   │   └── ServicesContext.tsx # Serviços de Campinas
│   ├── features/              # Features modulares
│   │   ├── game-loop/         # Loop principal e dilemas
│   │   ├── offline-db/        # Persistência com PouchDB
│   │   ├── survival-map/      # Mapa interativo
│   │   └── ui/                # Componentes de UI do jogo
│   ├── hooks/                 # Custom hooks
│   └── services/              # Serviços (telemetria, etc.)
├── public/
│   └── data/                  # Dados de serviços de Campinas
├── scripts/                   # Scripts utilitários
└── *.md                       # Documentação técnica
```

## 📚 Documentação Técnica

- [Architecture_Map.md](./Architecture_Map.md) - Arquitetura do sistema
- [Core_Mechanics.md](./Core_Mechanics.md) - Mecânicas de jogo
- [Tech_Stack.md](./Tech_Stack.md) - Stack técnica detalhada
- [Narrative_DB.md](./Narrative_DB.md) - Sistema narrativo
- [REDE_APOIO_CAMPINAS.md](./REDE_APOIO_CAMPINAS.md) - Rede de apoio real
- [SOCIOLOGIA_BRASILEIRA_E_CAMPINAS.md](./SOCIOLOGIA_BRASILEIRA_E_CAMPINAS.md) - Base sociológica

## 🎮 Como Jogar

1. **Crie seu Avatar**: Customize seu personagem na tela inicial
2. **Gerencie Recursos**: Monitore fome, energia, saúde e higiene através do HUD
3. **Explore Campinas**: Use o mapa para encontrar serviços de apoio próximos
4. **Tome Decisões**: Enfrente dilemas que afetam sua dignidade e estigma social
5. **Peça Ajuda**: Converse com o chatbot IA para orientação sobre recursos
6. **Sobreviva**: Trabalhe, coma, descanse e mantenha-se vivo

## 🧪 Scripts Disponíveis

```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Cria build de produção
npm run start        # Inicia servidor de produção
npm run lint         # Executa linter (Biome)
npm run format       # Formata código com Biome
npm run test:e2e     # Executa testes E2E com Playwright
```

## 🎮 DEMO_MODE

O projeto inclui um **DEMO_MODE** que ajusta as mecânicas do jogo para demonstrações e testes.

### O que é?

`DEMO_MODE` é uma configuração em `src/features/game-loop/useGameLoop.ts` que torna o jogo menos punitivo e mais lento, ideal para:
- 🎤 Apresentações e demos
- 🧪 Testes e desenvolvimento
- 👶 Primeiras experiências de jogadores

### Efeitos Quando Ativado

| Mecânica | Produção | Demo Mode |
|----------|----------|-----------|
| **Confisco ("O Rapa")** | 2% chance | 0% (desativado) |
| **Decay de Sanidade** | 100% | 50% (reduzido) |
| **Game Loop Tick** | 10 segundos | 30 segundos |

### Como Identificar

Quando ativo, um badge roxo aparece no topo da tela do jogo:

```
🎮 Modo Demo ℹ️
```

Passe o mouse sobre o badge para ver os detalhes.

### Configuração

Para alterar o modo, edite `src/features/game-loop/useGameLoop.ts`:

```typescript
// Para demonstrações e testes
const DEMO_MODE = true;

// Para produção (simulação realista)
const DEMO_MODE = false;
```

> **⚠️ Importante**: Para lançamento público, defina `DEMO_MODE = false`. A simulação realista é crucial para o impacto educacional do jogo.

📖 **Documentação completa**: [/sobre/demo-mode](/sobre/demo-mode)

## 🎯 Objetivos de Aprendizagem

Este serious game foi desenvolvido com objetivos educacionais:

- **Conscientização Social**: Entender a realidade da população em situação de rua
- **Empatia**: Vivenciar (virtualmente) os desafios diários
- **Conhecimento de Recursos**: Aprender sobre a rede de apoio em Campinas
- **Reflexão Crítica**: Questionar estigmas e preconceitos sociais

## 🤝 Contribuindo

Contribuições são bem-vindas! Se você encontrar bugs ou tiver sugestões:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é um serious game educacional desenvolvido para fins acadêmicos e de conscientização social.

## 🙏 Agradecimentos

- Dados sociológicos baseados em pesquisas sobre Campinas
- Rede de apoio real da cidade de Campinas/SP
- Comunidade open-source pelas ferramentas utilizadas

## 📧 Contato

Para dúvidas, sugestões ou colaborações, abra uma issue no GitHub.

---

**Desenvolvido com 💙 para promover empatia e conscientização social**
