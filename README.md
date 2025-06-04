# Visualização Interativa de Tabela Hash Extensível

## Descrição do Projeto
Este projeto cria uma ferramenta visual interativa para ajudar no aprendizado de Tabelas Hash Extensíveis, uma estrutura de dados importante em Ciência da Computação. A implementação permite:

- Inserção de chaves numéricas com visualização em tempo real
- Ajuste do tamanho máximo dos buckets (2-5 elementos)
- Visualização clara do diretório e seus buckets
- Demonstração automática do processo de split e duplicação do diretório
- Registro detalhado de todas as operações (log)

A ferramenta foi desenvolvida usando HTML, CSS e JavaScript puro, sem bibliotecas externas, para fácil implantação em qualquer navegador moderno.

## Equipe
- [Paulo Henrique Lopes de Paula] (829031)

## Estrutura do Código

### Classes Principais

**Bucket**
- `constructor(id, pl)`: Inicializa um novo bucket com ID e profundidade local
- `cheio()`: Verifica se o bucket atingiu capacidade máxima
- `inserir(chave)`: Adiciona uma nova chave ao bucket

**Funções Principais**
- `hashBinario(chave)`: Calcula o hash binário da chave
- `atualizarVisuais()`: Atualiza a interface com o estado atual da estrutura
- `inserirChave()`: Controla o fluxo de inserção de novas chaves
- `inserirNovaChave(chave)`: Lógica principal de inserção com tratamento de splits
- `duplicarDiretorio()`: Duplica o diretório quando necessário

## Relato de Experiência
Implementamos todos os requisitos básicos da tabela hash extensível, incluindo:
- Inserção de chaves com tratamento de colisões
- Crescimento dinâmico do diretório
- Divisão de buckets quando necessário
- Visualização clara da profundidade global e locais

O maior desafio foi implementar corretamente a lógica de redistribuição de chaves durante o split dos buckets, especialmente a atualização dos ponteiros do diretório. Tivemos que revisar várias vezes o algoritmo para garantir que todas as chaves fossem realocadas corretamente após a divisão.

Os resultados foram satisfatórios, criando uma ferramenta que demonstra claramente o funcionamento interno da estrutura de dados. Como possível melhoria, poderíamos implementar operações de remoção e busca para complementar a visualização.

## Checklist
- [x] A visualização interativa da Tabela Hash Extensível foi criada?
- [x] Há um vídeo de até 2 minutos demonstrando o uso da visualização?
- [x] O trabalho está funcionando corretamente?
- [x] O trabalho está completo?
- [x] O trabalho é original e não a cópia de um trabalho de um colega?

## Como Usar
1. Clone o repositório ou faça download dos arquivos
2. Abra `index.html` em qualquer navegador moderno
3. Insira valores numéricos no campo "Inserir chave"
4. Observe a evolução da estrutura de dados
5. Altere o tamanho do bucket (antes de inserir qualquer chave)

## Vídeo Demonstrativo
[Incluir aqui o link para o vídeo de demonstração]
