# **Impacto e Viabilidade Sociotécnica de Jogos Sérios para População em Situação de Rua: Uma Análise em Profundidade**

## **1\. Introdução: A Convergência entre Tecnologia Cívica e Realidade Social**

A presente análise técnica e sociológica debruça-se sobre as propostas para o desenvolvimento de um *serious game* (jogo sério) voltado à população em situação de rua na cidade de Campinas, São Paulo. O projeto, intitulado em uma das propostas como "Arquitetura da Invisibilidade", busca operar em duas frentes distintas, porém complementares: como uma ferramenta de sensibilização ("máquina de empatia") para a sociedade civil e como um utilitário de sobrevivência ("bússola de serviços") para a população vulnerável. A avaliação a seguir disseca a viabilidade das escolhas tecnológicas — especificamente o uso de desenvolvimento agêntico via Google Antigravity e modelos de IA como Gemini 3 — em contraste com a infraestrutura material disponível para os usuários finais. Além disso, propõe-se um roteiro detalhado para a integração de métricas alinhadas aos Objetivos de Desenvolvimento Sustentável (ODS) da Agenda 2030, transformando a interação lúdica em dados auditáveis para políticas públicas.

O contexto urbano de Campinas serve como um laboratório crítico para esta intervenção. Com uma população de rua estimada em crescimento, identificada pelo Censo de 2024 em cerca de 1.300 indivíduos 1, a cidade apresenta uma rede de serviços assistenciais que, embora robusta, enfrenta desafios de acessibilidade informacional. A premissa de utilizar jogos sérios, historicamente eficazes em simulações de gestão de escassez como *Spent* ou *Hobson’s Choice* 3, é aqui expandida para incluir uma funcionalidade operacional inédita. No entanto, a tensão entre o "estado da arte" do código proposto e a "tecnologia do possível" nas ruas exige uma revisão arquitetural profunda.

## **2\. Fundamentos Teóricos e Contextualização Sociotécnica**

### **2.1. O Paradigma dos Jogos Sérios e a Engenharia da Empatia**

Os jogos sérios transcendem o entretenimento puro, posicionando-se como ferramentas pedagógicas e de engenharia social. No contexto da assistência social, a mecânica central destes jogos reside frequentemente na simulação da impotência. Títulos como *Spent* funcionam colocando o jogador diante de escolhas impossíveis (ex: "Pagar o aluguel ou o conserto do carro para ir trabalhar?"), desmantelando a falácia meritocrática de que a pobreza é fruto de má gestão pessoal.3

A proposta "Arquitetura da Invisibilidade" avança este paradigma ao introduzir a "vivência do desenvolvedor" como um ativo de legitimidade. A conversão da "memória da rua" em algoritmos não apenas enriquece a narrativa com verossimilhança crua, mas também atua como um mecanismo de denúncia contra a aporofobia (aversão aos pobres) e a arquitetura hostil da cidade.3 Contudo, para que essa empatia computacional se traduza em impacto real, o software deve romper a barreira da tela e oferecer utilidade tangível.

A dualidade do público-alvo — doadores em busca de conexão emocional e usuários em busca de recursos vitais — impõe um desafio de design de interface (UI) e experiência do usuário (UX) significativo. O código deve, portanto, gerenciar dois estados de operação distintos: o **Modo Narrativo**, rico em mídia e interatividade para dispositivos modernos, e o **Modo Utilitário**, austero e eficiente para dispositivos legados.

### **2.2. A Realidade Material de Campinas: Mapeamento da Exclusão**

A eficácia do projeto depende da precisão com que a infraestrutura de Campinas é digitalizada. A cidade não é um cenário genérico; é um ecossistema de "hubs" de sobrevivência com regras rígidas.

* **Rede Governamental:** Os Centros POP (I e II) funcionam como nós centrais para higiene e documentação. A diferenciação geográfica entre a unidade da Rua Regente Feijó (Centro Pop I) e a da Rua José Paulino (Centro Pop II) é crítica, pois determina o tempo de deslocamento e o acesso a serviços específicos como banho, que possuem janelas temporais estritas (ex: encerramento às 16h).3 O Albergue Municipal (Samim) opera com lógicas de *check-in* que variam conforme a sazonalidade, estendendo horários durante a Operação Inverno.5  
* **Economia da Doação:** A rede de suporte informal, composta por ONGs como Toca de Assis e grupos religiosos, preenche as lacunas do estado. A localização destes pontos e a volatilidade de seus horários de atendimento exigem que o banco de dados do jogo seja dinâmico e, idealmente, alimentado pela comunidade.3

