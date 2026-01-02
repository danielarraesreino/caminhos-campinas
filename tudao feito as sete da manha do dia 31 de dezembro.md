# Coletivo A Rua Tem Voz - Textos do Projeto
Extraído em: 31 de Dezembro de 2024

---

## 1. Landing Page (Início)
**Caminho:** `src/features/ui/LandingPage.tsx`

### Hero Section
*   **Tagline:** "Serious Game & Tecnologia Social"
*   **Título:** "A Invisibilidade é uma Escolha?"
*   **Subtítulo:** "Entre na pele de quem vive nas ruas de Campinas. Simule dilemas reais, entenda a luta por dignidade e transforme sua empatia em impacto real."
*   **Botão (Novo Jogo):** "Começar Nova História"
*   **Botão (Continuar):** "Continuar Jornada"
*   **Botão (Ajuda):** "Preciso de Ajuda Agora"
*   **Versão:** "v0.1.0 Beta • Campinas, SP"

### Avatar Showcase
*   **Citação:** "A cor da pele, o gênero e o tempo de rua alteram a dificuldade do jogo. Assim como na vida."
*   **Tag:** "Simulação Baseada em Dados"

### Fundamentação Teórica
*   **Tag:** "Fundamentação Teórica"
*   **Título:** "Denunciar Práticas Brutais. Legitimar o Pertencimento."
*   **Texto:** "Segundo **Santos (2006)**, a pobreza estrutural no Brasil é uma dívida social deliberada. Nosso projeto atua na intersecção entre a tecnologia e a consciência libertadora de **Paulo Freire**, transformando o "invisível" em um sujeito ativo de sua própria história."
*   **Ponto 1 (Combate à Desafiliação):** "Reconstrução de vínculos em estruturas que fazem sentido para a vida."
*   **Ponto 2 (Apartação Social):** "O reconhecimento do outro como um semelhante, não apenas um objeto de caridade."

### Portal do Parceiro Institucional
*   **Título:** "Portal do Parceiro Institucional"
*   **Descrição:** "Para gestores públicos, empresas ESG e acadêmicos. Acesse a telemetria em tempo real das violações de direitos e demandas por ODS em Campinas."
*   **Botão:** "Acessar Dashboard de Impacto"
*   **Nota:** "Dados processados via Protocolo Anti-Chacina (K-5)"

### Funcionalidades
*   **Jornada da Autonomia:** "Um utilitário gamificado que transforma a burocracia em missões claras. O app orienta onde comer, como tirar documentos e onde encontrar abrigo, oferecendo recompensas reais por cada passo de autonomia conquistado."
*   **Simulador de Empatia:** "Colocamos a sociedade civil diante da **desqualificação social** (Gohn, 2021). O jogo combate o estigma ao humanizar os dilemas de quem vive à margem, gerando consciência universal."
*   **Cofre Digital:** "Armazenamento seguro de documentos digitalizados na nuvem, evitando a perda recorrente de RG e CPF."
*   **Mapa de Calor Solidário:** "Mostra em tempo real onde há excesso ou falta de doações na cidade, otimizando a logística da caridade."
*   **IA Generativa:** "Uso de IA para traduzir 'juridiquês' de editais e leis em linguagem simples e acessível."

### Mapa Section
*   **Tag:** "Geolocalização Social"
*   **Título:** "Mapa de Apoio Campinas"
*   **Descrição:** "Encontre abrigos, restaurantes populares (Bom Prato), unidades de saúde e pontos de Wi-Fi livre em tempo real. Uma cartografia da sobrevivência e da solidariedade."
*   **Botão:** "Explorar Mapa Interativo no Jogo"

### AI Demo Section
*   **Tag:** "Powered by Groq API (Llama 3.3)"
*   **Título:** "Teste o Simulador de Empatia"
*   **Descrição:** "Experimente agora uma versão simplificada do nosso motor de narrativa. A IA gera um dilema real e reage às suas decisões, demonstrando a complexidade da vida nas ruas."
*   **Botão:** "Gerar Dilema Real"
*   **Nota:** "* As situações são baseadas em dados reais do Censo Pop Rua 2024."

