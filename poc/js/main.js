/* ===========================================================================
   NOIZEOX — POC do novo site
   Página única, sem divisórias — tudo no mesmo canvas.
   - Vídeos (hero): janelas de navegador (Aqua) numa camada que cobre a
     página inteira; abrem no topo mas podem ser arrastadas p/ qualquer
     lugar. Arquivos em assets/, sem player.
   - Produtos / shapes: colagem de janelas em posições fixas (x/y/w por
     item), com nome + preço abaixo.
   Vídeos do hero: lista `VIDEOS` (arquivos em assets/). Produtos/shapes:
   dados reais de noizeox.shop em PRODUCTS / SHAPES (ver assets/README.md).
   =========================================================================== */

const $  = (s, el = document) => el.querySelector(s);
const rand  = (a, b) => a + Math.random() * (b - a);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* --- conteúdo do hero: vídeos da marca em assets/ -----------------------
   Baixe os arquivos para assets/ e liste aqui. `t` = título (nome da aba).
   Proporção e duração são lidas do próprio arquivo em runtime — a janela
   abre na proporção real (sem tarjas) e o vídeo começa num instante
   aleatório dentro dos primeiros 2/3 da duração.
   Dica: `ffmpeg -i in.mp4 -c copy -movflags +faststart out.mp4` deixa o
   seek inicial instantâneo. */
const VIDEOS = [
  { src: 'assets/best-trick-modernize.mp4',          t: 'best trick modernize x noizeox (12/07)' },
  { src: 'assets/07-26.mp4',                         t: '07/26' },
  { src: 'assets/day-in-the-life-raoni-martins.mp4', t: 'day in the life com raoni martins' },
  { src: 'assets/jean-cruz.mp4',                     t: 'jean cruz for noizeox' },
  { src: 'assets/ryan.mp4',                          t: 'ryan for noizeox' },
  { src: 'assets/autumn-winter-2024.mp4',            t: 'autumn/winter 2024 noizeox*' },
  { src: 'assets/drope.mp4',                         t: 'drope for noizeox' },
  { src: 'assets/noizeox-modernize.mp4',             t: 'noizeox modernize' },
  { src: 'assets/noizeox-social-plaza.mp4',          t: 'noizeox social plaza' },
  { src: 'assets/pab-day.mp4',                       t: 'pab day (archive noizeox)' },
  { src: 'assets/part-1.mp4',                        t: 'part 1' },
  { src: 'assets/session-22-jan.mp4',                t: 'session 22 jan' },
];
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const pickOther = (arr, not) => {
  let v = pick(arr);
  for (let i = 0; i < 4 && v === not; i++) v = pick(arr);
  return v;
};

/* Vídeo "liso": <video> mudo, em loop, sem controles nem player.
   - a janela assume a proporção real do arquivo (sem tarjas);
   - a reprodução começa num ponto aleatório dos primeiros 2/3 do vídeo;
   - se o arquivo falhar, troca por outro da lista. */
function mountVideo(body, video) {
  const win = body.closest('.win');
  const tabEl = win?.querySelector('.win__tab-t');

  const el = document.createElement('video');
  Object.assign(el, { muted: true, loop: true, autoplay: true, preload: 'metadata' });
  el.playsInline = true;
  el.setAttribute('playsinline', '');

  let current = video;
  let fails = 0;
  const load = (v) => {
    current = v;
    if (tabEl) tabEl.textContent = v.t;
    el.src = v.src;
    el.load();
  };

  el.addEventListener('loadedmetadata', () => {
    const w = el.videoWidth, h = el.videoHeight, d = el.duration;
    if (w && h) {
      body.style.aspectRatio = `${w} / ${h}`;
      if (win) { win._ar = w / h; if (win._slot) layout(win, win._slot); }
    }
    if (d && isFinite(d)) {
      try { el.currentTime = Math.random() * d * (2 / 3); } catch (_) {}
    }
    el.play?.().catch(() => {});
  });

  el.addEventListener('error', () => {
    if (++fails > 5) return;               /* evita loop se tudo falhar */
    load(pickOther(VIDEOS, current));
  });

  body.appendChild(el);
  load(video);
}

/* --- produtos (dados reais de noizeox.shop) --------------------------------
   Disposição inicial: grade por fileiras calculada em JS — sem sobreposição.
   `ar` = proporção da foto (w/h). Cada janela vai de 0 a 25% menor que a
   coluna, e os tamanhos são espelhados dentro de cada fileira.
   Fotos baixadas da loja para assets/products/ (640px). */
const IMG = (name) => `assets/products/${name}.webp`;

const PRODUCTS = [
  { name: 'Sueter Noizeox',         price: 'R$ 240,00', img: IMG('sueter-noizeox'),         ar: 640 / 960 },
  { name: 'Quarter Zip High Neck',  price: 'R$ 280,00', img: IMG('quarter-zip-high-neck'),  ar: 640 / 960 },
  { name: 'Beanie Branches',        price: 'R$ 80,00',  img: IMG('beanie-branches'),        ar: 640 / 960 },
  { name: 'Jeans Branches',         price: 'R$ 300,00', img: IMG('jeans-branches'),         ar: 640 / 895 },
  { name: 'Zip Hoodie Logo',        price: 'R$ 230,00', img: IMG('zip-hoodie-logo'),        ar: 640 / 960 },
  { name: 'Wool Zip Logo',          price: 'R$ 340,00', img: IMG('wool-zip-logo'),          ar: 640 / 960 },
  { name: 'Jeans High Neck Jacket', price: 'R$ 280,00', img: IMG('jeans-high-neck-jacket'), ar: 640 / 960 },
  { name: 'Bolsa Cotele',           price: 'R$ 250,00', img: IMG('bolsa-cotele'),           ar: 640 / 854 },
];

