# Mapa de Conteúdo do Frontend (Caminhos Campinas)

Este documento mapeia todo o texto visível e elementos de UI por rota, extraído diretamente do código fonte atual.

## Rota: `/` (Home / Dashboard Unificado)
**Arquivo Fonte:** `src/features/ui/UnifiedDashboard.tsx`

### Cabeçalho
- **Título:** "Caminhos CPS | 019"
- **Subtítulo:** "Tecnologia Social & Sobrevivência"
- **Status:** "SISTEMA ONLINE" (com indicador pulsante)

### Menu Principal (Cards)
1.  **Jogar Simulador** (Rota: `/jogar`)
    -   *Descrição:* "Entre na pele de quem vive nas ruas de Campinas. Enfrente dilemas reais, sobreviva à burocracia e busque a autonomia."
    -   *CTA:* "INICIAR JORNADA"
2.  **Jornal da Rua** (Rota: `/jornal`)
    -   *Descrição:* "Notícias, denúncias de violência e tradução de leis (Padre Júlio, LOAS) para linguagem acessível."
3.  **Formação** (Rota: `/curso`)
    -   *Descrição:* "Área educativa para Redutores de Danos e Agentes de Saúde. Cursos sobre direitos e cidadania."
4.  **Rede de Apoio** (Rota: `/hub`)
    -   *Descrição:* "Mapa de ONGs, cadastro de parceiros e recursos para doadores. Conecte-se com quem faz a diferença."

### Rodapé
-   **Dados Seguros:** "Plataforma em conformidade com LGPD..."
-   **Localização:** "Campinas / SP - Focado na realidade do DDD 019."

---

## Rota: `/jogar` (Simulador)
**Arquivo Fonte:** `src/app/jogar/page.tsx`, `src/features/ui/GameHUD.tsx`

### UI Visível
-   **Mapa:** `SurvivalMap` (Camada de fundo)
-   **HUD:** `GameHUD` (Barra superior e controles)
-   **Modais:** `DilemmaModal` (Aparece em eventos), `GameChat` (Chat interativo), `ImpactReport` (Game Over).

### Tutorial (Onboarding)
-   *Condição:* Aparece se `pop_rua_tutorial_seen` não existir.

---

## Rota: `/hub` (Rede de Apoio)
**Arquivo Fonte:** `src/app/hub/page.tsx`

### Conteúdo
-   **Título:** "Hub de Parceiros & Mapa"
-   **Subtítulo:** "Conheça a rede de apoio que sustenta a população em situação de rua em Campinas."
-   **Lista de Parceiros:** Renderizada a partir de `partnersData`.
    -   Campos: Nome, Tipo, Descrição, Endereço, Contato, Tags de Serviços.
-   **CTA Cadastro:** "Você representa uma organização e quer fazer parte da rede? -> Cadastrar Instituição (Em Breve)"

---

## Rota: `/cofre` (Meus Documentos)
**Arquivo Fonte:** `src/app/cofre/page.tsx`

### Estado: Bloqueado (Tela Inicial)
-   **Título:** "Seus Documentos, Sua Identidade."
-   **Texto:** "Na rua, perder o RG é perder a cidadania..."
-   **Botão:** "Criar Chave de Acesso Segura"
-   **Aviso:** "Seus dados ficam salvos APENAS no seu celular..."

### Estado: Desbloqueado (Dashboard)
-   **Título:** "Cofre Digital"
-   **Status:** "Criptografado (K-5)"
-   **Cards de Documentos:**
    -   RG (Identidade) - "Essencial para BPC"
    -   CPF - "Auxílios do Governo"
    -   Carteira de Trabalho - "Vagas de Emprego"
    -   Receitas Médicas - "Retirada no Posto"
-   **Ação:** "Adicionar Novo Documento" (Upload/Foto)

---

## Rota: `/impacto` (Dados Abertos)
**Arquivo Fonte:** `src/app/impacto/page.tsx`

### Cabeçalho
-   **Título:** "Painel de Inteligência Social"
-   **Subtítulo:** "Simulação baseada no Censo Pop. Rua Campinas 2024 (1.557 pessoas mapeadas)"

### KPIs (Indicadores)
-   População Mapeada
-   Déficit Habitacional (ODS 11)
-   Risco de Fome (ODS 2)
-   Crise Sanitária (ODS 6)
-   Dignidade Menstrual (ODS 3)
-   ODS 18 - Equidade Racial

### Gráficos e Análises
-   **Capacidade de Acolhimento:** Demanda Real vs Vagas Disponíveis (Barra CSS).
-   **Análise de Inteligência:** Insights qualitativos sobre Alerta Sanitário, Barreira do RG, e Consultório na Rua.
-   **Auditoria Sociotécnica:** "A Realidade Invisível"
    -   Barreira Digital (Sem celular/Sem dados)
    -   Violência Institucional (Agentes do Estado vs Civis)
    -   Causa Raiz (Conflito Familiar vs Álcool/Drogas)

---

## Rota: `/jornal` (Jornal da Rua)
**Arquivo Fonte:** `src/app/jornal/page.tsx`

### Cabeçalho
-   **Título:** "JORNAL DA RUA"
-   **Subtítulo:** "Notícias, denúncias e a voz de quem vive a cidade."

### Lista de Posts
-   Renderiza `posts` de `journal-posts.json`: Categoria, Data, Título, Conteúdo, Autor.

---

## Rota: `/apoie` (Doação)
**Arquivo Fonte:** `src/app/apoie/page.tsx`

### Hero
-   **Título:** "Você passa por eles todos os dias. Agora você vai entender a jornada."
-   **Argumento:** Apoio financia Tecnologia Social, Educação (Bolsa-Formação) e Inteligência de Dados.
-   **CTAs:** "Campanha no Apoia.se", "Doar via PIX", "Fazer Parte da Mudança".

### Opções de Doação (Níveis)
1.  **R$ 30 - Apoio Conectado:** Manutenção da plataforma.
2.  **R$ 50 - Kit Cidadania:** Custo de 2ª via de RG.
3.  **R$ 100 - Rede Fortalecida:** Logística de voluntários.

### PIX
-   QR Code e Chave Pix (Celular), Banco Neon.

### Transparência (Orçamento)
-   **Meta:** R$ 13.970,00 (Formação de 20 alunos).
-   **Detalhamento:** RH, Logística, Materiais.
-   **Metodologia:** Módulos de Direitos Humanos, Acesso a Serviços, etc.

---

## Rota: `/recursos` (Guia de Rua)
**Arquivo Fonte:** `src/app/recursos/page.tsx`

### Cabeçalho
-   **Título:** "GUIA DE RUA"
-   **Status:** Modo Offline / Conectado.

### Categorias (Botões Maslow)
-   Alimentação, Saúde, Higiene, Abrigo, Documentos, Trabalho.

### Lista de Serviços
-   Cards com: Nome, Tipo (com cor), Endereço, Horário, Requisitos (com validação em tempo real de RG/CPF), Itens Proibidos (aviso).
-   **Ações:** "Ver Mapa", "Inscrever-se" (se Educação), "Desabafar" (se Bonding).

### Navegação de Rodapé
-   Links rápidos para Início, Simulador, Dados de Impacto, Sobre, Apoie.