### Tecnologia Section
*   **Título:** "Inovação Social com Custo Eficiente"
*   **Descrição:** "Diferente de apps tradicionais que custam milhões, construímos esta plataforma usando **Inteligência Artificial** como alavanca de autonomia. Eu não sabia programar, mas sabia o que precisava ser feito. A tecnologia me deu a liberdade de criar."
*   **Ponto 1:** "**Autonomia Real:** Orquestrado por quem vive a realidade, sem depender de grandes equipes de TI ou burocracia."
*   **Ponto 2:** "**Código como Ferramenta de Poder:** A tecnologia deve servir para emancipação. Se eu consegui, nós conseguimos."
*   **Ponto 3:** "**Acessibilidade Nativa:** Construído para rodar em qualquer celular, porque a informação é um direito de todos."
*   **Proposta ESG:** "Para empresas parceiras, oferecemos relatórios de impacto social baseados em dados reais, alinhados aos ODS da ONU, perfeitos para compor balanços de sustentabilidade."
*   **Botão:** "Seja um Parceiro Corporativo"

### Doação Section
*   **Tag:** "Faça a Diferença"
*   **Título:** "Ajude a tirar esse projeto do papel"
*   **Descrição:** "Sua doação financia o desenvolvimento, a infraestrutura de nuvem e as ações de campo do Coletivo A Rua Tem Voz."

---

## 2. Jogo / Simulador
**Caminho:** `src/app/jogar/page.tsx` e componentes

### Interface Geral
*   **Header:** "Setor de Sobrevivência"
*   **Mensagem Bateria Baixa:** "Sem bateria. Você está digitalmente invisível. Sem celular, você não tem acesso a mapas ou auxílio digital."

### Tutorial (Onboarding)
**Caminho:** `src/features/ui/OnboardingTutorial.tsx`
1.  **Bem-vindo às Ruas:** "Este é um Serious Game sobre a realidade da população em situação de rua em Campinas. Seu objetivo não é apenas sobreviver, mas reconquistar sua cidadania."
2.  **Sobrevivência Diária:** "Monitore seus sinais vitais no topo da tela: Fome, Energia, Higiene e Integridade Física. Se algum chegar a zero, você corre riscos graves."
3.  **Plano de Cidadania (PDU):** "Acompanhe seu progresso na barra 'Plano de Vida'. Você começa pela Sobrevivência e deve buscar Documentos (RG/CPF), Benefícios e Autonomia (Trabalho)."
4.  **Sua Voz Importa:** "Use o Chat para interagir. Você pode DIGITAR ou FALAR (ícone de microfone). Sua voz é transcrita e enviada para análise para criar respostas mais reais."
5.  **Contribua com a Realidade:** "O jogo é alimentado por histórias reais. Você pode submeter dilemas que vivenciou ou presenciou para enriquecer a simulação e ajudar na conscientização."

### Chat
**Caminho:** `src/features/ui/GameChat.tsx`
*   **Indicador:** "Chat de Interação (Voz Ativa)"
*   **Intro:** "Você acorda na Praça do Rosário. Fale ou digite sua necessidade. ex: 'Estou com fome', 'Preciso de médico'"

---

## 3. Dilemas (Banco de Dados)
**Caminho:** `src/data/dilemmas-campinas.json`

### Lista de Dilemas e Opções

#### 1. A Abordagem Policial (Identidade)
*   **Situação:** "Você está dormindo na Praça do Rosário. Às 3h da manhã, a GM te acorda com chutes leves. 'Documento, agora!'. Você não tem RG."
*   **Opção A:** "Argumentar (Citar Lei)" -> "Eles riem. 'Lei é pra cidadão'. Te revistam e levam seu cobertor."
*   **Opção B:** "Obedecer em Silêncio" -> "Eles te revistam. 'Sai daqui, vagabundo'. Você sai ileso, mas humilhado."

