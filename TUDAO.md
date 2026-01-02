# TUDAO: Auditoria & Exportação Completa - Caminhos Campinas
**Gerado em:** 01/01/2026
**Status:** Auditado & Consolidado

> 🚨 **ATENÇÃO:** Este documento reflete exatamente o estado atual do código em produção.

---

# 🔎 PARTE 1: AUDITORIA DE NAVEGAÇÃO

### 🟢 Páginas Ativas (Publicadas)
Estas páginas são acessíveis pelo usuário final através da interface (Navbar, Dashboard ou fluxos).

| Rota | Nome | Origem do Tráfego (Link) |
| :--- | :--- | :--- |
| `/` | **Home** | Root (`/`) |
| `/jogar` | **Game Loop** | Navbar, Dashboard, Landing CTA |
| `/apoie` | **Doação** | Navbar, Footer, Intersticiais |
| `/recursos` | **Guia de Rua** | Navbar (Utilidade), Landing |
| `/impacto` | **Dashboard** | Navbar, Landing (ESG) |
| `/transparencia` | **Prestação de Contas** | Navbar |
| `/jornal` | **Jornal da Rua** | Navbar, Dashboard |
| `/parceiros` | **Área ESG** | Navbar |
| `/sobre` | **Sobre** | Footer, Texto de Apoio |
| `/cofre` | **Cofre Digital** | Landing Page (Funcionalidades) |
| `/curso` | **Curso / Formação** | Dashboard |
| `/hub` | **Hub de Parceiros** | Dashboard (Nota: Página em construção) |

### 🔴 Páginas Órfãs ou Mortas (Dead ends)
Estas páginas existem no código (`src/app`) mas **NÃO** possuem links de entrada na interface atual. O usuário só acessa se digitar a URL.

| Rota | Status | Diagnóstico |
| :--- | :--- | :--- |
| `/hub/cadastro` | **Órfã** | Contém formulário real, mas `/hub` não linka para ela. |
| `/educacao` | **Redundante** | Provavelmente substituída por `/curso`. |
| `/blog` | **Redundante** | Provavelmente substituída por `/jornal`. |
| `/vault` | **Duplicada** | Versão legada de `/cofre`. |
| `/test-features` | **Dev** | Rota de testes de componente. |
| `/impacto/detalhes` | **404** | Linkada em alguns textos antigos, mas arquivo não existe. |

---

# 📄 PARTE 2: CONTEÚDO TEXTUAL COMPLETO

## 1. Landing Page (`src/features/ui/LandingPage.tsx`)
**Hero:** "A Invisibilidade é uma Escolha?" -> "Entre na pele de uma das 1.557 pessoas que vivem nas ruas de Campinas."
**Manifesto:** "Denunciar a Brutalidade. Legitimar o Pertencimento."
**Texto:** "Segundo o Censo 2024, 1.557 pessoas vivem nas ruas... A principal causa não é o vício, mas os conflitos familiares (38%)."
**Tecnologia:** "Inovação Social com Custo Eficiente. Diferente de apps tradicionais... usamos IA como alavanca de autonomia."

## 2. Página Sobre (`src/app/sobre/page.tsx`)
**Título:** "Tecnologia Social & Dignidade"
**Conceito:** "Caminhos Campinas não é apenas um jogo; é uma ferramenta de auditoria sociotécnica."
**Citação:** "Você sabe o que é o 'corró'. Você sabe onde o frio dói mais. Essa sabedoria não é apenas sobrevivência; é TECNOLOGIA SOCIAL."

## 3. Transparência (`src/app/transparencia/page.tsx`)
**Meta:** "Financiar custeio total do Projeto Piloto (Formação de Educadores Sociais)."
**Valor:** R$ 13.970,00
**Custos:**
- RH: R$ 6.720,00
- Alimentação: R$ 3.950,00
- Materiais: R$ 2.400,00
- Transporte: R$ 900,00

## 4. Apoie (`src/app/apoie/page.tsx`)
**Chamada:** "Você passa por eles todos os dias. Agora você vai entender a jornada."
**Opções:**
- R$ 30 (Apoio Conectado)
- R$ 50 (Kit Cidadania - DESTAQUE)
- R$ 100 (Rede Fortalecida)
**Pix:** `19999912915` (Daniel Arraes Reino - Banco Neon)

## 5. Tutorial (`OnboardingTutorial.tsx`)
**Slide 1:** "Bem-vindo às Ruas - 1.557 pessoas... conflitos familiares (71%)."
**Slide 2:** "Sobrevivência - Monitore Fome, Energia, Higiene."
**Slide 3:** "Plano de Cidadania - Busque Documentos (RG/CPF) e Benefícios."
**Slide 4:** "Sua Voz Importa - Fale ou Digite no Chat."

---

# 💾 PARTE 3: DADOS ESTRUTURADOS (JSON Exports)

## Serviços (`src/data/services-campinas.json`)
```json
[
  { "name": "Abrigos Municipais (Samim)", "address": "Rua Francisco Elisiário, 240", "type": "ABRIGO" },
  { "name": "Centro Pop I", "address": "Rua Regente Feijó, 824", "type": "ASSISTENCIA" },
  { "name": "Bom Prato Centro", "address": "Av. Dr. Moraes Sales, 384", "type": "ALIMENTACAO", "price": 1.0 },
  { "name": "Consultório na Rua", "address": "Rua Fernão Lopes, 1290", "type": "SAUDE" },
  { "name": "Bagageiro Municipal", "address": "Rua Francisco Theodoro, 138", "type": "ASSISTENCIA" },
  { "name": "CAPS AD III Reviver", "address": "Taquaral", "type": "SAUDE" },
  { "name": "Refeitório Metodista", "address": "Rua José Paulino", "type": "ALIMENTACAO", "price": 0 }
]
```

## Dilemas (`src/data/dilemmas-campinas.json`)
```json
[
  { 
    "title": "Operação Natal Seguro", 
    "trigger": "LOCATION_IDLE", 
    "options": ["Sair imediatamente", "Argumentar"] 
  },
  { 
    "title": "A Escolha do Alimento", 
    "trigger": "HUNGER_LOW", 
    "options": ["Bom Prato (R$1)", "Refeitório (Grátis+Fila)"] 
  },
  { 
    "title": "A Barreira do SAMIM", 
    "trigger": "TIME_AFTER_19", 
    "options": ["Implorar", "Dormir na porta"] 
  },
  { 
    "title": "A Fila do CRAS", 
    "trigger": "RANDOM", 
    "chain": "cras_cadastro_inicial -> cras_agendamento" 
  }
]
```

---

# 🔗 PARTE 4: LINKS & ASSETS

### Links Externos
- Instagram: `https://www.instagram.com/coletivoaruatemvoz`
- Apoia.se: `https://apoia.se/coletivoaruatemvoz`
- E-mail: `mailto:contato@caminhoscampinas.org`

### Arquivos para Download
- Projeto Pedagógico: `/downloads/projeto-pedagogico-completo.docx`
- Ementa Curso: `/assets/docs/ementa-curso-piloto.txt`

### Imagens Chave
- Background Hero: `/assets/images/landing-bg.png`
- Placeholder Mapa: `/assets/images/placeholder-map.png`
- Desenvolvedor: `/daniel_dev.jpg`

---

# 🛠 PARTE 5: STATUS TÉCNICO

**Versão:** v0.19.0 (Beta)
**Stack:** Next.js 14, TailwindCSS, Lucide Icons, Recharts.
**IA:** Groq API (Llama 3.3) via `src/app/api/chat`.
**DB:** PouchDB (Local), PostgreSQL (Supabase - Desativado/Migrando).
