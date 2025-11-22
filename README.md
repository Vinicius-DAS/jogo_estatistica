# Laboratório de Dados e Estatística

> Um simulador interativo para explorar a **Simulação de Monte Carlo**, a **Lei dos Grandes Números** e o comportamento de eventos aleatórios em tempo real.

![Status do Projeto](https://img.shields.io/badge/Status-Concluído-success)
![Tecnologias](https://img.shields.io/badge/Tech-HTML%20%7C%20CSS%20%7C%20JS-blueviolet)

## Sobre o Projeto

Este projeto foi desenvolvido como parte da disciplina de Estatística. O objetivo é demonstrar visualmente como a aleatoriedade (sorte/azar) se comporta em pequenas amostras versus como ela converge para probabilidades matemáticas exatas em grandes amostras.

O jogo coloca o usuário contra um "Robô" em disputas de dados, permitindo desde jogadas manuais até simulações massivas de milhares de partidas em segundos, exibindo os resultados em um dashboard moderno.

## Funcionalidades

* ** Modos de Jogo:**
    * **Manual:** Jogue rodada a rodada para sentir a variância de curto prazo.
    * **Simulação (Monte Carlo):** Rode 1.000+ partidas instantaneamente para ver a "mágica" da estatística.
* ** Customização Total:**
    * Escolha a quantidade de dados (N).
    * Escolha o tipo de dado (D4, D6, D8, D10, D12, D20).
* ** Visualização de Dados em Tempo Real:**
    * **Histograma de Distribuição:** Compara os resultados reais com a Curva Teórica (Gaussiana/Normal).
    * **Gráfico de Convergência:** Mostra as taxas de vitória se estabilizando ao longo do tempo.
    * **KPIs:** Painel com médias, desvio padrão e porcentagens de vitória/derrota.
* ** Probabilidade Condicional:** Calculadora interativa de $P(A|B)$ baseada nos dados gerados.

## Conceitos Estatísticos Aplicados

O projeto não é apenas um jogo, é uma prova visual de conceitos fundamentais:

### 1. Lei dos Grandes Números
Observada no **Gráfico de Convergência**.
* **No início (poucas jogadas):** As linhas de vitória/derrota oscilam violentamente (o caos da sorte).
* **No fim (muitas jogadas):** As linhas se tornam retas e estáveis, convergindo para a probabilidade real esperada (a ordem matemática).

### 2. Teorema do Limite Central
Observado no **Histograma de Distribuição**.
* Ao somar os resultados de vários dados, a distribuição dos resultados empíricos (barras) se molda perfeitamente sob a curva de sino teórica (linha dourada), formando uma Distribuição Normal.

### 3. Simulação de Monte Carlo
* Utilizamos força bruta computacional para realizar milhares de experimentos aleatórios e obter resultados numéricos aproximados para problemas de probabilidade que seriam difíceis de calcular manualmente em tempo real.

## Como Executar

Não é necessária nenhuma instalação complexa (npm, node, etc). O projeto utiliza tecnologias web nativas.

1.  Baixe os arquivos do projeto.
2.  Certifique-se de que os três arquivos essenciais estejam na mesma pasta:
    * `index.html`
    * `style.css`
    * `script.js`
3.  Abra o arquivo `index.html` em qualquer navegador moderno (Chrome, Edge, Firefox, Safari).
4.  **Nota:** É necessário conexão com a internet para carregar a biblioteca de gráficos *Chart.js* e as fontes do Google.

## 🛠️ Tecnologias Utilizadas

* **HTML5:** Estrutura semântica.
* **CSS3:** Design moderno, responsivo, uso de Flexbox/Grid, Variáveis CSS e Glassmorphism.
* **JavaScript (ES6+):** Lógica de simulação, cálculos estatísticos avançados e manipulação do DOM.
* **Chart.js:** Biblioteca externa para renderização dos gráficos dinâmicos.
* **Google Fonts:** Tipografia (Poppins).

## 📂 Estrutura de Arquivos
