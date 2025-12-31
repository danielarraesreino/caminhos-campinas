# Textos Completos do App - Caminhos Campinas

Este documento contém todo o conteúdo textual visível nas páginas da aplicação, extraído diretamente do código fonte.

---

## 1. Layout Global (Navbar & Footer)

**Arquivo:** `src/components/ui/Navbar.tsx` & `src/components/ui/Footer.tsx`

**Header (Navbar):**
- Título: CAMINHOS CAMPINAS
- Menu:
  - Início
  - Jogar (Simulador)
  - Impacto (Dados)
  - Sobre
  - Apoie
  - Login (Cofre)

**Footer:**
- Título: CAMINHOS CAMPINAS
- Subtítulo: Um jogo sério sobre invisibilidade social, dados e cidadania baseada em evidências.
- Créditos: Desenvolvido por Daniel (Japa) com ❤️ em Campinas.
- Link: Código Aberto (GitHub)
- Copyright: © 2025 Caminhos Campinas. Todos os direitos reservados.

---

## 2. Página Inicial (Home)

**Arquivo:** `src/app/page.tsx` (Renderiza `LandingPage.tsx`)

*Conteúdo dinâmico da Landing Page (resumo):*
- Título: A CIDADE QUE NINGUÉM VÊ
- Subtítulo: Um simulador de sobrevivência baseado em dados reais de Campinas/SP.
- Botões: "Iniciar Simulação", "Ver Dados de Impacto".

---

## 3. Sobre o Projeto

**Arquivo:** `src/app/sobre/page.tsx`

**O Manifesto**
- Título: Sobre o Projeto
- Subtítulo: Tecnologia Social para dar voz, visibilidade e dignidade.

**Artigo:**
- "A Invisibilidade é uma Escolha?"
- "Este não é apenas um jogo. É uma ferramenta de conscientização e sobrevivência."
- "Baseado em dados reais da cidade de Campinas (SP), este aplicativo tem dois objetivos fundamentais:"
  1. **Para quem joga (Empatia):** Sentir na pele os dilemas diários de quem vive na rua. A fome, o frio, a burocracia do estado e os olhares de julgamento.
  2. **Para quem vive (Utilidade):** Funciona como um mapa offline real conectando serviços essenciais (Centro Pop, Bom Prato, Abrigos) a quem mais precisa.

*Citação:* "Não olhe para o outro lado. Olhe nos olhos."

**Tecnologia Social:**
- "Desenvolvido como PWA (Progressive Web App) para rodar em qualquer celular..."

**Botão:** Seja um Apoiador do Projeto

---

## 4. Simulador (Jogar)

**Arquivo:** `src/app/jogar/page.tsx`

- Cabeçalho: Setor de Sobrevivência
- Estados de Aviso:
  - "Sem bateria": "Você está digitalmente invisível. Sem celular, você não tem acesso a mapas ou auxílio digital."

---

## 5. Dashboard de Impacto

**Arquivo:** `src/app/impacto/page.tsx`

- Título: CAMINHOS CAMPINAS
- Subtítulo: DASHBOARD DE IMPACTO & INTELIGÊNCIA DE DADOS (ESG)
- Cartões (KPIs):
  - VIDAS SIMULADAS
  - VIOLAÇÕES DETECTADAS (Choques de Direitos Humanos)
  - GAPS DE RECURSOS (Falhas de Acesso)
- Gráficos:
  - REALIDADE VS SIMULAÇÃO (CENSO 2024)
  - MAPA DE INCIDÊNCIA (ODS ONU)
- Rodapé: "Dados atualizados em tempo real via TelemetryService • Ambiente Project IDX"

---

## 6. Apoie (Doação & ESG)

**Arquivo:** `src/app/apoie/page.tsx`

