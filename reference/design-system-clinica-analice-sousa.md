# Design system extraído — Clínica Analice Sousa

**Fonte da análise:** nove capturas de tela de uma mesma landing page, em diferentes posições de rolagem e em dois estados do FAQ. Capturas de 2048 × 1280 px, feitas em navegador desktop. **Data da análise:** 27/09/2026.

> **Critério de precisão.** Cores sólidas foram amostradas dos pixels das capturas. Dimensões, corpos de texto e espaçamentos são estimativas em pixels da imagem; o zoom do navegador, o DPR e os valores originais de CSS não são verificáveis. A família tipográfica exata, código-fonte, comportamentos mobile e estados de foco/hover também não podem ser comprovados por imagens estáticas. Onde necessário, há recomendações de implementação explicitamente identificadas.

## 1. Visão geral e intenção visual

Landing page de serviço clínico com estética sóbria, reservada e acolhedora. Usa verde escuro como superfície institucional, creme e bege como superfícies de descanso, branco para informação e dourado fosco para orientação visual e conversão. A direção evita fotos ou ilustrações decorativas nas capturas: os dois espaços de fotografia ainda são *placeholders*. O resultado é editorial e funcional, baseado em tipografia sem serifa, bastante espaço negativo, linhas finas e alternância de fundos. Não há gradientes, sombras ostensivas, glassmorphism ou ornamentos complexos.

**Ordem observada da página:** cabeçalho → hero → faixa de indicadores → bloco de acolhimento → protocolo → perfil de quem atende → etapas do atendimento → depoimentos → FAQ → agendamento com mapa → rodapé. O cabeçalho aparece no topo de todas as capturas após rolagem, indício forte de `position: sticky` ou `fixed`, mas a técnica exata não é observável.

### Inventário das nove capturas

| Captura (horário no nome) | Conteúdo que confirma | Detalhe particular |
|---|---|---|
| 10.50.37 | Cabeçalho, hero e começo dos indicadores | Hero com CTA e placeholder 4:5 |
| 10.50.47 | Indicadores, acolhimento e início do protocolo | Divisores verticais e bloco de duas colunas |
| 10.50.52 | Protocolo | Duas listas de ícones e aviso com filete dourado |
| 10.50.58 | Perfil profissional | Placeholder 3:4, quatro credenciais e CTA |
| 10.51.02 | Etapas | Quatro linhas numeradas em fundo verde |
| 10.51.05 | Depoimentos | Grade assimétrica de três cards |
| 10.51.09 | FAQ fechado | Oito perguntas e sinais de `+` |
| 10.51.15 | FAQ com primeiro item aberto | Resposta visível e controle convertido em `×` |
| 10.51.21 | Agendamento e rodapé | Metade texto, metade mapa interativo de terceiro |

## 2. Tokens de cor

Valores hexadecimais abaixo provêm de superfícies predominantes ou pixels exemplares. Variações de um ou dois níveis podem decorrer de antialiasing e captura de tela. Os nomes de tokens são propostos para implementação.

| Token proposto | Amostra | Uso observado | Observação |
|---|---|---|---|
| `--color-forest` | `#16332D` | Hero, cabeçalho, etapas, bloco de contato | Verde institucional predominante; RGB 22, 51, 45 |
| `--color-forest-deep` | aprox. `#102A23` | Rodapé | Tom mais escuro do verde principal; confirmar amostrando o arquivo original de interface |
| `--color-cream` | `#F6F1E8` | Indicadores, acolhimento, perfil e depoimentos | RGB 246, 241, 232 |
| `--color-sand` | `#EBE2D2` | Placeholders, card de destaque | RGB 235, 226, 210 |
| `--color-white` | `#FFFFFF` | Protocolo, FAQ e cards secundários | Superfície de leitura |
| `--color-gold` | `#C18F3C` | Botões, filete de aviso, pequenos ícones, numeração | RGB 193, 143, 60 |
| `--color-gold-deep` | aprox. `#8F6222` | Números grandes e microtítulos | RGB 143, 98, 34; alterna com o dourado principal |
| `--color-ink` | próximo de `#1B302A` | Títulos e corpo forte sobre claros | Aproximação visual: não há amostra isolada certificada |
| `--color-muted` | aprox. `#66766F` | Parágrafos em fundos claros | Cinza esverdeado; confirmar no código se for reproduzir fielmente |
| `--color-muted-on-dark` | aprox. `#A9BDB6` | Parágrafos sobre verde | Cinza esverdeado claro |
| `--color-rule` | aprox. `#E9E1D4` | Divisores em fundos claros e contorno dos cards | Linha muito fina, quente |