#### 2. O Risco da Chuva
*   **Situação:** "Começa uma tempestade forte. Você tem apenas papelão. O viaduto Cury está lotado, mas seco."
*   **Opção A:** "Disputar lugar no Viaduto" -> "Você conseguiu um canto seco, mas teve que brigar. Perdeu energia."
*   **Opção B:** "Ficar na Chuva (Marquise)" -> "Você ficou molhado a noite toda. Risco de hipotermia/doença."

#### 3. Higiene vs Fome
*   **Situação:** "Você tem R$ 5,00. Dá para comprar um PF barato (Sopa) ou um sabonete e lâmina para tentar um bico amanhã."
*   **Opção A:** "Comer (Matar a fome)" -> "Barriga cheia, mas você está sujo. Ninguém te dará trabalho amanhã."
*   **Opção B:** "Investir na Aparência" -> "Você está limpo, mas fraco de fome. A chance de trabalho aumentou."

#### 4. O Furto Noturno
*   **Situação:** "Você cochilou por 10 minutos. Ao acordar, seu par de tênis sumiu. Você está descalço no asfalto quente."
*   **Opção A:** "Procurar (Confronto)" -> "Você achou quem roubou. É um 'irmão' maior que você. O confronto é perigoso."
*   **Opção B:** "Improvisar (Papelão/Pano)" -> "Você amarrou panos nos pés. Protege pouco, e a dignidade cai a zero."

#### 5. O Cachorro Ferido
*   **Situação:** "Seu único companheiro, o vira-lata 'Caramelo', cortou a pata e está sangrando. O veterinário público é longe."
*   **Opção A:** "Carregar ele (Gastar Energia)" -> "Você andou 5km com ele no colo. Ele foi atendido. Sua humanidade foi restaurada."
*   **Opção B:** "Ignorar (Sobrevivência)" -> "Você deixou ele para trás. A culpa te consome. Sua sanidade mental cai."

#### 6. A Proposta Indecente
*   **Situação:** "Um carro de luxo para. O motorista oferece R$ 50,00 para você fazer algo que fere seus princípios."
*   **Opção A:** "Aceitar (Dinheiro Fácil)" -> "Você tem dinheiro agora, mas se sente sujo por dentro. Dano moral grave."
*   **Opção B:** "Recusar (Dignidade)" -> "Você xingou o motorista. Ele foi embora. Você continua pobre, mas integro."

#### 7. O Banho Gelado (Centro Pop)
*   **Situação:** "No Centro Pop, a água do chuveiro está gelada (inverno). A fila é enorme e o tempo é curto (5min)."
*   **Opção A:** "Encarar o gelo" -> "Choque térmico, mas você está limpo. Sua saúde oscila."
*   **Opção B:** "Pular o banho (Gato)" -> "Você só lavou o rosto. O cheiro permanece. Higiene baixa."

#### 8. A Burocracia do CRAS
*   **Situação:** "Você precisa se cadastrar no CadÚnico. A atendente diz que 'o sistema caiu' e pede para voltar amanhã."
*   **Opção A:** "Esperar sentado o dia todo" -> "O sistema voltou às 16h. Você foi atendido! Mas perdeu o almoço no Bom Prato."
*   **Opção B:** "Ir embora e tentar outro dia" -> "Você garantiu o almoço, mas continua sem cadastro (invisível)."

#### 9. O Jato d'Água (Limpeza Urbana)
*   **Situação:** "O caminhão pipa da prefeitura chega lavando a calçada onde você dorme. Eles não avisam. É jato d'água em você e nas suas coisas."
*   **Opção A:** "Proteger os documentos" -> "Você salvou o RG, mas suas roupas molharam. Risco de doença."
*   **Opção B:** "Xingar/Enfrentar" -> "Eles chamaram a GM. Você apanhou e se molhou igual. Revolta total."

#### 10. A Notificação do Auxílio
*   **Situação:** "Você ouve na rua que o cadastro para o novo Auxílio Municipal abriu. É preciso baixar o app 'Campinas Digital' até as 17h. Sua bateria está em 4%."
*   **Opção A:** "Gastar R$ 5,00 (Lan House)" -> "Cadastro realizado! Você tem o protocolo. Mas lá se foi o dinheiro do jantar."
*   **Opção B:** "Arriscar Tomada Terminal" -> "Você conectou o carregador. O segurança te viu imediatamente."

