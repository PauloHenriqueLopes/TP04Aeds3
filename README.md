# Visualização Interativa de Tabela Hash Extensível

## Descrição do Projeto

Este projeto cria uma ferramenta visual interativa para ajudar no aprendizado de Tabelas Hash Extensíveis, uma estrutura de dados importante em Ciência da Computação. A implementação permite:

- Inserção de chaves numéricas com visualização em tempo real
- Ajuste do tamanho máximo dos buckets (2 a 5 elementos)
- Visualização clara do diretório e seus buckets
- Demonstração automática do processo de *split* e duplicação do diretório
- Registro detalhado e passo a passo de todas as operações via log
- **Busca de chaves**, com verificação no bucket e exibição detalhada no log
- **Reinicialização completa da estrutura (Clear)** para começar do zero

A ferramenta foi desenvolvida usando **HTML, CSS e JavaScript puro**, sem bibliotecas externas, para fácil execução em qualquer navegador moderno.

---

## Equipe

- **Paulo Henrique Lopes de Paula** — 829031

---

## Estrutura do Código

### 🧱 Classes

#### `Bucket`
- `constructor(id, pl)`: Inicializa um novo bucket com ID e profundidade local
- `cheio()`: Verifica se o bucket atingiu a capacidade
- `inserir(chave)`: Adiciona uma chave ao bucket
- `removerTodos()`: Remove todas as chaves do bucket (usado em splits)

---

### 🔧 Funções

- `inserirChave()`: Controla a inserção de novas chaves e os logs associados
- `inserirNovaChave(chave)`: Responsável pela lógica de split e realocação de chaves
- `buscarChave()`: Permite buscar uma chave na tabela, com logs detalhados do processo
- `limparTabela()`: Reinicia completamente a estrutura e o log
- `duplicarDiretorio()`: Duplica o diretório quando a profundidade global precisa aumentar
- `atualizarVisuais()`: Atualiza a interface gráfica dos buckets e diretório
- `hashBinario(chave)`: Calcula o índice com base na profundidade global (usado internamente)
- `toggleBotoes(disabled)`: Habilita/desabilita os botões de controle durante operações

---

## Relato de Experiência

ImplementEI todos os requisitos básicos e avançados da estrutura hash extensível, incluindo:

- Inserção com tratamento de colisões e redistribuição automática
- Crescimento dinâmico do diretório e dos buckets
- Visualização didática da estrutura
- Log detalhado de todas as ações realizadas
- Inclusão de busca e reinicialização da estrutura
- Desabilitação dos botões durante execuções para evitar múltiplas operações simultâneas

O maior desafio foi garantir a redistribuição correta das chaves durante os splits, mantendo o diretório sempre atualizado. A funcionalidade de logs com espera controlada (`sleep`) foi essencial para o caráter educacional da ferramenta, permitindo que o usuário acompanhe cada etapa com clareza.

---

## Checklist

- [x] A visualização interativa da Tabela Hash Extensível foi criada? SIM
- [x] O diretório está visualmente alinhado com os buckets? SIM
- [x] O botão de busca funciona corretamente e registra as ações no log? SIM
- [x] O botão "Clear" reinicia a estrutura e limpa o log? SIM
- [x] Os botões são desabilitados durante as operações? SIM
- [x] Há um vídeo de até 2 minutos demonstrando o uso da visualização? SIM
- [x] O trabalho está funcionando corretamente? SIM
- [x] O trabalho está completo? SIM
- [x] O trabalho é original e não uma cópia de um colega? SIM

---

## Como Usar

1. Clone o repositório ou baixe os arquivos do projeto
2. Abra `index.html` em qualquer navegador moderno (não requer servidor)
3. Insira valores numéricos no campo "Inserir chave" e observe o comportamento
4. Use "Buscar" para localizar chaves específicas
5. Clique em "Clear" para reiniciar a estrutura
6. O tamanho do bucket pode ser ajustado antes da primeira inserção

---

## Vídeo Demonstrativo

(https://www.youtube.com/watch?v=-K3kPRVH7oQ)

---