**Contrastes:** títulos claros sobre verde e escuros sobre branco têm leitura confortável. O corpo cinza em creme e especialmente cinza em verde precisa de validação WCAG antes de publicação; a captura não basta para atestar razão de contraste. Dourado sobre creme é usado sobretudo em rótulos, números e ícones; para corpo pequeno, verificar contraste. O botão usa texto verde escuro sobre dourado, padrão replicado em toda a página.

## 3. Tipografia e hierarquia

### Família

Todas as áreas de conteúdo parecem usar **uma única família sans-serif contemporânea**, com `a` e `g` minúsculos, desenho limpo, geometria moderada e boa abertura. Não há serifas, caligrafia ou fontes display distintas. A captura **não permite identificar com segurança a fonte exata**; fontes próximas para aproximação são **Inter**, **Manrope** ou **DM Sans**, a testar comparando formas de `a`, `g`, algarismos e largura da palavra “Harmonização” com o original. Não atribuir uma delas como fonte confirmada.

### Escala observada na imagem desktop

| Papel | Medida visual estimada | Peso / entrelinha | Aplicação |
|---|---|---|---|
| Marca no header | 19–21 px | 600–700 / compacta | “Clínica” em creme, “Analice Sousa” em dourado |
| Navegação | 16–18 px | 400–500 | Links discretos no verde |
| Eyebrow | 14–16 px | 600–700, `letter-spacing` ~0,12em, caixa alta | Local do hero e “O PROTOCOLO” |
| Hero H1 | 56–62 px | 650–750, `line-height` ~1,05–1,12 | Duas linhas, em creme |
| H2 de seção | 39–44 px | 650–750, `line-height` ~1,12–1,22 | Títulos do protocolo, perfil, etapas, depoimentos, FAQ e contato |
| Título de acolhimento | 38–42 px | 500–650, ~1,25 | Três linhas, ligeiramente menos pesado |
| Indicador grande | 46–50 px | 650–750 | “5 anos”, “1000+”, “Manaíra” em dourado escuro |
| Título de item / pergunta | 20–24 px | 600–700 | Listas, timeline, FAQ e rodapé |
| Depoimento destacado | 28–32 px | 500–650, ~1,3 | Texto no card grande |
| Corpo principal | 19–22 px | 400, ~1,5–1,6 | Introduções, parágrafos, respostas do FAQ |
| Corpo secundário | 16–19 px | 400, ~1,45–1,65 | Legendas, etapas, descrições de itens |
| Rodapé / ressalva | 14–17 px | 400, ~1,5 | Texto legal e metadados |
| Botão | 19–21 px | 600–700 | CTA com ícone à esquerda |

A escala é **estimada na captura**, não declarada no CSS. Exemplos de quebra: H1 “Harmonização íntima / masculina”; título do FAQ “As perguntas que / mais chegam antes / da consulta”; H2 de agendamento em uma linha. Preferir largura máxima em `ch` e quebra natural; não inserir `<br>` em cada título sem verificar o comportamento responsivo.

**Tratamento:** alinhamento predominantemente à esquerda; numerais grandes como prova social; palavras-chave sem destaque colorido dentro de títulos, exceto marca. O conteúdo usa caixa de frase; microtítulos e headers de listas usam caixa alta e espaçamento de letras. Itálico, sublinhado decorativo e texto sombreado não aparecem. Há sublinhado funcional no número de telefone.