A transposição destes elementos para o código não pode ser procedimental (aleatória). Ela exige um *Level Design* documental, onde cada "missão" no jogo corresponde a um desafio burocrático ou logístico real enfrentado na cidade.

### **2.3. O Paradoxo da Conectividade e o Hardware Disponível**

Um erro comum em intervenções digitais para populações vulneráveis é a presunção de acesso tecnológico uniforme. Embora pesquisas indiquem que uma parcela significativa da população de rua possui smartphones (cerca de 58% a 70% em alguns estudos, com predominância absoluta de Android), estes dispositivos são frequentemente modelos de entrada, antigos (Android 8/9/10), com baterias degradadas e telas danificadas.8

A conectividade é igualmente precária. O acesso à internet depende quase exclusivamente de pontos de Wi-Fi públicos ou compartilhados. Em Campinas, o programa "Campinas Digital" oferece pontos gratuitos em locais estratégicos como o Largo do Rosário e Terminais, mas impõe barreiras de autenticação (cadastro de CPF) e limites de tempo (sessões de 40 minutos).10 O código do aplicativo deve, portanto, ser resiliente a interrupções abruptas de rede e capaz de realizar operações complexas (como traçar rotas ou consultar guias) em modo totalmente *offline*.

## **3\. Avaliação da Arquitetura Técnica Proposta**

A análise da proposta "Arquitetura da Invisibilidade" revela uma ambição técnica louvável, mas perigosamente desalinhada com a realidade de hardware do público-alvo. A sugestão de utilizar o *Google Antigravity IDE* e o modelo *Gemini 3* como espinha dorsal do projeto apresenta riscos estruturais que precisam ser mitigados.

### **3.1. O Risco do "Overengineering" com IA Generativa On-Device**

A proposta sugere a implementação do modelo **Gemini Nano** rodando localmente nos dispositivos (*on-device*) para garantir funcionalidades de IA *offline*.3 Esta escolha técnica, embora na vanguarda da inovação, é inviável para o contexto específico.

Análise de Requisitos de Hardware do Gemini Nano:  
Documentação técnica recente indica que o Gemini Nano é otimizado para dispositivos de alta performance, exigindo chipsets com Unidades de Processamento Neural (NPUs) dedicadas, como o Google Tensor G3/G4 (série Pixel 8 e 9\) ou Snapdragon 8 Gen 3 (série Galaxy S24).12 Além disso, a execução eficiente do modelo requer quantidades substanciais de memória RAM — frequentemente acima de 8GB, com alocação dinâmica que pode consumir 2GB a 4GB apenas para o modelo.14  
Incompatibilidade com o Público-Alvo:  
Aplicar esta tecnologia em smartphones de entrada ou antigos (com 2GB ou 3GB de RAM e processadores sem NPU) resultará em:

1. **Impossibilidade de Execução:** O serviço de sistema *Android AICore*, necessário para orquestrar o Gemini Nano, não é distribuído para versões antigas do Android ou dispositivos de baixo custo.16  
2. **Degradação de Performance:** Se forçado (via *pollyfills* ou versões não otimizadas), o processamento causará travamento do sistema operacional e aquecimento excessivo.  
3. **Drenagem de Bateria:** O processamento de inferência de IA é intensivo em energia. Em um contexto onde a carga da bateria é um recurso crítico de sobrevivência, um aplicativo que consome 20% da bateria para responder a uma pergunta simples será desinstalado imediatamente.18

**Conclusão da Avaliação:** A dependência do Gemini Nano deve ser removida da arquitetura para a versão do usuário final (população de rua). Ela pode ser mantida, opcionalmente, apenas para a versão de "Empatia" destinada a doadores com hardware de ponta.

### **3.2. Desenvolvimento Agêntico e a Manutenibilidade do Código**

O uso do *Google Antigravity IDE* — um ambiente de desenvolvimento que integra agentes de IA autônomos para planejar, codificar e testar 20 — oferece velocidade de produção, mas introduz riscos de "Caixa Preta".

* **Código Não Determinístico:** Agentes de IA (como o *Coding Agent* do Antigravity) geram código baseados em probabilidades. Isso pode introduzir bugs sutis ou lógicas de navegação que funcionam na maioria dos casos, mas falham em situações de borda críticas (ex: transição de *online* para *offline* durante uma operação de banco de dados).  
* **Dependência de Plataforma:** O Antigravity é uma ferramenta proprietária (embora baseada no VS Code).21 Construir todo o fluxo de trabalho em torno de seus agentes específicos pode criar um *vendor lock-in*, dificultando a migração do projeto para uma comunidade *open-source* no futuro, o que é essencial para a sustentabilidade de projetos sociais.

### **3.3. Riscos de Alucinação em Contextos Críticos**

