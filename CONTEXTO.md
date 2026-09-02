# Contexto do Projeto — NoizeOX

## Resumo

Migração e redesign do site da **NoizeOX**, marca brasileira de skate / streetwear.
O site atual está hospedado na **Nuvemshop** em <https://www.noizeox.shop/> e será
reconstruído fora dessa plataforma, com **nova identidade visual**.

- **Loja atual:** <https://www.noizeox.shop/> (Nuvemshop)
- **Instagram:** [@noizeox](https://instagram.com/noizeox)
- **Moeda:** BRL (R$)
- **Idioma:** Português (pt-BR)
- **Diretório do projeto:** `C:\NoizeOX`

## O que é a NoizeOX

Marca de skate com linha de vestuário e acessórios, vendidos direto ao consumidor
pela loja online. Comunicação apoiada em coleções sazonais (ex.: coleção **AW26**
em destaque na home atual) e presença forte no Instagram.

### Catálogo atual (categorias na Nuvemshop)

- Calças
- Blusas / Moletom
- Jaquetas
- Cropped
- Manga Longa
- Lã pura
- Toucas
- Camisetas
- Bolsas

### Páginas / estrutura atual

- Início (home com coleção em destaque)
- Produtos (menu com as categorias acima)
- Contato
- Guia de medidas
- Conta (login / cadastro)
- Newsletter (cadastro para novidades e ofertas)
- Carrinho + checkout com controle de estoque em tempo real
- Cálculo de frete por CEP; frete grátis em vários itens
- Aviso de cookies

## Objetivo da migração

Sair da Nuvemshop e ter um site próprio com **identidade visual nova**, sem apenas
replicar o layout atual. O foco declarado do projeto é o **redesign visual**; as
partes de e-commerce (catálogo, carrinho, checkout, pagamento, frete, conteúdo
institucional, SEO/redirects) entram como contexto e serão definidas conforme a
stack escolhida.

## Direção visual (referências)

As referências foram enxugadas: o material de colagem editorial / revista de skate
(`landing page.jpg`, `base 1`–`base 5.jpg`) e a captura da loja atual
(`Noizeox website (Copy).png`) **foram removidos**. A direção agora é focada em
**Mac OS X Aqua / Frutiger Aero**.

Imagens de referência atuais na raiz do projeto (`C:\NoizeOX`):

| Arquivo | Referência | O que aproveitar |
|---|---|---|
| `fruitger aero 1.jpg`, `fruitger aero 2.jpg` | Mac OS X Aqua / **Frutiger Aero** | Janelas com barra de título listrada e "semáforo", botões de vidro, brilho, transparência, skeumorfismo, nostalgia dos anos 2000 |

**Linha geral:** interface nostálgica **Mac OS X Aqua / Frutiger Aero** — janelas
"flutuando" sobre fundo em gradiente suave (cinza → azul acinzentado → cinza),
sem enfeites, vidro e brilho no lugar de textura. O DNA skate entra pelo conteúdo
(fotografia, campanha, vídeo), não pela moldura.

### POC

`poc/` traz uma prova de conceito em HTML/CSS/JS, alinhada à spec do Figma
(*pagina-inicial — Frutiger Aero*):

- **Janela = navegador (Chrome/Aqua):** barra de título com gradiente Aqua
  (`#DDE7F2 → #F6F9FD → #B8C4D2 → #BCC9C6`) e "semáforo" (vermelho/amarelo/verde),
  aba com título + `×` + `+`, barra com voltar/avançar/atualizar, endereço em
  pílula de vidro com "G", estrela, avatar e `⋮`.
- **Frame 1 (hero):** janelas de navegador sobrepostas e **retas**, em posições
  fixas ("slots" do layout), abrindo e fechando ciclicamente com fotos/vídeos
  da marca.
- **Frame 2 (produtos):** grade alinhada de janelas de navegador — Sueter Noizeox,
  Beanie Branches, Zip Hoodie Logo, Jeans Branches, Wool Zip Logo, Jeans High Neck
  Jacket, Bolsa Cotele — com nome + preço abaixo (Roboto Medium, sombra suave).
- **Frame 3 (shapes):** Shape Branches Rosa / Cinza / Noizeox Ryan, marcados
  "Esgotado".
- Fundo: só o gradiente `linear-gradient(180deg, #EAEAEA 0%, #C7D4DE 46% , #DDDDDD 100%)`.
  Sem texto e sem barra de menu no fundo. Fonte **Roboto**.
- Mídia é placeholder (`picsum.photos`); trocar em `poc/js/main.js` (ver
  `poc/assets/README.md`).

## Decisões em aberto

- **Stack / plataforma de destino:** ainda indefinida. Opções em avaliação:
  - Next.js/React com e-commerce headless (Medusa, Shopify Storefront API, Saleor…)
  - Site estático (Astro/Eleventy) com catálogo versionado + checkout externo
  - Outro SaaS de e-commerce (Shopify, WooCommerce…)
- Hospedagem e domínio (manter `noizeox.shop`).
- Migração de dados: produtos, imagens, clientes, pedidos.
- Checkout, meios de pagamento e integração de frete (Correios/transportadora).
- Estratégia de SEO e redirects 301 das URLs da Nuvemshop.
- Newsletter / e-mail marketing (ferramenta atual e destino).
- Conteúdo institucional: contato, guia de medidas, políticas, trocas.

## Notas

- Projeto ainda **não é um repositório Git**.
- Conteúdo e catálogo reais devem ser extraídos da loja atual antes do corte.