#### 11. O Jantar Perdido
*   **Situação:** "Você fez o cadastro, mas gastou o dinheiro da comida. A noite caiu e o Bom Prato (R$ 1,00) já fechou. A fome dói (38,5% ficam um dia sem comer)."
*   **Opção A:** "Revirar Lixo (Cambuí)" -> "Achou restos de um restaurante chique. Matou a fome, mas a humilhação é amarga."
*   **Opção B:** "Dormir com fome" -> "A dor no estômago impediu um sono profundo. Amanhã será difícil."

#### 12. O Segurança (Guarda Privada)
*   **Situação:** "O segurança do terminal te vê usando a tomada. Ele diz que é 'furto de energia' e ameaça chamar a GM."
*   **Opção A:** "Sair correndo (Fuga)" -> "Você correu e escapou, mas perdeu a chance do cadastro e gastou energia vital."
*   **Opção B:** "Argumentar (Cidadania)" -> "Você citou seus direitos. Ele bufou e deixou você carregar por 10 minutos. Deu tempo!"

#### 13. O Grande Achado
*   **Situação:** "Você encontra uma caçamba de obra com muito cobre e alumínio. É pesado, vai lotar o carrinho e dificultar a mobilidade."
*   **Opção A:** "Pegar tudo (Sobrecarga)" -> "Carrinho lotado! Potencial de lucro alto (+R$ 50), mas você está muito lento e visível."
*   **Opção B:** "Pegar só o leve" -> "Garantiu R$ 10,00 sem chamar atenção ou se cansar demais."

#### 14. A Blitz da Limpeza Urbana
*   **Situação:** "Com o carrinho transbordando no Centro, um caminhão da 'Operação Cidade Limpa' e a GM te param. Alegam obstrução da via."
*   **Opção A:** "Entregar material" -> "Você entregou o cobre para não perder o carrinho. Todo o esforço foi em vão."
*   **Opção B:** "Resistir" -> "Milagrosamente, desistiram da apreensão pela pressão de populares filmando."

#### 15. A Ferida no Pé
*   **Situação:** "O tênis doado é apertado. Uma bolha estourou e infeccionou. Você mal consegue andar (Saúde < 40)."
*   **Opção A:** "Ir à UPA" -> "Você caminha com dor até a unidade de saúde."
*   **Opção B:** "Automedicação (Cachaça)" -> "A dor sumiu, mas a ferida parece pior. Pelo menos consegue dormir."

#### 16. O Comprovante de Residência
*   **Situação:** "Na UPA, a recepcionista pede cartão do SUS e comprovante de endereço. Você diz que mora na rua. Ela hesita."
*   **Opção A:** "Insistir na Lei" -> "Você citou a Portaria do SUS. Ela te atendeu na hora, envergonhada."
*   **Opção B:** "Endereço Falso/Abrigo" -> "Funcionou. O sistema aceitou e você foi atendido."

#### 17. O Custo da Fome (Bom Prato)
*   **Situação:** "O cheiro de feijão do Bom Prato é inebriante. A fila anda. Você tateia o bolso e só encontra 40 centavos. A refeição custa R$ 1,00."
*   **Opção A:** "Pedir uma moeda na fila" -> "Alguém te deu R$ 1,00. Você comeu com dignidade."
*   **Opção B:** "Revirar lixo do Mercado" -> "Você encontrou frutas passadas. Enganou a fome, mas se sentiu observado."

#### 18. A Barreira da Carroça (SAMIM)
*   **Situação:** "O portão do SAMIM está aberto, mas o segurança aponta para o seu carrinho. 'Isso não entra. Regra da casa'. Lá dentro tem banho e cama. Fora, tem sua única fonte de renda."
*   **Opção A:** "Dormir na calçada vigiando" -> "Noite tensa. Você acordou com dor nas costas, mas o carrinho está lá."
*   **Opção B:** "Abandonar o carrinho (Entrar)" -> "Banho quente e cama limpa. Mas amanhã você começa do zero."