const SHAPES = [
  { name: 'Shape Branches Rosa',  price: 'R$ 250,00', img: IMG('shape-branches-rosa'),  ar: 640 / 989,  sold: true },
  { name: 'Shape Branches Cinza', price: 'R$ 250,00', img: IMG('shape-branches-cinza'), ar: 640 / 1027, sold: true },
  { name: 'Shape Noizeox Ryan',   price: 'R$ 250,00', img: IMG('shape-noizeox-ryan'),   ar: 640 / 989,  sold: true },
];

/* ===========================================================================
   Fábrica de janela de navegador
   =========================================================================== */
function browserWindow({ title, addr, media, bookmarks, compact, content }) {
  const win = document.createElement('div');
  win.className = 'win' + (compact ? ' win--compact' : '');
  win.innerHTML = `
    <div class="win__title">
      <span class="tl tl--close" data-close></span>
      <span class="tl tl--min"></span>
      <span class="tl tl--zoom"></span>
      <span class="win__tab"><span class="win__tab-t">${title}</span><span class="win__tab-x">&times;</span></span>
      <span class="win__tab-add">+</span>
    </div>
    <div class="win__bar">
      <span class="tb">&#8249;</span><span class="tb">&#8250;</span><span class="tb">&#8635;</span>
      <span class="win__addr">
        <span class="addr-g"></span>
        <span class="addr-t">${addr}</span>
        <span class="addr-star">&#9734;</span>
      </span>
      <span class="tb-avatar"></span>
      <span class="tb">&#8942;</span>
    </div>
    ${bookmarks ? `<div class="win__bm">${bookmarks.map((b) => `<span class="bm"><span class="bm-i"></span>${b}</span>`).join('')}</div>` : ''}
    <div class="win__body"></div>
    <span class="win__resize" data-resize></span>
  `;

  const body = $('.win__body', win);
  if (content != null) {
    if (content instanceof Node) body.appendChild(content);
    else body.innerHTML = content;
  } else if (media.video) {
    mountVideo(body, media.video);
  } else if (/\.(mp4|webm|mov)$/i.test(media.src)) {
    const v = document.createElement('video');
    Object.assign(v, { src: media.src, muted: true, loop: true, autoplay: true });
    v.playsInline = true;
    body.appendChild(v);
    v.play?.().catch(() => {});
  } else {
    const img = document.createElement('img');
    img.alt = title;
    img.loading = 'lazy';
    /* a janela assume a proporção real da foto */
    img.addEventListener('load', () => {
      if (img.naturalWidth && img.naturalHeight) {
        body.style.aspectRatio = `${img.naturalWidth} / ${img.naturalHeight}`;
      }
    });
    img.src = media.src;
    body.appendChild(img);
  }
  return win;
}

/* --- arrastar pela barra de título ------------------------------------ */
function makeDraggable(target, onFocus) {
  const bar = $('.win__title', target);
  bar.addEventListener('pointerdown', (e) => {
    if (e.target.closest('[data-close]')) return;
    e.preventDefault();
    onFocus?.();

    const sx = e.clientX, sy = e.clientY;
    const dx0 = parseFloat(target.style.getPropertyValue('--dx')) || 0;
    const dy0 = parseFloat(target.style.getPropertyValue('--dy')) || 0;

    target.style.transition = 'none';
    bar.classList.add('dragging');

    const move = (ev) => {
      target.style.setProperty('--dx', `${dx0 + ev.clientX - sx}px`);
      target.style.setProperty('--dy', `${dy0 + ev.clientY - sy}px`);
    };
    const up = () => {
      target.style.transition = '';
      bar.classList.remove('dragging');
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
    };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
  });
}

/* --- redimensionar pela alça do canto (mantém a proporção) ----------- */
function makeResizable(win, onFocus) {
  const grip = $('[data-resize]', win);
  if (!grip) return;
  const target = win.closest('.item') || win;   /* produtos: --w fica no .item */
  grip.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    e.stopPropagation();
    onFocus?.();

    const sx = e.clientX;
    const startW = parseFloat(getComputedStyle(target).getPropertyValue('--w'))
      || win.getBoundingClientRect().width;
    grip.setPointerCapture?.(e.pointerId);

    const move = (ev) => {
      const w = clamp(startW + ev.clientX - sx, 150, Math.min(760, innerWidth - 32));
      target.style.setProperty('--w', `${Math.round(w)}px`);
    };
    const up = () => {
      grip.releasePointerCapture?.(e.pointerId);
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
    };
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
  });
}

/* ===========================================================================
   FRAME 1 — hero: cada "slot" é uma posição (gerada, não fixa) que abre,
   fecha e reabre janelas de vídeo em ciclo.
   =========================================================================== */
const heroStage = $('#heroStage');
let z = 10;

const CHROME_H = 68; /* barra de título + toolbar */

/* Sem base fixa: os slots são gerados numa grade solta (com jitter) que
   cobre toda a tela. ~1/3 a mais de janelas que a versão anterior. */
function buildSlots() {
  const H = innerHeight;               /* vídeos nascem na área do hero (topo) */
  const narrow = innerWidth < 860;
  const cols  = narrow ? 1 : 3;
  const count = narrow ? 4 : 8;
  const rows  = Math.ceil(count / cols);
  const out = [];
  for (let i = 0; i < count; i++) {
    const r = Math.floor(i / cols);
    const rowCols = Math.min(cols, count - r * cols); /* última linha pode ter menos */
    const c = i - r * cols;
    const cellW = 1 / rowCols;
    const fw = narrow ? 0.82 : rand(0.24, 0.36);
    const fx = clamp(c * cellW + rand(0, Math.max(cellW - fw, 0.03)), 0, 1 - fw * 0.7);
    /* espalha as linhas por ~52% da altura, deixando folga p/ a janela */
    const t = rows === 1 ? 0 : r / (rows - 1);
    const y = Math.round((0.02 + 0.52 * t) * H + rand(-24, 40));
    out.push({ fx, y: Math.max(6, y), fw });
  }
  return out;
}