## 4. Grade, largura e ritmo vertical

A captura de 2048 px de largura apresenta uma coluna central de conteúdo que vai aproximadamente de **x=375–385 até x=1620–1663**, largura útil em torno de **1240–1280 px**. Seções coloridas ocupam a largura inteira da viewport, mas os elementos internos respeitam esse contêiner. Há margens laterais grandes, cerca de 18–19% da tela em cada lado na vista desktop.

**Padrão de grade:** duas colunas nos blocos principais, com lacuna aproximada de 70–120 px; o FAQ reserva ~35–40% para o título e ~60–65% para os itens; o contato divide a viewport em duas metades aproximadas, a segunda ocupada por mapa. O bloco de protocolo contém duas colunas de listas. Depoimentos usam duas colunas, a primeira com card alto, a segunda com dois cards empilhados. Indicadores formam três colunas. Etapas são linhas de três subcolunas: índice, título e descrição.

**Ritmo:** seção de hero alta, com muito respiro vertical; seções de conteúdo têm entradas e saídas largas, aproximadamente 90–140 px na captura; espaços entre H2 e parágrafo ~24–34 px; entre introdução e grade ~60–90 px; entre itens de lista ~44–65 px. Não há empilhamento visual apertado. As linhas divisórias oferecem estrutura sem criar caixas em excesso.

**Raios e bordas:** botões arredondados moderadamente (~10–12 px); placeholders e cards com cantos ~15–18 px; divisórias e bordas de 1 px em tom de areia, frequentemente muito discretas. Não se observa sombra externa relevante.

## 5. Estrutura de cada seção

### 5.1 Cabeçalho

Barra verde de cerca de 80 px de altura abaixo da interface do navegador. Conteúdo central alinhado horizontalmente: marca à esquerda; à direita, links “O protocolo”, “Sobre a Analice”, “Dúvidas” e CTA “Chamar no WhatsApp”. Marca em uma linha sem símbolo gráfico visível. Cor da segunda parte da marca em dourado. Links em cinza esverdeado claro; botão preenchido em dourado com ícone de WhatsApp em traço verde escuro. A borda inferior sutil ajuda a separar header e hero. Sua persistência em todos os pontos sugere cabeçalho fixo/aderente. Não se pode inferir menu mobile nem o comportamento de âncoras só pela captura.

### 5.2 Hero

Fundo verde pleno. Coluna esquerda: microtítulo dourado “MANAÍRA, JOÃO PESSOA”, H1 creme, texto de apoio cinza claro e CTA dourado. Coluna direita: painel vertical bege, cantos arredondados, aproximadamente 4:5, com texto técnico centralizado: `[IMAGEM 1: consultório da Clínica Analice Sousa, vertical 4:5, 900x1125px, WebP]`. Imagem **ainda não foi inserida**. A fotografia futura deve preencher com `object-fit: cover`, mantendo raio e proporção; não interpretar o bege como escolha definitiva de conteúdo.

A composição vertical centraliza aproximadamente o conteúdo textual em relação à imagem, com largura do texto suficiente para H1 em duas linhas. Sem carrossel, textura, shape ou overlay observável.

### 5.3 Faixa de indicadores

Superfície creme logo após o hero. Três células de largura similar com filetes verticais: “5 anos”, “1000+”, “Manaíra”. Algarismos/termo em dourado escuro, descritores em cinza esverdeado. Cada indicador é texto puro, sem ícone nem card individual. A faixa funciona como bloco de credibilidade e divisor de tom entre hero e explicação.

### 5.4 Bloco de acolhimento

Continua em creme. Coluna esquerda: frase de empatia com aspecto de citação editorial, “A maioria dos homens leva meses até mandar a primeira mensagem.” Coluna direita: dois parágrafos curtos sobre hesitação, consulta e clareza. Sem aspas gráficas, foto ou CTA. A grande distância entre colunas e o corpo de texto maior dão pausa ao fluxo comercial.