#### 19. Invisibilidade Digital (Poupatempo)
*   **Situação:** "Você precisa agendar a 2ª via do RG para conseguir o emprego. O atendente diz: 'O agendamento é só pelo app'. Seu celular pisca 1% e apaga."
*   **Opção A:** "Desistir por hoje" -> "Você sai da fila frustrado. Mais um dia perdido."
*   **Opção B:** "Procurar tomada na Rodoviária" -> "Você andou até a Rodoviária e conseguiu carga. Mas perdeu a manhã inteira."

---

## 4. Recursos e Serviços
**Caminho:** `src/app/recursos/page.tsx` + `src/data/services-campinas.json`

### Categorias Principais
*   **Alimentação:** Bom Prato, Restaurantes Populares
*   **Saúde:** Consultório na Rua, UPA
*   **Documentos:** Poupatempo, CRAS
*   **Dormir/Abrigo:** SAMIM, Albergues
*   **Formação/Educação:** Bolsas, Cursos

### Lista de Serviços (Base de Dados)
1.  **Bom Prato (Centro):** "Café a R$ 0,50 e Almoço a R$ 1,00. Chegar cedo."
2.  **Samim (Albergue):** "Banho e pernoite. Exige cadastro prévio até as 17h. Não aceita carroças."
3.  **Consultório na Rua:** "Atendimento médico móvel. Focado em redução de danos e curativos."
4.  **Poupatempo:** "Emissão de documentos (RG, Carteira de Trabalho). Necessário agendamento."
5.  **Casa da Cidadania:** "Advocacia gratuita e apoio jurídico para população de rua."
6.  **Cras (Centro):** "Cadastro Único (CadÚnico) para benefícios sociais."

### Mensagens do Sistema
*   **Offline:** "MODO OFFLINE" - "Conectado"
*   **Emergência:** "Emergência Médica? Ligue 192"

---

## 5. Dashboard de Impacto
**Caminho:** `src/app/impacto/page.tsx`

### Cabeçalho
*   **Título:** "Painel de Inteligência Social"
*   **Subtítulo:** "Simulação baseada no Censo Pop. Rua Campinas 2024 (1.557 pessoas mapeadas)"

### KPIs (Indicadores)
1.  **População Mapeada:** "Vidas simuladas hoje"
2.  **Déficit Habitacional:** "Dormindo na rua hoje (ODS 11)" - Alerta
3.  **Risco de Fome:** "Sem acesso a refeição (ODS 2)"
4.  **Crise Sanitária:** "Sem acesso a banheiro (ODS 6)" - Alerta
5.  **Dignidade Menstrual:** "Mulheres sem insumos (ODS 3)"
6.  **Recorte Racial:** "Pretos ou Pardos (Desigualdade)"

### Análises
*   **Capacidade de Acolhimento:** "Demanda Real: 1.557 Pessoas vs Vagas Disponíveis (SAMIM + OSCs): ~300 Vagas. 1.257 pessoas sem vaga garantida esta noite."
*   **Alerta Sanitário:** "X% da população simulada foi forçada a usar a rua para necessidades fisiológicas hoje, devido a barreiras em comércios e falta de banheiros públicos 24h."
*   **Crítico:** "O sistema detectou que a 'Barreira do RG' impede 19% da população de acessar o Bom Prato."
*   **Oportunidade:** "O 'Consultório na Rua' é o serviço mais eficaz para reduzir danos, mas opera com apenas 3 equipes para 1.557 pessoas."

---

## 6. Apoie a Causa
**Caminho:** `src/app/apoie/page.tsx`

### Hero
*   **Campanha:** "Campanha 'A Rua Tem Voz'"
*   **Título:** "Você passa por eles todos os dias. Agora você vai entender a jornada."
*   **Texto:** "O 'Caminhos Campinas' não é apenas um jogo. É uma janela para a realidade de 1.557 pessoas que vivem nas ruas da nossa cidade."

### Destino dos Recursos
1.  **Tecnologia Social:** Manutenção do servidor e IA (Chatbot de voz).
2.  **Educação:** Bolsa-Formação para 29 educadores sociais (ex-população de rua).
3.  **Inteligência de Dados:** Monitoramento de violações de direitos para políticas públicas.