function layout(win, slot) {
  const b = heroStage.getBoundingClientRect();
  const ar = win._ar || 16 / 9;
  let w = clamp(slot.fw * b.width, 210, 700);
  /* mantém a proporção do vídeo, mas evita janela alta demais (ex.: 9:16) */
  const maxBody = Math.min(b.height * 0.9, 620) - CHROME_H;
  if (w / ar > maxBody) w = maxBody * ar;
  win.style.setProperty('--w', `${Math.round(clamp(w, 180, 760))}px`);
  win.style.setProperty('--x', `${Math.round(slot.fx * b.width)}px`);
  win.style.setProperty('--y', `${slot.y}px`);
}

function openInSlot(slot, next) {
  const media = { title: 'noizeox', video: pick(VIDEOS) };
  const win = browserWindow({
    title: media.video.t,
    addr: 'noizeox.shop',
    media,
    compact: slot.fw < 0.2,
  });
  win._slot = slot;
  layout(win, slot);
  win.style.setProperty('--sc', '0.9');
  win.style.opacity = '0';
  win.style.zIndex = ++z;
  heroStage.appendChild(win);

  requestAnimationFrame(() => {
    win.style.opacity = '1';
    win.style.setProperty('--sc', '1');
  });

  makeDraggable(win, () => { win.style.zIndex = ++z; });
  makeResizable(win, () => { win.style.zIndex = ++z; });
  $('[data-close]', win).addEventListener('click', () => close(true));

  let closed = false;
  function close(manual) {
    if (closed) return;
    closed = true;
    win.style.opacity = '0';
    win.style.setProperty('--sc', '0.92');
    setTimeout(() => win.remove(), 500);
    if (!REDUCE) setTimeout(next, manual ? 900 : rand(500, 1500));
  }

  if (!REDUCE) setTimeout(() => close(false), rand(40000, 60000));
}

function runSlot(slot, i) {
  const cycle = () => { openInSlot(slot, cycle); };
  setTimeout(cycle, i * 320);
}

function initHero() {
  buildSlots().forEach(runSlot);
}

/* reposiciona janelas vivas ao redimensionar */
let rt;
addEventListener('resize', () => {
  clearTimeout(rt);
  rt = setTimeout(() => {
    heroStage.querySelectorAll('.win').forEach((win) => {
      if (win._slot) layout(win, win._slot);
    });
  }, 150);
});

/* ===========================================================================
   FRAME 2 / 3 — produtos e shapes: grade por fileiras, sem sobreposição.
   Cada janela até 25% menor que a coluna; tamanhos espelhados por fileira.
   =========================================================================== */
let zi = 20;

const ITEM_GAP    = 30;   /* espaço entre janelas */
const ITEM_CHROME = 62;   /* título + toolbar (compact) + bordas */
const ITEM_CAP    = 44;   /* legenda (nome + preço) */
const colsFor = (w) => (w < 520 ? 1 : w < 800 ? 2 : w < 1080 ? 3 : 4);

/* Grade por fileiras. Cada janela pode ser até 25% menor que a largura
   base; dentro de uma fileira os tamanhos são ESPELHADOS (col 1 = col N,
   col 2 = col N-1, ...). O espaço que sobra é dividido IGUALMENTE — mesma
   folga antes, entre e depois de todas as imagens (space-evenly). */
function layoutMasonry(figs, root) {
  if (!figs.length) return;
  const W = root.clientWidth;
  const cols = colsFor(W);
  let y = 0;
  for (let s = 0; s < figs.length; s += cols) {
    const row = figs.slice(s, s + cols);
    const n = row.length;
    /* largura base p/ esta fileira: cheia = ITEM_GAP entre todas */
    const baseW = (W - (n + 1) * ITEM_GAP) / n;
    const ws = row.map((_, j) => {
      const mi = Math.min(j, n - 1 - j);                    /* índice espelhado */
      const mult = 0.75 + 0.25 * (row[mi]._r ?? 0.5);       /* 0.75–1.0, simétrico */
      return Math.round(baseW * mult);
    });
    const g = (W - ws.reduce((a, b) => a + b, 0)) / (n + 1); /* folga igual */
    let x = g;
    let rowH = 0;
    row.forEach((fig, j) => {
      const w = ws[j];
      const winH = ITEM_CHROME + w / (fig._ar || 0.75) + ITEM_CAP;
      fig.style.setProperty('--w', `${w}px`);
      fig.style.setProperty('--x', `${Math.round(x)}px`);
      fig.style.setProperty('--y', `${Math.round(y)}px`);
      x += w + g;
      rowH = Math.max(rowH, winH);
    });
    y += rowH + ITEM_GAP;
  }
  root.style.height = `${Math.ceil(y)}px`;
}