### 5.5 “O protocolo”

Fundo branco. Eyebrow dourado em caixa alta; H2 verde em duas linhas; parágrafo de introdução cinza, com largura maior que o H2. A seguir, duas listas paralelas com títulos em caixa alta (“O QUE O PROTOCOLO TRABALHA” / “COMO É FEITO”) e uma linha fina abaixo dos títulos. Cada coluna tem três itens de **ícone dourado em traço**, título verde escuro em semibold e descrição cinza. Ícones identificáveis: setas laterais com haste (espessura), ondas horizontais (região mais relaxada), brilho/estrela de quatro pontas (estética); seringa (consultório), relógio (duração), seta curva de retorno (material reversível). Ícones pequenos, ~20–24 px visuais, com espessura fina e alinhados ao início do item. Não há preenchimentos grandes nem círculos coloridos atrás deles.

Ao final, nota clínica corrida em cinza com **barra vertical dourada à esquerda**, recuada da lista: ressalva sobre avaliação urológica. Este é um componente de aviso editorial, não um card flutuante. O conteúdo tem caráter informativo e deve ser validado clinicamente antes de publicar.

### 5.6 Perfil de quem atende

Fundo creme. Grade de duas colunas: placeholder de retrato à esquerda, ~3:4, bege, raio moderado e fina borda; à direita, H2 “Quem vai te atender”, dois parágrafos ainda marcados `[TEXTO A CONFIRMAR]`, filete horizontal, quatro credenciais em grade 2 × 2 e CTA. Placeholder contém especificação explícita `[IMAGEM 2: retrato da Analice Sousa no consultório, vertical 3:4, 900x1200px, WebP, alt ...]`. As credenciais incluem “5 anos”, “1000+”, `[CONFIRMAR] formação e registro profissional` e “Consultório próprio, em Manaíra”. **Não tomar texto a confirmar ou credencial profissional como dado publicado/verificado.**

### 5.7 Etapas do atendimento

Fundo verde pleno. H2 em creme, “Do primeiro contato / ao retorno”. Abaixo, quatro linhas separadas por filetes verdes claros quase imperceptíveis. Cada linha organiza número dourado de dois dígitos `01–04`, título creme semibold e descrição cinza clara. Conteúdos: Contato; Consulta inicial; Procedimento; Orientação e retorno. É uma **lista sequencial estática**, sem evidência de interação ou animação. O texto dos passos define o valor na consulta, não no hero.

### 5.8 Depoimentos

Fundo creme. H2 escuro em duas linhas e linha de apoio cinza sobre consentimento e anonimização. Grade assimétrica: card grande bege à esquerda ocupando a altura de dois cards; dois cards brancos empilhados à direita, com espaço largo entre colunas e entre cards. Bordas finas quentes, raio ~16 px, sem sombra. Texto do depoimento entre aspas com peso médio/semibold, tamanho maior no destaque; identificação `[Iniciais], [idade] anos` em cinza, embaixo. **Os três textos são placeholders explícitos** (`[DEPOIMENTO 1...]` etc.); não são prova social pronta para publicação. A orientação de uso de autorização escrita está na própria página.

### 5.9 FAQ / acordeão

Fundo branco. Título ocupa coluna esquerda; oito linhas interativas à direita. Perguntas, nesta ordem: “Dói?”, “Quanto tempo dura o resultado?”, “É reversível?”, “Quanto tempo preciso ficar parado?”, “Interfere na função?”, “Qual o valor?”, “Quem pode fazer?”, “Meus dados ficam registrados?”. Cada linha possui pergunta semibold verde e controle dourado `+` à extrema direita; borda inferior muito fina bege. No estado aberto capturado, a primeira pergunta revela parágrafo cinza embaixo, a linha aumenta de altura e o ícone é `×`, enquanto as outras continuam fechadas. **Duas capturas comprovam os estados fechado e aberto da primeira pergunta**, mas não comprovam se múltiplas respostas podem permanecer abertas ao mesmo tempo, se há transição animada, nem o acionamento por teclado.

