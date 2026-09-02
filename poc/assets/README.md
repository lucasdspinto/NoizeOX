# assets — mídia da marca

## Vídeos

Página única: as janelas de vídeo ficam numa camada sobre a página toda e
podem ser arrastadas para qualquer lugar (não há mais separação hero /
produtos / shapes).

Os vídeos são **arquivos locais**, tocados sem player (só o `<video>` mudo,
em loop, sem controles). Coloque os `.mp4` aqui em `assets/` e liste em
`VIDEOS` no `js/main.js`:

```js
const VIDEOS = [
  { src: 'assets/best-trick-modernize.mp4', t: 'best trick modernize x noizeox (12/07)' },
  // ...
];
```

- `src` — caminho relativo do arquivo.
- `t`   — título; vira o nome da aba da janela.
- A **proporção** da janela e a **duração** são lidas do próprio arquivo em
  runtime (`loadedmetadata`). A janela abre na proporção real, sem tarjas.
- Cada janela começa a tocar num **instante aleatório dentro dos primeiros
  2/3** do vídeo.
- Se um arquivo falhar ao carregar, a janela troca por outro da lista.

### Recomendado: faststart

Vídeos baixados do YouTube costumam ter o índice (`moov`) no fim do arquivo,
o que deixa o "pular para 2/3" lento. Reprocesse sem re-encodar:

```
ffmpeg -i entrada.mp4 -c copy -movflags +faststart saida.mp4
```

### Servidor

O seek de vídeo precisa de HTTP Range. Sirva por http (não `file://`):
`serve.ps1` no scratchpad já responde `206 Partial Content`. Ou use qualquer
static server que suporte Range.

## Produtos / shapes (frames 2 e 3)

Dados reais de <https://www.noizeox.shop/> em `PRODUCTS` / `SHAPES`
(`js/main.js`). Cada item: `{ name, price, img, sold? }`.

- `img` — foto em `assets/products/<slug>.webp` (baixadas da loja, 640px).
  Helper `IMG('<slug>')` monta o caminho.
- Layout é **colagem** reproduzindo o mock: cada item tem `x` (%), `y` (px)
  e `w` (px) próprios. A altura vem da proporção real da foto (lida no `load`
  da imagem). `.stage` tem `height` fixa; abaixo de 980px empilha.
- `sold: true` aplica dessaturação e o selo "Esgotado".