function buildItems(list, root) {
  return list.map((p, i) => {
    const fig = document.createElement('figure');
    fig.className = 'item hidden' + (p.sold ? ' item--sold' : '');
    fig._ar = p.ar || 0.75;
    fig._r = Math.random();   /* semente estável p/ o tamanho espelhado da fileira */
    fig.style.setProperty('--ar', fig._ar);
    fig.style.transitionDelay = `${i * 60}ms`;

    const slug = p.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const win = browserWindow({
      title: p.name.toLowerCase(),
      addr: `noizeox.shop/${slug}`,
      media: { title: p.name, src: p.img },
      bookmarks: p.bookmarks,
      compact: true,
    });
    fig.appendChild(win);

    const cap = document.createElement('figcaption');
    cap.className = 'cap';
    cap.innerHTML = `<b>${p.name}</b><span>${p.price}</span>` + (p.sold ? `<span class="sold">Esgotado</span>` : '');
    fig.appendChild(cap);

    root.appendChild(fig);

    /* se a proporção real da foto divergir da declarada, corrige e reempilha */
    const imgEl = $('.win__body img', win);
    imgEl?.addEventListener('load', () => {
      const r = imgEl.naturalWidth / imgEl.naturalHeight;
      if (r && Math.abs(r - fig._ar) > 0.01) {
        fig._ar = r;
        fig.style.setProperty('--ar', r);
        scheduleRelayout();
      }
    });

    makeDraggable(fig, () => focusItem(fig));
    makeResizable(win, () => focusItem(fig));
    $('[data-close]', win).addEventListener('click', () => {
      fig.classList.add('hidden');
      setTimeout(() => (fig.style.visibility = 'hidden'), 550);
    });
    return fig;
  });
}

const productFigs = buildItems(PRODUCTS, $('#stage'));
const shapeFigs   = buildItems(SHAPES, $('#shapes'));
const allItems = [...productFigs, ...shapeFigs];

function relayoutItems() {
  layoutMasonry(productFigs, $('#stage'));
  layoutMasonry(shapeFigs, $('#shapes'));
}
let rlt;
function scheduleRelayout() { clearTimeout(rlt); rlt = setTimeout(relayoutItems, 120); }
relayoutItems();
addEventListener('resize', scheduleRelayout);
addEventListener('load', relayoutItems);

function focusItem(fig) {
  allItems.forEach((f) => f.classList.toggle('is-focused', f === fig));
  fig.style.zIndex = ++zi;
}
document.addEventListener('pointerdown', (e) => {
  if (!e.target.closest('.item')) allItems.forEach((f) => f.classList.remove('is-focused'));
});

const io = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.remove('hidden');
      setTimeout(() => (entry.target.style.transitionDelay = ''), 600);
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
allItems.forEach((fig) => io.observe(fig));

/* ===========================================================================
   MENU — logo voadora (fixa à esquerda, arrastável) que abre uma janela de
   navegador com a navegação do site. Mesmo chrome Aqua das demais janelas.
   Conteúdo espelha a sidebar do site (categorias + seções + carrinho/entrar),
   renderizado no estilo vidro/hairline já estabelecido.
   =========================================================================== */
const NAV = [
  { label: 'Início',         href: '#inicio',    ico: 'home', active: true },
  { label: 'Jaquetas',       href: '#jaquetas',  ico: 'hanger' },
  { label: 'Blusas Moletom', href: '#moletom',   ico: 'sweater' },
  { label: 'Camisetas',      href: '#camisetas', ico: 'tshirt' },
  { label: 'Calças',         href: '#calcas',    ico: 'pants' },
  { label: 'Bolsas',         href: '#bolsas',    ico: 'bag' },
  { label: 'Toucas',         href: '#toucas',    ico: 'beanie' },
];
const NAV_SEC = [
  { label: 'Vídeos',         href: '#videos',   ico: 'play' },
  { label: 'Lookbook',       href: '#lookbook', ico: 'book' },
  { label: 'Sobre a noizeox',href: '#sobre',    ico: 'info' },
  { label: 'Contato',        href: '#contato',  ico: 'mail' },
];

/* ícones 16px, traço = currentColor (herdam a cor do link, inclusive no hover) */
const ICONS = {
  home:   '<path d="M2 8l6-5 6 5M4 7v6h8V7"/>',
  hanger: '<path d="M8 3a1.4 1.4 0 1 0 1.4 1.4c0 1-1.4 1.3-1.4 2.4M2 12l6-3.4L14 12M2.5 12h11"/>',
  sweater:'<path d="M4 4L1 6l1.4 2L4 7.2V14h8V7.2L13.6 8 15 6l-3-2-2 1H6L4 4z"/>',
  tshirt: '<path d="M5.5 3L2.5 5l1.3 2.2L5.5 7v7h5V7l1.7.2L13.5 5l-3-2-1.3 1.4H6.8L5.5 3z"/>',
  pants:  '<path d="M4 2h8l-.6 12H8.6L8 6.5 7.4 14H4.6L4 2z"/>',
  bag:    '<path d="M4.5 5h7l.9 9h-8.8l.9-9zM6.2 5a1.8 1.8 0 0 1 3.6 0"/>',
  beanie: '<path d="M3.5 10a4.5 4.5 0 0 1 9 0M2.5 10h11v2.2h-11z"/>',
  play:   '<path d="M5 3.2l8 4.8-8 4.8V3.2z"/>',
  book:   '<path d="M3.5 3h6a2 2 0 0 1 2 2v8h-6a2 2 0 0 0-2 2V3z"/>',
  info:   '<circle cx="8" cy="8" r="5.5"/><path d="M8 7.2v3.6M8 5.2h.01"/>',
  mail:   '<path d="M2.5 4h11v8h-11V4zM2.5 4.5L8 9l5.5-4.5"/>',
  cart:   '<path d="M2 3h1.8l1.7 7.5h6.4L14 5.5H5M6.7 13.3h.01M11.6 13.3h.01"/>',
  user:   '<path d="M8 8a2.4 2.4 0 1 0 0-4.8A2.4 2.4 0 0 0 8 8zM3.4 13.6C4.3 10.9 6 9.7 8 9.7s3.7 1.2 4.6 3.9"/>',
  globe:  '<circle cx="8" cy="8" r="6"/><path d="M2 8h12M8 2c2.2 2 2.2 10 0 12M8 2c-2.2 2-2.2 10 0 12"/>',
  film:   '<rect x="2.5" y="3" width="11" height="10" rx="1.5"/><path d="M6 3v10M10 3v10M2.5 6.5h3.5M2.5 9.5h3.5M10 6.5h3.5M10 9.5h3.5"/>',
  'chev-l': '<path d="M10 3.5 5.5 8l4.5 4.5"/>',
  'chev-r': '<path d="M6 3.5 10.5 8 6 12.5"/>',
};
const svgIco = (name) =>
  `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" ` +
  `stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`;

