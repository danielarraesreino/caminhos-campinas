# Guia da Wiki Viva: O Código é a Rua

> "O *Caminhos Campinas* não é um projeto estático. É um organismo vivo que respira a realidade das ruas."

## Manifesto de Colaboração

O código deste projeto serve como uma **base de conhecimento aberta** para mapear a exclusão e a resiliência em Campinas. Diferente de softwares tradicionais, aqui um "bug" pode ser uma violação de direitos humanos que precisa ser documentada, e uma "feature" pode ser uma nova estratégia de redução de danos descoberta no campo.

### O que é a Wiki Viva?

É o cérebro do jogo. Cada dilema, cada local (Nodes), cada recurso mapeado no simulador deve refletir a verdade do território. Se o jogo diz que há um sopão às 18h no largo do Rosário, é porque essa realidade existe ou existiu.

## Como Você Pode Colaborar?

Não precisa saber programar. A "Rua" é o código.

### 1. Validação de Campo (Para Profissionais e Viventes)
Você trabalha no CAPS, Consultório na Rua, ou vive a realidade?
*   **Abra uma Issue** se um dilema estiver irreal.
*   *Exemplo:* "No jogo, o abrigo aceita cachorro, mas na realidade o Samim barra a entrada de animais. Corrigir para refletir a barreira de acesso."

### 2. Mapeamento de Arquitetura Hostil
Viu bancos sendo removidos, pedras colocadas sob viadutos ou grades novas?
*   Isso é **Arquitetura Hostil**.
*   Tire uma foto e suba como sugestão de "Evento de Negação" no jogo. O jogo deve punir o jogador quando ele tenta descansar nesses locais, educando sobre essa violência urbana.

### 3. Tradução de Juridiquês
Ajude a traduzir decretos e leis (como a Lei Padre Júlio Lancellotti) para a linguagem da rua.
*   Transformamos leis em "Dilemas" ou "Itens" que o jogador pode usar para se defender (ex: "Carta de Direitos").

## Estrutura de Dados

Para devs, os dados da realidade estão em:
*   `src/data/reality-nodes.json`: Locais reais e seus atributos.
*   `src/data/dilemmas-campinas.json`: Situações baseadas em relatos reais.

---
**Caminhos Campinas** - Tecnologia Social & Dados Abertos.
*Todo commit é um ato de cidadania.*