Implementação recomendada: usar `<button aria-expanded>` por pergunta, região de resposta associada com `aria-controls`, área clicável igual à largura da linha, `focus-visible` visível, e manter `+`/`×` como apresentação, não como único anúncio de estado. Uma solução com `<details><summary>` também serve se reproduzir os estados e semântica. Altura fechada estimada ~80–83 px na captura, com expansão conforme texto. FAQ sem cards, preenchimento colorido ou sombra.

### 5.10 Agendamento, mapa e rodapé

Bloco de largura total dividido aproximadamente ao meio. Esquerda verde institucional com conteúdo alinhado a um contêiner interno: H2 creme, três linhas de explicação em cinza claro, botão dourado, filete, nome da clínica em creme, endereço e telefone em cinza/dourado. Direita: mapa real incorporado, visual do Google Maps, com marcadores, caixa de endereço, controles e créditos próprios. O mapa **não é um vetor autoral** do design system; seu conteúdo, marca d’água, interações e cores pertencem ao provedor. Uma captura mostra endereço “Av. João Câncio da Silva, 1676, Sala 302, segundo andar, Manaíra, João Pessoa, PB, 58038-000” e telefone `(83) 98233-0820`; confirmar ambos antes de tratar como informações finais.

Rodapé em verde mais profundo: três colunas (“Clínica Analice Sousa”, “Endereço”, “Contato”), linha horizontal e nota final discreta sobre caráter informativo e variação de resultados. No bloco da clínica, há `[CONFIRMAR: nome completo e registro profissional]`, reforçando que a página está em revisão. O rodapé não mostra redes sociais, newsletter ou logotipos adicionais.

## 6. Componentes e padrões reutilizáveis

| Componente | Anatomia e estilo | Estados observados |
|---|---|---|
| CTA WhatsApp | Retângulo dourado, raio ~10 px; ícone de traço à esquerda; rótulo verde escuro semibold; padding generoso, sem sombra | Apenas padrão; aparece no header, hero, perfil e contato |
| Link de navegação | Texto claro/cinza sobre verde, sem caixa ou borda | Apenas padrão |
| Indicador | Valor grande dourado + legenda cinza; divisórias verticais na faixa | Apenas padrão |
| Item com ícone | Ícone dourado em outline + título verde + descrição cinza, sem cartão | Apenas padrão |
| Linha de etapas | Número dourado + nome claro + descrição suave; filetes horizontais | Apenas padrão |
| Card de depoimento | Fundo bege de destaque ou branco secundário; contorno quente, raio moderado, citação e identificação | Apenas padrão; conteúdo provisório |
| Item de acordeão | Botão/linha com pergunta e ícone à direita, divisor inferior | Fechado (`+`) e primeiro aberto (`×` + resposta) |
| Aviso clínico | Filete vertical dourado + texto corrido cinza | Apenas padrão |
| Painel de imagem | Caixa bege com raio e texto provisório centralizado | Apenas placeholder; não mostra fotografia real |
| Telefone | Texto dourado sublinhado sobre verde | Apenas padrão; destino do link não observável |

**Vetores e ícones:** apenas pequenos desenhos lineares no protocolo e símbolo do WhatsApp. Nenhum logo pictórico, ilustração de fundo, padrão geométrico ou decoração vetorial de grande escala é visível. A fonte exata dos ícones (biblioteca ou SVG próprio) não é dedutível. Para reconstrução, preferir SVGs com `stroke: currentColor`, `fill: none`, traço ~1,5–2 px e dimensões uniformes; conferir fidelidade visual manualmente.

## 7. Tokens de implementação sugeridos