const keyOf = (i) => i.href.replace('#', '');
const LABELS = Object.fromEntries([...NAV, ...NAV_SEC].map((i) => [keyOf(i), i.label]));

/* --- dados da aba Início (fotos reais em assets/products) ------------- */
const COLLECTIONS = [
  { label: 'jaquetas',  key: 'jaquetas',  img: IMG('jeans-high-neck-jacket') },
  { label: 'moletom',   key: 'moletom',   img: IMG('zip-hoodie-logo') },
  { label: 'camisetas', key: 'camisetas', img: IMG('sueter-noizeox') },
  { label: 'calças',    key: 'calcas',    img: IMG('jeans-branches') },
  { label: 'bolsas',    key: 'bolsas',    img: IMG('bolsa-cotele') },
  { label: 'toucas',    key: 'toucas',    img: IMG('beanie-branches') },
];
const HOME_VIDEOS = [
  { t: 'ryan for noizeox',    src: 'assets/ryan.mp4' },
  { t: 'drope for noizeox',   src: 'assets/drope.mp4' },
  { t: 'parte 01 – curitiba', src: 'assets/part-1.mp4' },
];
const FEATURED = [
  { name: 'jaqueta washed brown', price: 'R$ 499,00', img: IMG('jeans-high-neck-jacket') },
  { name: 'bolsa utility preta',  price: 'R$ 179,00', img: IMG('bolsa-cotele') },
  { name: 'touca noizeox marrom', price: 'R$ 119,00', img: IMG('beanie-branches') },
];

/* --- aba Vídeos --------------------------------------------------------- */
/* legendas de data para a grade "todos os vídeos" (placeholder de POC,
   1 por item de VIDEOS, na mesma ordem) */
const VIDEO_DATES = [
  '12 jul', '26 jul', '04 ago', '15 ago', '09 ago', '21 mar',
  '02 ago', '30 jun', '18 mai', '11 abr', '24 jul', '22 jan',
];
const FEATURED_VIDEO = { src: 'assets/part-1.mp4', t: 'noizeox – last summer' };