A proposta de um "Chatbot de Direitos" baseado em IA generativa (Gemini 3\) para orientar sobre leis e documentos carrega um risco ético e legal severo. Modelos de linguagem tendem a "alucinar" — inventar fatos ou leis com alta confiança — quando não possuem a informação exata no contexto.3  
Orientar um usuário vulnerável a ir a um cartório inexistente ou citar uma lei revogada pode causar danos reais (perda de recursos financeiros e tempo). Portanto, a estrutura do código não pode confiar cegamente na saída gerada pela IA para informações factuais críticas.

## **4\. Sugestões de Melhorias de Baixo Impacto Tecnológico e Refatoração**

Para alinhar o projeto à realidade das ruas e garantir sua função social, sugere-se uma refatoração da arquitetura focada na robustez, baixo consumo de recursos e tecnologias amplamente acessíveis.

### **4.1. Substituição da IA Generativa por Lógica Determinística Leve**

Em vez de processamento neural pesado no dispositivo, a inteligência do "Guia de Serviços" e do "Chatbot" deve ser baseada em estruturas de dados leves e algoritmos determinísticos.

* **Árvores de Decisão (Decision Trees):** Implementar o fluxo de orientação jurídica (ex: "Como tirar RG") como uma árvore de decisão estática em formato JSON. O usuário navega por opções pré-definidas ("Tenho Certidão?" \-\> Sim/Não). Isso requer processamento ínfimo e garante 100% de precisão na informação, pois o conteúdo é curado por humanos e não gerado por IA.24  
* **Busca Full-Text Local (FTS):** Para dúvidas gerais, utilizar a funcionalidade de busca textual (FTS) do banco de dados SQLite local. Isso permite encontrar "almoço grátis" ou "banho" instantaneamente sem necessidade de inferência semântica pesada.26

### **4.2. Adoção de Tecnologias Web Progressivas (PWA)**

Para maximizar o alcance, a interface utilitária deve ser desenvolvida como um *Progressive Web App* (PWA).

* **Vantagens:** PWAs não exigem download via loja de aplicativos (que requer conta Google ativa e espaço livre), podem ser instalados diretamente do navegador e possuem capacidades *offline* robustas através de *Service Workers*.27  
* **Cache Agressivo:** Configurar o *Service Worker* para armazenar todo o *shell* da aplicação e o banco de dados de serviços (via IndexedDB) no primeiro acesso. Isso garante que o app abra instantaneamente mesmo sem rede subsequente.29

### **4.3. Integração via USSD e SMS: A "Internet" dos Desconectados**

Para incluir a parcela da população que possui apenas celulares básicos (*feature phones*) sem internet, o sistema deve oferecer interfaces baseadas em telefonia GSM padrão.

