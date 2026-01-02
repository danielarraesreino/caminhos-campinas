# CONTEXTO MESTRE: CAMINHOS CAMPINAS (SERIOUS GAME)

ATENÇÃO: Você está atuando como Arquiteto de Software Sênior para um projeto de Tecnologia Social Crítica.

## 1. A Realidade Material (Não Alucine)
Este não é um jogo comum. É um simulador baseado estritamente no Censo Pop Rua 2024 de Campinas.
- **Público:** Pessoas com dispositivos Android antigos (8/9), bateria viciada e sem dados móveis [11].
- **Regra de Ouro:** OFFLINE-FIRST. Tudo deve funcionar sem rede. Use PouchDB para tudo. Se a rede cair, o jogo continua [1].
- **Economia:** 70% da população trabalha (reciclagem, bicos). Não crie mecânicas que forcem a mendicância como única saída [12].

## 2. A Stack Técnica (Imutável)
- Frontend: Next.js 15 (App Router)
- Estilo: Tailwind CSS (foco em alto contraste e economia de bateria - Dark Mode default) [13]
- Dados Locais: PouchDB (sincronizando com CouchDB/n8n apenas quando houver Wi-Fi)
- Mapas: Leaflet (com tiles em cache local)

## 3. Problemas Críticos a Resolver Agora (Logs de Erro)
1. **Service Worker:** Estamos com erro `Failed to execute 'clone' on 'Response'` no `sw.js` [7]. Isso impede o cache offline. Prioridade máxima.
2. **Hidratação:** O estado do jogo (`gameState`) precisa ser salvo no `localStorage`/`IndexedDB` a cada decisão crítica para evitar perda de progresso se a bateria morrer.

## 4. Novas Mecânicas Obrigatórias (Baseadas no Censo)
1. **Sistema de Bateria:** Adicionar um atributo `battery` ao `GameState`. Se `battery <= 0`, bloquear acesso ao Mapa e ao Chat [2].
2. **Dilema da Carroça:** O abrigo SAMIM proíbe entrada de carroças. O jogador deve escolher: dormir no abrigo (perde a ferramenta de trabalho) ou dormir na rua (risco de saúde/segurança) [14].

--------------------------------------------------------------------------------
Roteiro de Execução para o Agente
Agora, dê os comandos sequenciais. Não peça tudo de uma vez.
Comando 1 (Estabilidade):
"@workspace Analise o arquivo public/sw.js e os logs de erro fornecidos. Corrija o problema de clonagem de resposta (response.clone()) para garantir que o cache offline funcione sem quebrar a aplicação. Isso é pré-requisito para todo o resto."
Comando 2 (Mecânica de Bateria - Fonte):
"@workspace No arquivo src/contexts/GameContext.tsx, adicione phoneBattery ao estado inicial. No useGameLoop.ts, faça a bateria decair 1% a cada 'hora' de jogo. Se a bateria zerar, acione um estado isDigitalExcluded que desabilita o componente SurvivalMap e o GameChat, forçando o jogador a procurar um ponto de recarga (Tomada)."
Comando 3 (Dilemas Reais - Fonte):
"@workspace Atualize o arquivo src/features/game-loop/dilemmas.ts. Substitua os dilemas genéricos por estes baseados no Censo:
1. Barreira do SAMIM: Gatilho: Estar perto do abrigo com item 'Carroça'. Escolha: Entrar (perde carroça) ou Ficar fora (dano de frio).
2. Bico de Reciclagem: Gatilho: Ter 'Carroça'. Ação: Trabalhar. Resultado: +Dinheiro, -Energia, +Dignidade (conforme fonte)."
Comando 4 (Telemetria para FEAC - Fonte):
"@workspace Crie um serviço src/services/TelemetryService.ts. Ele deve gravar eventos de 'Violação de Direitos' (ex: quando o jogador é barrado no abrigo). Esses dados devem ser salvos localmente no PouchDB e, apenas quando houver Wi-Fi, enviados para o endpoint /api/metrics."