**Hero:**
- Tag: Campanha "A Rua Tem Voz"
- Título: "Você passa por eles todos os dias. Agora você vai entender a jornada."
- Descrição: "O 'Caminhos Campinas' não é apenas um jogo. É uma janela para a realidade de 1.300 pessoas... Ao apoiar o Coletivo A Rua Tem Voz, você financia diretamente a contratação de educadores e alimentação."

**Botões:**
- Campanha no Apoia.se (Recorrente)
- Doar via PIX (Único)
- Fazer Parte da Mudança

**Dilema Exemplo (Card):**
- "O abrigo municipal (SAMIM) exige entrada até às 19h. Mas você conseguiu um 'bico'... O que você escolhe?"
- Opções: Garantir a cama (Perde R$ 20) vs Trabalhar (Dorme na rua).
- "Apoie para que ninguém precise fazer essa escolha."

**Por que doar?**
- "Vivemos na mesma cidade, mas em mundos diferentes..."
- Pilares: Acesso à Informação, Visibilidade Real, Cidadania Digital.

**Níveis de doação (Pessoas Físicas):**
- R$ 30 (Apoio Conectado): Ajuda a manter a plataforma no ar.
- R$ 50 (Kit Cidadania): 2ª via do RG.
- R$ 100 (Rede Fortalecida): Kits de higiene.

**PIX:**
- Chave: 19999912915 (Daniel Arraes Reino - Banco Neon)

**Apoio Institucional (Empresas):**
- "Sua empresa na construção de uma cidade justa."
- "Não vendemos dados. Construímos pontes."
- Opções: Parceiro Mantenedor (ESG), Apoio Técnico (Pro Bono).
- Benefícios: Logo no rodapé, Relatório mensal, Selo "Empresa Amiga da Rua".

**Transparência (Prestação de Contas):**
- Meta da Campanha: R$ 13.970,00 (Formação de 20 alunos).
- Detalhamento: RH (Coordenadores/Educadores), Logística (Alimentação, Material, Transporte).
- Módulos do Curso: Direitos Humanos, Acesso a Serviços, Organização Política, Advocacia.

---

## 7. Parceiros (Corporate)

**Arquivo:** `src/app/parceiros/page.tsx`

- Header: Corporate - Fale com a Diretoria
- Título: "Transforme responsabilidade social em dados auditáveis."
- Descrição: "Sua empresa precisa reportar contribuições para os ODS...? Nós geramos métricas reais de impacto para os ODS 1, 2 e 11."
- Botões: Quero ser Parceiro, Ver Dados Reais.
- ODS em Foco: ODS 1 (Erradicação da Pobreza), ODS 11 (Cidades Sustentáveis).
- KPI: ROI Social Estimado +400%.
- Proposta de Valor: Relatórios de Inteligência, Brand Safety & Purpose, Dedução Fiscal.
- Cotas: Cota Server (R$ 200/mês), Cota Mantenedor (Sob Consulta).

---

## 8. Recursos (Mapa de Serviços)

**Arquivo:** `src/app/recursos/page.tsx`

- Título: Guia de Rua
- Categorias: Alimentação, Saúde, Higiene, Dormir, Documentos, Formação.
- Avisos: MODO OFFLINE / Conectado.
- Emergência: "Emergência Médica? Ligue 192".
- Navegação do Site (Rodapé interno com links explicativos).

---

## 9. Transparência

**Arquivo:** `src/app/transparencia/page.tsx`

- Título: Planejamento do Piloto - 2026
- Intro: "Transparência desde o dia zero."
- "Este projeto ainda não está operando. Nossa missão agora é captar recursos..."
- Termômetro de Captação: Meta R$ 13.970,00.
- Metas Físicas: 20 Jovens Capacitados, 02 Educadores Sociais.

---

## 10. Hub de Projetos

**Arquivo:** `src/app/hub/cadastro/page.tsx`

- Título: Hub de Projetos
- Subtítulo: "Conectando quem quer ajudar com quem faz acontecer. Cadastre seu projeto ou coletivo."
- Rodapé: "Os dados serão validados pela equipe antes de aparecerem no mapa."