* **Menu USSD Dinâmico:** Implementar um serviço USSD (ex: digitar \*123\#) que exibe um menu de texto simples: "1. Comida", "2. Abrigo", "3. Emergência". O protocolo USSD funciona na banda de sinalização de voz, não consome plano de dados e é compatível com praticamente qualquer celular fabricado nas últimas duas décadas.30  
  * *Design do Menu:* O menu deve ser "unbundled" (desagregado), priorizando serviços vitais no primeiro nível para reduzir o tempo de sessão e evitar *timeouts* da rede.32  
* **Gateways de SMS:** Utilizar gateways de SMS (como Twilio, Zenvia ou Infobip) para enviar alertas de broadcast (ex: "Alerta de Frio: Abrigo Extra na Igreja X aberto hoje"). O custo de SMS no Brasil varia (aprox. USD 0.05 a 0.06 por mensagem via API internacional, ou menos via brokers locais), mas o retorno em alcance é inigualável.34

### **4.4. Otimização Extrema de Bateria e Interface**

O código deve priorizar a eficiência energética acima da estética.

* **Modo "Super Economia":** Interface predominantemente preta (True Black \#000000) para telas AMOLED, desligando pixels e economizando bateria. Texto em alto contraste (Branco ou Amarelo) para legibilidade sob luz solar forte.37  
* **Gerenciamento de Processos:** O app não deve ter processos em segundo plano (*background services*) que mantenham a CPU ativa (*wakelocks*) desnecessariamente. A sincronização deve ser agendada via *WorkManager* do Android apenas quando o dispositivo estiver carregando ou detectar Wi-Fi estável.18

## **5\. Estratégia de Dados para os ODS (Objetivos de Desenvolvimento Sustentável)**

A integração com os ODS é o diferencial que transforma o aplicativo de uma ferramenta assistencialista para uma plataforma de inteligência urbana. A pergunta central é: como medir impacto em um ambiente informal? A resposta reside na **telemetria de uso** como *proxy* para indicadores sociais.

O código deve ser instrumentado para coletar eventos de interação (anonimizados) que correspondam diretamente a metas dos ODS. A tabela a seguir detalha essa correlação, as fontes de dados e a metodologia de geração.

### **5.1. Mapeamento de Indicadores e Coleta de Dados**

| ODS e Meta | Indicador Oficial ONU | Indicador "Proxy" Digital (Gerado pelo App) | Fonte e Método de Coleta |
| :---- | :---- | :---- | :---- |
| **ODS 1: Erradicação da Pobreza** Meta 1.4: Acesso a serviços básicos e recursos. | **1.4.1:** Proporção da população com acesso a serviços básicos. | **Taxa de Êxito na Busca por Serviços:** % de usuários que buscaram um serviço e clicaram em "Navegar" ou "Ligar". | **Gerado:** Log de eventos de UI (service\_click, navigation\_start). Se o usuário clica, assume-se uma intenção atendida preliminarmente. |
| **ODS 2: Fome Zero** Meta 2.1: Acesso a alimentos seguros. | Prevalência de insegurança alimentar. | **Mapa de Calor de Demanda Alimentar:** Volume de buscas por "Comida/Jantar" vs. Oferta cadastrada na região/horário. | **Gerado:** Coordenadas GPS aproximadas das buscas por alimentação. Cruzamento com o banco de dados de locais abertos. Identifica "desertos alimentares" temporais. |
| **ODS 3: Saúde e Bem-Estar** Meta 3.8: Cobertura de saúde. | Cobertura de serviços essenciais de saúde. | **Conexão com Saúde Primária:** Número de redirecionamentos para "Consultório na Rua" ou campanhas de vacinação. | **Gerado:** Contagem de acessos à categoria "Saúde". **Obtido:** Integração com dados da Secretaria de Saúde sobre a rota das vans do Consultório na Rua. |
| **ODS 10: Redução das Desigualdades** Meta 10.3: Igualdade de oportunidades. | Proporção de pessoas que reportam discriminação/assédio. | **Índice de Acesso à Cidadania:** Número de guias de documentação (RG, Certidão) completados ou acessados. | **Gerado:** Telemetria do tutorial "Quest da Burocracia". Cliques no link externo do Registro Civil.3 |
| **ODS 11: Cidades Sustentáveis** Meta 11.1: Habitação segura e adequada. | Proporção de população urbana vivendo em favelas/assentamentos. | **Déficit de Acolhimento Noturno:** Diferença entre buscas por "Abrigo" após as 20h e número de vagas disponíveis. | **Híbrido:** Dados gerados de busca vs. Dados obtidos (via *scraping* ou input manual) sobre a lotação do Samim e abrigos parceiros. |

### **5.2. Fontes de Dados Externas e Integração (Onde e Como)**

Para que os indicadores acima tenham validade, o aplicativo precisa de uma base de dados "viva".

1. **Dados Oficiais e Portais de Transparência:**  
   * **Fonte:** Portal de Dados Abertos de Campinas e Governo Federal (CadÚnico, Censo Pop Rua).1  
   * **Integração:** Scripts de *Web Scraping* ou consumo de APIs governamentais (onde disponíveis, como a API de Dados do Portal da Transparência) para atualizar a lista base de equipamentos públicos.41 Como muitas vezes esses dados são estáticos (PDFs, tabelas), recomenda-se um *backend* administrativo onde voluntários possam inserir dados extraídos de editais e publicações do Diário Oficial.42  
2. **Crowdsourcing Comunitário (A "Wazezação" da Assistência):**  
   * **Mecanismo:** Criar perfis de "Validadores" (assistentes sociais, líderes de ONGs) que têm permissão para atualizar o status de um serviço em tempo real no app (ex: "Samim lotado", "Sopa da Praça X cancelada hoje").  
   * **Benefício:** Isso resolve o problema da falta de APIs em tempo real para serviços informais, criando uma base de dados dinâmica e confiável.  
3. **Monitoramento Ambiental:**  
   * **Integração:** Conectar com APIs de previsão do tempo (OpenWeatherMap ou similares) para acionar automaticamente alertas de "Operação Inverno" quando a temperatura cair abaixo de um limiar (ex: 13°C), orientando usuários para abrigos de contingência.5

### **5.3. Privacidade e Proteção de Dados (LGPD)**

A coleta de dados de populações vulneráveis exige conformidade estrita com a LGPD.

* **Anonimização na Fonte:** O aplicativo não deve exigir login com dados reais (nome, CPF, telefone) para as funções básicas. Identificadores únicos devem ser *hashs* aleatórios gerados no dispositivo, desvinculados da identidade civil.  
* **Consentimento Explícito e Simplificado:** Os termos de uso devem ser apresentados em linguagem simples e, preferencialmente, em formato de áudio, explicando que os dados de uso ajudam a melhorar os serviços da cidade, sem rastrear o indivíduo.43  
* **Armazenamento Local:** Dados sensíveis (como fotos de documentos) devem permanecer estritamente no armazenamento local do dispositivo (*Sandboxed Storage*), nunca sendo enviados para a nuvem.

## **6\. Sustentabilidade, Governança e Impacto Econômico**

A viabilidade do projeto a longo prazo depende de um modelo econômico que transcenda o voluntarismo. A análise da proposta de *crowdfunding* ("pagar um café") revela potencial, mas também limitações de escala.

### **6.1. Monetização de Dados ESG (B2B)**

Empresas e grandes corporações têm metas de ESG (*Environmental, Social, and Governance*) e ODS cada vez mais rígidas. O projeto pode oferecer, como contrapartida a patrocínios corporativos, relatórios de impacto detalhados baseados nos dados coletados.

* **Produto de Dados:** Relatórios trimestrais sobre "Manchas de Demanda Social em Campinas", mostrando onde a fome e a falta de abrigo são mais críticas. Isso é valioso para direcionar ações de responsabilidade social corporativa (ex: uma rede de supermercados patrocinar a distribuição de alimentos em uma área identificada como "deserto alimentar" pelo app).

### **6.2. Gamificação da Doação Recorrente**

Para a sociedade civil, a mecânica de doação deve ser integrada ao ciclo de *feedback* do jogo.

* **Transparência Radical:** Ao finalizar uma sessão do jogo, o doador vê exatamente para onde o dinheiro vai (ex: "R$ 5,00 mantém o servidor de mapas no ar por 2 horas").  
* **Feedback de Impacto:** Enviar notificações mensais com métricas reais: "Graças aos apoiadores, este mês guiamos 500 pessoas para abrigos e 1.200 para refeições". Isso tangibiliza a doação e reduz a taxa de cancelamento (*churn*) dos apoiadores.3

## **7\. Conclusão e Recomendações Finais**

As propostas analisadas demonstram uma intenção nobre e inovadora de aplicar tecnologia para mitigar o sofrimento humano. No entanto, a análise técnica revela que a "Arquitetura da Invisibilidade", em sua concepção original baseada em IA generativa pesada (*Gemini Nano*), corre o risco de ser invisível justamente para quem mais precisa dela, devido às barreiras de hardware.

A reorientação para uma arquitetura **"Offline-First e Determinística"**, utilizando bancos de dados locais, lógica de regras simples e interfaces acessíveis (PWA, USSD), não é um retrocesso tecnológico, mas um avanço em sofisticação de engenharia social. Ao priorizar a robustez e a inclusão sobre o *hype* da IA, o projeto pode se tornar uma infraestrutura cívica vital.

A integração profunda com os ODS, transformando cada clique em um dado de demanda social, oferece um caminho para a sustentabilidade financeira e política do projeto. O jogo deixa de ser apenas uma simulação para se tornar um sensor vivo da cidade, dando voz — através de dados — àqueles que são frequentemente silenciados.

### **Tabela Consolidada de Recomendações Estruturais**

| Domínio | Proposta Original (Risco Identificado) | Recomendação Técnica (Solução) | Benefício Esperado |
| :---- | :---- | :---- | :---- |
| **Inteligência** | IA Generativa On-Device (Gemini Nano) | Árvores de Decisão (JSON) \+ Busca FTS | Compatibilidade com hardware antigo; economia crítica de bateria. |
| **Plataforma** | App Nativo / IA Agêntica | PWA (Web Progressivo) \+ Interfaces USSD/SMS | Acesso universal, inclusive sem internet ou smartphone. |
| **Dados** | Sincronização Genérica | Sync Incremental (Delta) \+ PouchDB | Resiliência a redes instáveis; menor consumo de dados móveis. |
| **Conteúdo** | Geração via IA (Alucinação) | Curadoria Humana \+ RAG (Base Confiável) | Precisão jurídica e segurança para o usuário vulnerável. |
| **ODS** | Não Detalhado | Telemetria de Eventos como Proxies ODS | Geração de métricas auditáveis para relatórios ESG e gestão pública. |

#### **Referências citadas**

1. Censo da População em Situação de Rua \- Campinas/SP 2024 \- Fundação FEAC, acessado em dezembro 16, 2025, [https://feac.org.br/wp-content/uploads/2025/06/Relatorio-Descritivo-e-Metodologico\_Versao\_25-10.pdf](https://feac.org.br/wp-content/uploads/2025/06/Relatorio-Descritivo-e-Metodologico_Versao_25-10.pdf)  
2. Campinas contabiliza no censo de 2024 cerca de 1300 moradores de rua, acessado em dezembro 16, 2025, [https://jat.jor.br/noticia/367/campinas-contabiliza-no-censo-de-2024-cerca-de-1300-moradores-de-rua](https://jat.jor.br/noticia/367/campinas-contabiliza-no-censo-de-2024-cerca-de-1300-moradores-de-rua)  
3. proposal\_2.txt  
4. População em situação de rua \- Portal PMC \- Administração, acessado em dezembro 16, 2025, [https://portal-api.campinas.sp.gov.br/sites/default/files/secretarias/arquivos-avulsos/7%20troque\_a\_esmola\_por\_cidadania.pdf](https://portal-api.campinas.sp.gov.br/sites/default/files/secretarias/arquivos-avulsos/7%20troque_a_esmola_por_cidadania.pdf)  
5. UX/UI Case Study — Helping Home App | by Robert Jesse | Medium, acessado em dezembro 16, 2025, [https://medium.com/@robertjesse\_78011/ux-ui-case-study-helping-home-app-a46925236105](https://medium.com/@robertjesse_78011/ux-ui-case-study-helping-home-app-a46925236105)  
6. Campinas amplia vagas em abrigos para pessoas em situação de rua, acessado em dezembro 16, 2025, [https://horacampinas.com.br/campinas-amplia-vagas-em-abrigos-para-pessoas-em-situacao-de-rua/](https://horacampinas.com.br/campinas-amplia-vagas-em-abrigos-para-pessoas-em-situacao-de-rua/)  
7. Making digital inclusion a reality for underserved communities in Brazil | Viasat, acessado em dezembro 16, 2025, [https://www.viasat.com/perspectives/corporate/2023/making-digital-inclusion-a-reality-for-underserved-communities-in-brazil/](https://www.viasat.com/perspectives/corporate/2023/making-digital-inclusion-a-reality-for-underserved-communities-in-brazil/)  
8. Mobile Phone, Computer, and Internet Use Among Older Homeless Adults: Results from the HOPE HOME Cohort Study, acessado em dezembro 16, 2025, [https://mhealth.jmir.org/2018/12/e10049/](https://mhealth.jmir.org/2018/12/e10049/)  
9. No Digital Divide? Technology Use among Homeless Adults \- PMC \- NIH, acessado em dezembro 16, 2025, [https://pmc.ncbi.nlm.nih.gov/articles/PMC6516785/](https://pmc.ncbi.nlm.nih.gov/articles/PMC6516785/)  
10. Five rules in designing for a vulnerable population | by Pablo Portilla del Valle, acessado em dezembro 16, 2025, [https://uxdesign.cc/five-rules-in-designing-for-a-vulnerable-population-c94c8bb0f047](https://uxdesign.cc/five-rules-in-designing-for-a-vulnerable-population-c94c8bb0f047)  
11. Digital technologies to achieve the UN SDGs \- ITU, acessado em dezembro 16, 2025, [https://www.itu.int/en/mediacentre/backgrounders/Pages/icts-to-achieve-the-united-nations-sustainable-development-goals.aspx](https://www.itu.int/en/mediacentre/backgrounders/Pages/icts-to-achieve-the-united-nations-sustainable-development-goals.aspx)  
12. Gemini Nano | AI \- Android Developers, acessado em dezembro 16, 2025, [https://developer.android.com/ai/gemini-nano](https://developer.android.com/ai/gemini-nano)  
13. Galaxy AI features and supported models | Samsung LEVANT, acessado em dezembro 16, 2025, [https://www.samsung.com/levant/support/mobile-devices/expanded-model-support-for-galaxy-ai-features/](https://www.samsung.com/levant/support/mobile-devices/expanded-model-support-for-galaxy-ai-features/)  
14. Gemini Nano Guide: Edge AI Computing for Banana Pi & Mobile 2025 \- LaoZhang-AI, acessado em dezembro 16, 2025, [https://blog.laozhang.ai/ai-technology/gemini-nano-edge-ai-guide/](https://blog.laozhang.ai/ai-technology/gemini-nano-edge-ai-guide/)  
15. Here are all the Gemini Nano features, and the phones that support them \- Android Authority, acessado em dezembro 16, 2025, [https://www.androidauthority.com/gemini-nano-features-devices-3490062/](https://www.androidauthority.com/gemini-nano-features-devices-3490062/)  
16. Google AI Edge SDK \- Android Developers, acessado em dezembro 16, 2025, [https://developer.android.com/ai/gemini-nano/ai-edge-sdk](https://developer.android.com/ai/gemini-nano/ai-edge-sdk)  
17. On-device GenAI APIs as part of ML Kit help you easily build with Gemini Nano, acessado em dezembro 16, 2025, [https://android-developers.googleblog.com/2025/05/on-device-gen-ai-apis-ml-kit-gemini-nano.html](https://android-developers.googleblog.com/2025/05/on-device-gen-ai-apis-ml-kit-gemini-nano.html)  
18. Battery consumption for billions | Build for Billions \- Android Developers, acessado em dezembro 16, 2025, [https://developer.android.com/docs/quality-guidelines/build-for-billions/battery-consumption](https://developer.android.com/docs/quality-guidelines/build-for-billions/battery-consumption)  
19. android \- Building Time and Energy Consumption App \- Stack Overflow, acessado em dezembro 16, 2025, [https://stackoverflow.com/questions/20651601/building-time-and-energy-consumption-app](https://stackoverflow.com/questions/20651601/building-time-and-energy-consumption-app)  
20. Google Antigravity IDE: A Beginner’s Guide | by proflead | Nov, 2025, acessado em dezembro 16, 2025, [https://medium.com/@proflead/google-antigravity-ide-a-beginners-guide-9ed319b6bc01](https://medium.com/@proflead/google-antigravity-ide-a-beginners-guide-9ed319b6bc01)  
21. acessado em dezembro 16, 2025, [https://en.wikipedia.org/wiki/Google\_Antigravity](https://en.wikipedia.org/wiki/Google_Antigravity)  
22. Build with Google Antigravity, our new agentic development platform, acessado em dezembro 16, 2025, [https://developers.googleblog.com/build-with-google-antigravity-our-new-agentic-development-platform/](https://developers.googleblog.com/build-with-google-antigravity-our-new-agentic-development-platform/)  
23. Google's Antigravity IDE Sparks Forking Debate \- Visual Studio Magazine, acessado em dezembro 16, 2025, [https://visualstudiomagazine.com/articles/2025/11/21/googles-antigravity-ide-sparks-forking-debate.aspx](https://visualstudiomagazine.com/articles/2025/11/21/googles-antigravity-ide-sparks-forking-debate.aspx)  
24. What are the restrictions of running a completely offline chatbot? \[closed\] \- Stack Overflow, acessado em dezembro 16, 2025, [https://stackoverflow.com/questions/59773157/what-are-the-restrictions-of-running-a-completely-offline-chatbot](https://stackoverflow.com/questions/59773157/what-are-the-restrictions-of-running-a-completely-offline-chatbot)  
25. What are some options for an offline chatbot on Android? \- Data Science Stack Exchange, acessado em dezembro 16, 2025, [https://datascience.stackexchange.com/questions/26967/what-are-some-options-for-an-offline-chatbot-on-android](https://datascience.stackexchange.com/questions/26967/what-are-some-options-for-an-offline-chatbot-on-android)  
26. Offline App Architecture: Benefits of Building Offline-First Apps \- Codiant, acessado em dezembro 16, 2025, [https://codiant.com/blog/build-offline-first-app-architecture/](https://codiant.com/blog/build-offline-first-app-architecture/)  
27. From Speed to Offline Access: Pros and Cons of PWA \- Xmethod, acessado em dezembro 16, 2025, [https://www.xmethod.de/blog/from-speed-to-offline-access-pros-and-cons-of-pwa](https://www.xmethod.de/blog/from-speed-to-offline-access-pros-and-cons-of-pwa)  
28. Offline-First Apps: Why Enterprises Are Prioritizing Data Sync Capabilities \- Octal IT Solution, acessado em dezembro 16, 2025, [https://www.octalsoftware.com/blog/offline-first-apps](https://www.octalsoftware.com/blog/offline-first-apps)  
29. Offline data \- PWA \- web.dev, acessado em dezembro 16, 2025, [https://web.dev/learn/pwa/offline-data](https://web.dev/learn/pwa/offline-data)  
30. Designing User-Friendly USSD Interface for Digital Financial Services, acessado em dezembro 16, 2025, [https://www.microsave.net/2017/04/07/designing-user-friendly-ussd-interface-for-digital-financial-services/](https://www.microsave.net/2017/04/07/designing-user-friendly-ussd-interface-for-digital-financial-services/)  
31. Ussd Menu, USSD API & Ussd Gateway Service \- Beem, acessado em dezembro 16, 2025, [https://beem.africa/ussd-api/](https://beem.africa/ussd-api/)  
32. Designing an Effective User Interface for USSD: Part2 \- MicroSave Consulting (MSC), acessado em dezembro 16, 2025, [https://www.microsave.net/2015/09/15/designing-an-effective-user-interface-for-ussd-part2/](https://www.microsave.net/2015/09/15/designing-an-effective-user-interface-for-ussd-part2/)  
33. Back to basics: Optimising UX for USSD applications | by Charity Mbaka | UX Collective, acessado em dezembro 16, 2025, [https://uxdesign.cc/back-to-basics-optimising-ux-for-ussd-applications-d7096cfb8c0f](https://uxdesign.cc/back-to-basics-optimising-ux-for-ussd-applications-d7096cfb8c0f)  
34. WhatsApp Business API Pricing 2025 (Country-wise Guide: India, US, UK, etc.) \- TryowBOT, acessado em dezembro 16, 2025, [https://tryowbot.com/blog/whatsapp-business-api-pricing-2025-country-wise-guide-india-us-uk/](https://tryowbot.com/blog/whatsapp-business-api-pricing-2025-country-wise-guide-india-us-uk/)  
35. WhatsApp Business API Pricing Updates (Effective July 1, 2025\) \- ControlHippo, acessado em dezembro 16, 2025, [https://controlhippo.com/blog/whatsapp/whatsapp-business-api-pricing-update/](https://controlhippo.com/blog/whatsapp/whatsapp-business-api-pricing-update/)  
36. SMS Pricing in Brazil for Text Messaging | Twilio, acessado em dezembro 16, 2025, [https://www.twilio.com/en-us/sms/pricing/br](https://www.twilio.com/en-us/sms/pricing/br)  
37. What are the best practices to design user interfaces that are going to be used under direct sunlight? \- UX Stack Exchange, acessado em dezembro 16, 2025, [https://ux.stackexchange.com/questions/134227/what-are-the-best-practices-to-design-user-interfaces-that-are-going-to-be-used](https://ux.stackexchange.com/questions/134227/what-are-the-best-practices-to-design-user-interfaces-that-are-going-to-be-used)  
38. What color scheme is best for sunlight readability? \[closed\] \- Stack Overflow, acessado em dezembro 16, 2025, [https://stackoverflow.com/questions/5155903/what-color-scheme-is-best-for-sunlight-readability](https://stackoverflow.com/questions/5155903/what-color-scheme-is-best-for-sunlight-readability)  
39. How to Design Apps for Better Battery Efficiency | Sidekick Interactive, acessado em dezembro 16, 2025, [https://www.sidekickinteractive.com/mobile-app-strategy/how-to-design-apps-for-better-battery-efficiency/](https://www.sidekickinteractive.com/mobile-app-strategy/how-to-design-apps-for-better-battery-efficiency/)  
40. Dados Abertos SP: Bem vindo, acessado em dezembro 16, 2025, [https://dadosabertos.sp.gov.br/](https://dadosabertos.sp.gov.br/)  
41. API de Dados \- Portal da Transparência do Governo Federal, acessado em dezembro 16, 2025, [https://portaldatransparencia.gov.br/api-de-dados](https://portaldatransparencia.gov.br/api-de-dados)  
42. Portal PMC \- Administração \- Prefeitura Municipal de Campinas, acessado em dezembro 16, 2025, [https://portal-api.campinas.sp.gov.br/sites/default/files/secretarias/arquivos-avulsos/131/2025/07/28-095400/Edital\_02.2025\_Abrigo\_Crianca\_e\_Adolescente.pdf](https://portal-api.campinas.sp.gov.br/sites/default/files/secretarias/arquivos-avulsos/131/2025/07/28-095400/Edital_02.2025_Abrigo_Crianca_e_Adolescente.pdf)  
43. FRAMEWORK DE ADEQUAÇÃO DE BANCOS DE DADOS LEGADOS À LEI GERAL DE PROTEÇÃO DE DADOS PESSOAIS (LGPD): UM ESTUDO PARA ÓRGÃOS \- Repositório Institucional da ENAP, acessado em dezembro 16, 2025, [https://repositorio.enap.gov.br/bitstream/1/8369/1/10941-Texto%20do%20Artigo-34656-1-10-20241226.pdf](https://repositorio.enap.gov.br/bitstream/1/8369/1/10941-Texto%20do%20Artigo-34656-1-10-20241226.pdf)  
44. Frequently Asked Questions: By-Name Data and Privacy \- Community Solutions, acessado em dezembro 16, 2025, [https://community.solutions/how-is-privacy-addressed-with-by-name-homlessness-data/](https://community.solutions/how-is-privacy-addressed-with-by-name-homlessness-data/)  
45. What Research Says About Gamification and Sustainability | Council Fire, acessado em dezembro 16, 2025, [https://www.councilfire.org/guides/what-research-says-about-gamification-and-sustainability/](https://www.councilfire.org/guides/what-research-says-about-gamification-and-sustainability/)