/* mm:ss a partir de segundos */
const fmtDur = (s) =>
  isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}` : '';

/* --- abas de roupas (catálogo por categoria) -------------------------- */
/* Dados de POC: nomes/preços fictícios, fotos reais recicladas de
   assets/products. 8 itens por página; jaquetas tem 3 páginas como no modelo. */
const CAT_META = {
  jaquetas:  { ico: 'hanger',  title: 'JAQUETAS',       desc: 'peças desenvolvidas para o dia a dia. resistência, conforto e estilo em qualquer sessão.' },
  moletom:   { ico: 'sweater', title: 'BLUSAS MOLETOM', desc: 'gramatura pesada e caimento solto. feito pra rodar o dia inteiro.' },
  camisetas: { ico: 'tshirt',  title: 'CAMISETAS',      desc: 'algodão encorpado e estampas da casa. básico que aguenta o corre.' },
  calcas:    { ico: 'pants',   title: 'CALÇAS',         desc: 'modelagem ampla com reforço nos pontos de atrito. liberdade pra andar.' },
  bolsas:    { ico: 'bag',     title: 'BOLSAS',         desc: 'shoulder bags e mochilas utilitárias pra levar o essencial.' },
  toucas:    { ico: 'beanie',  title: 'TOUCAS',         desc: 'tricô fechado pro frio de curitiba. clássicas e do dia a dia.' },
};
const CAT_SINGULAR = {
  jaquetas: 'jaqueta', moletom: 'moletom', camisetas: 'camiseta',
  calcas: 'calça', bolsas: 'bolsa', toucas: 'touca',
};
const CAT_NAMES = {
  jaquetas: ['washed brown', 'coach black', 'corta vento noizeox', 'puffer olive', 'denim', 'workwear', 'fleece', 'classic beige', 'harrington', 'bomber ripstop', 'trucker rígida', 'parka utilitária', 'varsity wool', 'shell nylon', 'chore coat', 'field jacket', 'anorak ripstop', 'denim sherpa', 'liner acolchoada', 'racing jacket'],
  moletom: ['crewneck logo', 'hoodie branches', 'zip hoodie logo', 'quarter zip', 'flanelado careca', 'boxy pesado', 'tie-dye session', 'raglan cinza', 'hoodie oversized', 'careca bordado', 'half-zip lã', 'cropped session'],
  camisetas: ['tee logo', 'tee branches', 'pocket tee', 'oversized preta', 'ringer tee', 'longsleeve logo', 'tee acid wash', 'tee skate co.', 'tee 22 jan', 'baby tee', 'tee panorama', 'tee archive'],
  calcas: ['jeans branches', 'cargo ripstop', 'chino reta', 'wide leg cru', 'jeans stone', 'tactel preta', 'carpenter bege', 'jeans black', 'pregas alfaiataria', 'sarja worker', 'jeans destroyed', 'jogger tech'],
  bolsas: ['shoulder cotelê', 'mochila utility', 'sling ripstop', 'tote lona', 'pochete tech', 'hip bag logo', 'mochila roll-top', 'crossbody nylon'],
  toucas: ['branches', 'canelada logo', 'curta preta', 'fisherman cru', 'acrílico laranja', 'dupla face', 'logo bordado', 'slouchy cinza'],
};
const CAT_IMGS = {
  jaquetas:  ['jeans-high-neck-jacket', 'wool-zip-logo', 'quarter-zip-high-neck'],
  moletom:   ['zip-hoodie-logo', 'sueter-noizeox', 'quarter-zip-high-neck'],
  camisetas: ['sueter-noizeox', 'zip-hoodie-logo'],
  calcas:    ['jeans-branches', 'jeans-high-neck-jacket'],
  bolsas:    ['bolsa-cotele'],
  toucas:    ['beanie-branches'],
};
const CATS = Object.keys(CAT_META);
const CAT_PAGE_SIZE = 8;
const CATALOG = Object.fromEntries(CATS.map((k) => {
  const imgs = CAT_IMGS[k];
  return [k, CAT_NAMES[k].map((n, i) => ({
    name: `${CAT_SINGULAR[k]} ${n}`,
    price: `R$ ${229 + ((i * 7) % 13) * 30},00`,
    img: IMG(imgs[i % imgs.length]),
    novo: i < 1,
  }))];
}));
const priceNum = (p) => Number(String(p.price).replace(/\D/g, ''));

function sideMarkup(activeKey) {
  const row = (i) =>
    `<li><a class="menu__link${keyOf(i) === activeKey ? ' is-active' : ''}" ` +
    `href="${i.href}" data-key="${keyOf(i)}">${svgIco(i.ico)}<span>${i.label}</span></a></li>`;
  return `
    <aside class="menu__side">
      <div class="menu__brand"><img src="assets/logo-preta.png" alt=""><b>noizeox</b></div>
      <nav>
        <ul class="menu__list">${NAV.map(row).join('')}</ul>
        <div class="menu__sep"></div>
        <ul class="menu__list">${NAV_SEC.map(row).join('')}</ul>
      </nav>
      <div class="menu__foot">
        <a class="menu__pill" href="#carrinho">${svgIco('cart')}<span>Carrinho (0)</span></a>
        <a class="menu__pill" href="#entrar">${svgIco('user')}<span>Entrar</span></a>
      </div>
    </aside>`;
}

function inicioPane() {
  const col = (c) =>
    `<a class="col" data-key="${c.key}"><span class="col__img"><img src="${c.img}" alt=""></span>` +
    `<span class="col__l">${c.label}</span></a>`;
  const vid = (v) =>
    `<li><span class="vthumb"><video data-src="${v.src}" muted playsinline preload="metadata"></video></span>` +
    `<span class="vmeta"><b>${v.t}</b><span class="vdur"></span></span></li>`;
  const feat = (p) =>
    `<div class="pcard"><span class="pcard__img"><img src="${p.img}" alt=""></span>` +
    `<b>${p.name}</b><span>${p.price}</span></div>`;
  return `
    <div class="home">
      <section class="card home__hero">
        <div class="home__intro">
          <h1>bem-vindo à noizeox.</h1>
          <p class="lead">feito pra andar, feito pra durar.</p>
          <p class="muted">roupas e acessórios<br>inspirados no skate e na vida real.</p>
        </div>
        <div class="home__video">
          <video src="assets/part-1.mp4" muted loop autoplay playsinline></video>
        </div>
      </section>

      <section class="card">
        <h2 class="card__t">COLEÇÕES</h2>
        <div class="colgrid">${COLLECTIONS.map(col).join('')}</div>
      </section>

      <div class="home__row">
        <section class="card">
          <h2 class="card__t">VÍDEOS</h2>
          <ul class="vlist">${HOME_VIDEOS.map(vid).join('')}</ul>
          <button class="btn-ghost" data-goto="videos">ver todos os vídeos</button>
        </section>
        <section class="card">
          <h2 class="card__t">DESTAQUES</h2>
          <div class="pgrid">${FEATURED.map(feat).join('')}</div>
          <button class="btn-ghost" data-goto="jaquetas">ver todos os produtos</button>
        </section>
      </div>

      <footer class="card site-foot">
        <div class="sf__brand">${svgIco('globe')}<span><b>noizeox.shop</b><small>online desde 2022</small></span></div>
        <p class="sf__mid">Frete para todo o Brasil. Trocas e devoluções em até 7 dias.</p>
        <div class="sf__cta"><span>saiba primeiro novidades e drops:</span><button class="btn-solid">inscreva-se</button></div>
      </footer>
    </div>`;
}

function videosPane() {
  const card = (v, i) =>
    `<a class="vcard">
       <span class="vcard__thumb">
         <video data-src="${v.src}" muted playsinline preload="metadata"></video>
         <span class="vdur"></span>
       </span>
       <span class="vcard__meta"><b>${v.t}</b><small>${VIDEO_DATES[i] || ''}</small></span>
     </a>`;
  return `
    <div class="videos">
      <div class="vid-head">
        <span class="vid-head__ico">${svgIco('film')}</span>
        <div>
          <h1>VÍDEOS</h1>
          <p>Produções audiovisuais, lookbooks animados e sessions de Curitiba e mais cidades.</p>
        </div>
      </div>

      <section class="card">
        <h2 class="card__t">DESTAQUE DA SEMANA</h2>
        <div class="vid-feat">
          <div class="vid-feat__info">
            <p>Assista a “${FEATURED_VIDEO.t}”, nosso curta mais novo, gravado em 16&nbsp;mm no centro histórico.</p>
            <button class="btn-solid" data-feat-play>${svgIco('play')}<span>Assistir curta</span></button>
          </div>
          <div class="vid-feat__player">
            <video src="${FEATURED_VIDEO.src}" muted loop autoplay playsinline></video>
            <div class="vid-bar">
              <span class="vid-bar__btn">&#9198;</span>
              <span class="vid-bar__btn vid-bar__btn--play">&#9654;</span>
              <span class="vid-bar__btn">&#9197;</span>
              <span class="vid-bar__track"></span>
              <span class="vid-bar__time">0:00</span>
            </div>
          </div>
        </div>
      </section>

      <h2 class="vid-all__t">Todos os vídeos (${VIDEOS.length})</h2>
      <div class="vgrid">${VIDEOS.map(card).join('')}</div>
    </div>`;
}

const SORTS = [
  ['recentes', 'mais recentes'],
  ['menor-preco', 'menor preço'],
  ['maior-preco', 'maior preço'],
  ['az', 'A–Z'],
];

function categoryPane(key) {
  const meta = CAT_META[key];
  const list = CATALOG[key].slice();
  if (catSort === 'menor-preco') list.sort((a, b) => priceNum(a) - priceNum(b));
  else if (catSort === 'maior-preco') list.sort((a, b) => priceNum(b) - priceNum(a));
  else if (catSort === 'az') list.sort((a, b) => a.name.localeCompare(b.name, 'pt'));

  const pages = Math.max(1, Math.ceil(list.length / CAT_PAGE_SIZE));
  const pg = clamp(catPage, 0, pages - 1);
  const slice = list.slice(pg * CAT_PAGE_SIZE, pg * CAT_PAGE_SIZE + CAT_PAGE_SIZE);

  const card = (p) => `
    <div class="pcard2">
      <span class="pcard2__img">
        ${p.novo ? '<span class="pcard2__badge">NOVO</span>' : ''}
        <img src="${p.img}" alt="">
      </span>
      <div class="pcard2__foot">
        <div><b>${p.name}</b><span class="pcard2__price">${p.price}</span></div>
        <button class="pcard2__add" data-add aria-label="adicionar ao carrinho">${svgIco('cart')}</button>
      </div>
    </div>`;

  const opt = ([v, t]) => `<option value="${v}"${v === catSort ? ' selected' : ''}>${t}</option>`;

  return `
    <div class="cat">
      <div class="cat__head">
        <span class="cat__ico">${svgIco(meta.ico)}</span>
        <div class="cat__title">
          <h1>${meta.title}</h1>
          <p>${meta.desc}</p>
        </div>
        <label class="cat__sort">ordenar por:
          <select data-sort>${SORTS.map(opt).join('')}</select>
        </label>
      </div>

      <div class="pgrid2">${slice.map(card).join('')}</div>

      <div class="cat__pager">
        <button class="pager-btn" data-page="-1"${pg === 0 ? ' disabled' : ''}>${svgIco('chev-l')}</button>
        <span>${pg + 1} de ${pages}</span>
        <button class="pager-btn" data-page="1"${pg === pages - 1 ? ' disabled' : ''}>${svgIco('chev-r')}</button>
      </div>
    </div>`;
}

function paneMarkup(key) {
  if (key === 'inicio') return inicioPane();
  if (key === 'videos') return videosPane();
  if (CATS.includes(key)) return categoryPane(key);
  return `<div class="pane-stub">${LABELS[key] || key} — em breve</div>`;
}

function menuMarkup(activeKey) {
  return `<div class="menu">${sideMarkup(activeKey)}` +
    `<div class="menu__pane">${paneMarkup(activeKey)}</div></div>`;
}

let menuWin = null;
let menuKey = 'inicio';
let catPage = 0;                 /* página atual da grade de categoria */
let catSort = 'recentes';        /* ordenação atual da grade de categoria */

/* re-renderiza só o painel mantendo a seção atual (paginação / ordenação) */
function rerenderPane() {
  if (!menuWin) return;
  const pane = $('.menu__pane', menuWin);
  pane.innerHTML = paneMarkup(menuKey);
  wirePane(pane);
}

/* troca a seção ativa sem fechar a janela */
function selectSection(key) {
  if (!menuWin) return;
  if (key !== menuKey) { catPage = 0; catSort = 'recentes'; }
  menuKey = key;
  const pane = $('.menu__pane', menuWin);
  pane.innerHTML = paneMarkup(key);
  pane.scrollTop = 0;
  menuWin.querySelectorAll('.menu__link').forEach((a) =>
    a.classList.toggle('is-active', a.dataset.key === key));
  const label = LABELS[key] || key;
  const tab = $('.win__tab-t', menuWin);
  const addr = $('.addr-t', menuWin);
  if (tab)  tab.textContent  = label.toLowerCase();
  if (addr) addr.textContent = 'noizeox.shop' + (key === 'inicio' ? '' : '/' + key);
  wirePane(pane);
}

/* liga os atalhos internos do painel (navegação, vídeos, grade de categoria) */
function wirePane(pane) {
  pane.querySelectorAll('[data-goto], .col[data-key]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      selectSection(el.dataset.goto || el.dataset.key);
    });
  });

  const sortSel = pane.querySelector('[data-sort]');
  sortSel?.addEventListener('change', () => {
    catSort = sortSel.value;
    catPage = 0;
    rerenderPane();
  });
  pane.querySelectorAll('[data-page]').forEach((b) => {
    b.addEventListener('click', () => {
      catPage = Math.max(0, catPage + Number(b.dataset.page));
      rerenderPane();
      $('.menu__pane', menuWin).scrollTop = 0;
    });
  });
  pane.querySelectorAll('[data-add]').forEach((b) => {
    b.addEventListener('click', (e) => e.preventDefault());  /* POC: sem carrinho */
  });

  hydrateThumbs(pane);
  wireFeaturedVideo(pane);
}

/* transforma cada <video data-src> numa thumb real: carrega os metadados,
   avança pra um frame com imagem e escreve a duração (mm:ss) no .vdur
   mais próximo (badge da grade ou texto da lista). */
function hydrateThumbs(pane) {
  const load = (v) => {
    v.muted = true;
    v.playsInline = true;
    const scope = v.closest('li, .vcard') || v.parentElement;
    const durEl = scope && scope.querySelector('.vdur');
    const box = v.closest('.vthumb, .vcard__thumb');

    v.addEventListener('loadedmetadata', () => {
      const d = v.duration;
      if (durEl && isFinite(d)) durEl.textContent = fmtDur(d);
      try { v.currentTime = Math.min(1.2, (isFinite(d) ? d : 4) / 3); } catch (_) {}
    }, { once: true });
    v.addEventListener('error', () => box && box.classList.add('vthumb--empty'), { once: true });

    v.src = v.dataset.src;
    v.removeAttribute('data-src');
    v.load();
  };

  const vids = [...pane.querySelectorAll('video[data-src]')];
  if (!('IntersectionObserver' in window)) { vids.forEach(load); return; }
  const io = new IntersectionObserver((ents, obs) => {
    ents.forEach((e) => {
      if (!e.isIntersecting) return;
      obs.unobserve(e.target);
      load(e.target);
    });
  }, { root: pane, rootMargin: '200px' });
  vids.forEach((v) => io.observe(v));
}

/* player do "destaque da semana": barra decorativa acompanha o tempo real;
   o botão "Assistir curta" alterna play/pause e tira o mudo. */
function wireFeaturedVideo(pane) {
  const player = pane.querySelector('.vid-feat__player');
  if (!player) return;
  const v = player.querySelector('video');
  const timeEl = player.querySelector('.vid-bar__time');
  const track = player.querySelector('.vid-bar__track');
  const playBtn = player.querySelector('.vid-bar__btn--play');
  const cta = pane.querySelector('[data-feat-play]');

  const sync = () => {
    if (timeEl) timeEl.textContent = fmtDur(v.duration || 0);
    if (track && v.duration) track.style.setProperty('--p', `${(v.currentTime / v.duration) * 100}%`);
    const playing = !v.paused;
    if (playBtn) playBtn.innerHTML = playing ? '&#10073;&#10073;' : '&#9654;';
  };
  v.addEventListener('loadedmetadata', sync, { once: true });
  v.addEventListener('timeupdate', () => {
    if (track && v.duration) track.style.setProperty('--p', `${(v.currentTime / v.duration) * 100}%`);
  });
  v.addEventListener('play', sync);
  v.addEventListener('pause', sync);

  const toggle = () => {
    if (v.paused) { v.muted = false; v.play?.().catch(() => {}); }
    else v.pause();
  };
  cta?.addEventListener('click', toggle);
  playBtn?.addEventListener('click', toggle);
}

/* abre a janela ocupando a página inteira, já na aba Início */
function openMenu() {
  if (menuWin) return;
  const win = browserWindow({
    title: 'início',
    addr: 'noizeox.shop',
    content: menuMarkup(menuKey),
  });
  win.classList.add('win--menu');
  win.style.opacity = '0';
  document.body.appendChild(win);
  menuWin = win;

  requestAnimationFrame(() => {
    win.style.transition = 'opacity .18s ease';
    win.style.opacity = '1';
  });

  makeDraggable(win, () => { win.style.zIndex = 9001; });
  $('[data-close]', win).addEventListener('click', closeMenu);
  win.querySelectorAll('.menu__link').forEach((a) =>
    a.addEventListener('click', (e) => { e.preventDefault(); selectSection(a.dataset.key); }));
  win.querySelectorAll('.menu__pill').forEach((a) =>
    a.addEventListener('click', (e) => e.preventDefault()));
  wirePane($('.menu__pane', win));
  menuDock.classList.add('is-open');
}

function closeMenu() {
  if (!menuWin) return;
  const w = menuWin;
  menuWin = null;
  menuDock.classList.remove('is-open');
  w.style.opacity = '0';
  setTimeout(() => w.remove(), 180);
}

function toggleMenu() {
  if (menuWin) closeMenu(); else openMenu();
}

/* --- logo voadora ------------------------------------------------------- */
const menuDock = document.createElement('button');
menuDock.type = 'button';
menuDock.className = 'menu-dock';
menuDock.setAttribute('aria-label', 'abrir menu');
menuDock.innerHTML = `<img src="assets/logo-preta.png" alt="noizeox">`;
document.body.appendChild(menuDock);

/* arrasta a logo; se não houve arraste (< 4px), conta como clique = toggle */
menuDock.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  const r = menuDock.getBoundingClientRect();
  const sx = e.clientX, sy = e.clientY;
  const ox = e.clientX - r.left, oy = e.clientY - r.top;
  let moved = false;
  menuDock.setPointerCapture?.(e.pointerId);
  menuDock.style.transition = 'none';

  const move = (ev) => {
    if (!moved && Math.abs(ev.clientX - sx) + Math.abs(ev.clientY - sy) > 4) moved = true;
    if (!moved) return;
    menuDock.style.left = `${clamp(ev.clientX - ox, 6, innerWidth  - r.width  - 6)}px`;
    menuDock.style.top  = `${clamp(ev.clientY - oy, 6, innerHeight - r.height - 6)}px`;
    menuDock.style.bottom = 'auto';
  };
  const up = () => {
    menuDock.style.transition = '';
    menuDock.releasePointerCapture?.(e.pointerId);
    document.removeEventListener('pointermove', move);
    document.removeEventListener('pointerup', up);
    if (!moved) toggleMenu();
  };
  document.addEventListener('pointermove', move);
  document.addEventListener('pointerup', up);
});

addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

/* --- start ---------------------------------------------------------------- */
/* A tela inicial do site continua sendo a antiga (hero + produtos + shapes).
   O menu abre só pela logo voadora e, ao abrir, já vem na aba Início. */
addEventListener('load', initHero);