### Opções de Doação
*   **Link Recorrente:** "Campanha no Apoia.se" - `https://apoia.se/coletivoaruatemvoz`
*   **PIX:** Chave `19999912915` (Daniel Arraes Reino / Banco Neon)

### Níveis de Impacto
1.  **R$ 30 - Apoio Conectado:** "Ajuda a manter a plataforma do Coletivo no ar."
2.  **R$ 50 - Kit Cidadania:** "Equivale ao custo de ajudar uma pessoa a tirar a 2ª via do RG (taxas + fotos + transporte)."
3.  **R$ 100 - Rede Fortalecida:** "Apoia a logística dos voluntários parceiros na distribuição de kits."

### Apoio Institucional
*   **Parceiro Mantenedor:** "Para empresas que querem fortalecer sua agenda ESG."
*   **Apoio Técnico (Pro Bono):** "Doar horas de desenvolvimento, design ou infraestrutura."

---

## 7. Hub de Parceiros
**Caminho:** `src/app/hub/cadastro/page.tsx`

*   **Título:** "Hub de Parceiros"
*   **Chamada:** "Junte-se à Rede. Coletivos, ONGs e Movimentos Sociais: cadastrem-se para aparecer no mapa e receber doações diretas."
*   **Campos:** Nome do Coletivo, Área de Atuação (Alimentação, Higiene, Jurídico, Saúde, Acolhimento), WhatsApp, Chave Pix.

---

## 8. Sobre o Projeto
**Caminho:** `src/app/sobre/page.tsx`

*   **Manifesto:** "Tecnologia Social para dar voz, visibilidade e dignidade."
*   **Para quem joga:** "Sentir na pele os dilemas diários."
*   **Para quem vive:** "Funciona como um mapa offline real conectando serviços essenciais."
*   **Citação:** "'Não olhe para o outro lado. Olhe nos olhos.'"
*   **Tecnologia:** "PWA (Progressive Web App) para rodar em qualquer celular, otimizado para baixo consumo de dados e funcionamento offline."

---

## 9. Transparência
**Caminho:** `src/app/transparencia/page.tsx`

*   **Status:** "Este projeto ainda não está operando. Nossa missão agora é captar recursos para viabilizar a primeira turma piloto."
*   **Meta Financeira:** R$ 13.970,00 (Custeio total do Projeto Piloto).
*   **Metas de Impacto:**
    *   20 Jovens Capacitados
    *   02 Educadores Sociais contratados
    *   Início previsto: Q1 2026

### Detalhamento do Orçamento
*   **RH:** R$ 6.720,00 (Coordenadores + Educadores)
*   **Logística/Materiais:** R$ 7.250,00 (Alimentação, Material Didático, Transporte)

---

## 10. Glossário
**Caminho:** `src/data/glossary.json`

*   **Bom Prato:** "Programa estadual de restaurantes populares com refeições a R$ 1,00. Essencial para a segurança alimentar da população de rua."
*   **CadÚnico:** "Cadastro Único para Programas Sociais. Porta de entrada para benefícios como Bolsa Família e Tarifa Social."
*   **Centro Pop:** "Centro de Referência Especializado para População em Situação de Rua. Oferece serviços sociais, higiene e alimentação durante o dia."
*   **Consultório na Rua:** "Estratégia do SUS para ampliar o acesso da população de rua aos serviços de saúde, com equipes itinerantes."
*   **Poupatempo:** "Postos de atendimento do governo de SP que reúnem diversos serviços públicos, como emissão de RG e Carteira de Trabalho."
*   **SAMIM:** "Serviço de Atendimento ao Migrante, Itinerante e Mendicante. Principal albergue municipal de Campinas."
*   **Reciclagem:** "Coleta de materiais recicláveis como fonte de renda. Atividade comum e vital, porém desgastante e mal remunerada."
*   **Guarda Municipal (GM):** "Força de segurança municipal. Frequentemente envolvida em ações de zeladoria que resultam em conflitos e perda de pertences."