Este bloco traduz a inspeção em um ponto de partida **proposto**, sem alegar que seja o CSS original:

```css
:root {
  --color-forest: #16332d;
  --color-forest-deep: #102a23; /* aproximação */
  --color-cream: #f6f1e8;
  --color-sand: #ebe2d2;
  --color-white: #fff;
  --color-gold: #c18f3c;
  --color-gold-deep: #8f6222;
  --color-ink: #1b302a; /* aproximação */
  --color-muted: #66766f; /* aproximação */
  --color-muted-on-dark: #a9bdb6; /* aproximação */
  --color-rule: #e9e1d4; /* aproximação */
  --font-sans: 'Inter', 'Manrope', system-ui, sans-serif; /* substituto, não identificado */
  --container: 1280px;
  --radius-control: 10px;
  --radius-card: 16px;
  --space-section: clamp(72px, 8vw, 128px);
}
.container { width: min(var(--container), calc(100% - 48px)); margin-inline: auto; }
.button-primary { display: inline-flex; align-items: center; gap: 14px;
  background: var(--color-gold); color: var(--color-forest);
  border-radius: var(--radius-control); padding: 18px 34px; font-weight: 700; }
```

**Escala espacial proposta:** 4, 8, 12, 16, 24, 32, 48, 64, 96 e 128 px. É uma normalização útil para desenvolvimento, não uma medição certificada do arquivo de origem. Para títulos desktop, começar com `clamp(40px, 3vw, 60px)` no hero e `clamp(32px, 2.2vw, 44px)` em H2; ajustar ao cotejar screenshots no mesmo viewport/zoom.

## 8. Responsividade, interação e acessibilidade

As nove imagens são **somente desktop**, com viewport capturada de 2048 × 1280. Não há prova de breakpoints, menu hambúrguer, empilhamento de colunas, tamanho de toque, comportamento do mapa em telas pequenas ou transições. Para implementar com coerência visual, recomenda-se: empilhar as grades de duas colunas em telas estreitas; manter leitura e CTA antes do mapa; reduzir H1 por `clamp`; transformar indicadores em pilha ou grade sem texto espremido; conservar a ordem semântica de depoimentos; dar altura visível ao mapa sem bloquear o scroll; deixar FAQ clicável em toda a largura; oferecer link de endereço que abra o mapa. Essas são **propostas**, não características atestadas.

A navegação deveria apontar para IDs das seções, com `scroll-margin-top` caso o header seja sticky. O CTA deve ter nome acessível e destino WhatsApp funcional. Imagem 1 precisa de `alt` descritivo conforme sua função; retrato da profissional requer descrição específica, já indicada no placeholder. Se o mapa for `iframe`, dar-lhe `title` claro. Garantir foco perceptível, contraste testado e controle de movimento se forem adicionadas animações. Submeter textos médicos, qualificações, resultados e relatos a revisão responsável antes de substituir placeholders.

## 9. O que ainda não é possível extrair com fidelidade

1. Nome, arquivos, pesos e métricas reais da fonte.
2. CSS original, valores exatos de breakpoints, unidades (`rem`, `px`, `%`) e escala do navegador.
3. Variações de hover, focus, disabled, loading e navegação por teclado.
4. Fotografias finais, tratamentos de imagem e eventual legenda.
5. Identidade visual completa além desta página (logo formal, brand book, motion).
6. Conteúdo final dos parágrafos de perfil, credencial profissional e depoimentos.
7. Destinos dos links e configuração técnica do mapa/WhatsApp.
8. Persistência do FAQ, exclusividade de abertura e animação de expansão.

**Síntese para reprodução:** priorizar a largura de ~1280 px, alternância verde/creme/branco, tipografia sans de hierarquia forte, muito espaço vazio, separadores finos, dourado pontual e quatro chamadas idênticas ao WhatsApp. Replicar as grades e estados visíveis antes de inventar elementos ausentes. Validar conteúdos provisórios e responsividade com material adicional.
