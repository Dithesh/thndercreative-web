/* Thunder Creatives — scroll-zoom project grid, lens wordmark, project popup. No build step. */
(function () {
  'use strict';

  const PROJECTS = window.TC_PROJECTS || [];
  const N = PROJECTS.length;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const mod = (n, m) => ((n % m) + m) % m;
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------
     Visited projects (per-browser convenience, safe if storage is blocked)
  --------------------------------------------------------- */
  const SEEN_KEY = 'tc-seen-projects';
  let seen = new Set();
  try { seen = new Set(JSON.parse(localStorage.getItem(SEEN_KEY) || '[]')); } catch (e) { /* storage unavailable */ }
  const saveSeen = () => { try { localStorage.setItem(SEEN_KEY, JSON.stringify([...seen])); } catch (e) { /* ignore */ } };

  /* ---------------------------------------------------------
     Smooth scroll
  --------------------------------------------------------- */
  const lenis = typeof window.Lenis === 'function' && !reduceMotion
    ? new window.Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1 })
    : null;

  const scrollToTarget = (target) => {
    if (lenis) lenis.scrollTo(target, { duration: 1.4 });
    else if (target === 0) window.scrollTo({ top: 0, behavior: 'smooth' });
    else target.scrollIntoView({ behavior: 'smooth' });
  };
  $$('[data-scroll]').forEach((a) => a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    const el = id === '#top' ? 0 : $(id);
    if (el === null) return;
    e.preventDefault();
    scrollToTarget(el);
  }));
  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });

  /* ---------------------------------------------------------
     Hover stretch: clickable text widens letter by letter (variable font width axis)
  --------------------------------------------------------- */
  function splitStretch(el) {
    if (el.classList.contains('stretch')) return;
    el.classList.add('stretch');
    let i = 0;
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          for (const ch of n.textContent) {
            const s = document.createElement('span');
            s.className = 'ch';
            s.style.setProperty('--i', i++);
            s.textContent = ch;
            frag.appendChild(s);
          }
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== 'svg' && n.tagName !== 'SUP') walk(n);
      });
    };
    walk(el);
    if (!el.getAttribute('aria-label') && el.matches('a, button')) el.setAttribute('aria-label', el.textContent.trim());
  }
  $$('.head a, .info a, .foot a, .modal__info a, .mi__btn').forEach(splitStretch);

  /* ---------------------------------------------------------
     Wordmark: letters slide right-to-left through a "lens". The magnified middle fills most of the
     width; towards each edge 3-4 letters get progressively thinner, down to slivers.
     Horizontal scale along the text:
       scale(s) = FLOOR + LENS_MAX·exp(-(s/σ)²) + SIDE·exp(-(s/τ)²)      (σ = centre zone, τ = side taper)
     Screen x is its running integral, so letters stay edge-to-edge with no gaps or overlaps.
  --------------------------------------------------------- */
  const BOLT = '<svg viewBox="65 0 126 256" aria-hidden="true"><polygon points="123.1 116.07 65.65 72.23 65.65 256 132.9 139.16 190.35 183.77 190.35 0 123.1 116.07"/></svg>';
  const WORD = [...'THUNDER', 'BOLT', ...'CREATIVES', '©'];
  const LENS_MAX = 1.6;            // magnification at the centre
  const LENS_WIDTH = 0.22;         // σ as a fraction of the wordmark width — size of the magnified zone
  const SIDE = 0.3;                // scale of the first slim letter next to the magnified zone
  const SIDE_TAPER = 0.8;          // τ as a fraction of width — smaller = side letters thin out faster
  const FLOOR = 0.02;              // keeps the outermost slivers from vanishing, and guarantees the text reaches the edges
  const lensScale = (s, sigma, tau) => FLOOR + LENS_MAX * Math.exp(-((s / sigma) ** 2)) + SIDE * Math.exp(-((s / tau) ** 2));

  class Wordmark {
    constructor(el) {
      this.el = el;
      this.offset = Math.random() * 2000;
      this.visible = true;
      this.items = [];
      new IntersectionObserver(([en]) => { this.visible = en.isIntersecting; }).observe(el);
    }
    // screen x (relative to centre) of a point at natural distance s from the lens centre
    X(s) {
      const a = Math.abs(s) / this.step;
      const i = Math.floor(a);
      const t = this.table;
      const v = i + 1 < t.length ? t[i] + (t[i + 1] - t[i]) * (a - i) : t[t.length - 1] + (a - t.length + 1) * this.step * 0.001;
      return s < 0 ? -v : v;
    }
    build() {
      const el = this.el;
      el.innerHTML = '';
      const W = el.clientWidth;
      const fs = parseFloat(getComputedStyle(el).fontSize);
      const gap = fs * 0.02;
      const make = (ch) => {
        const s = document.createElement('span');
        if (ch === 'BOLT') { s.className = 'bolt'; s.innerHTML = BOLT; }
        else { s.textContent = ch; if (ch === '©') s.className = 'copy'; }
        el.appendChild(s);
        return s;
      };
      const proto = WORD.map((ch) => ({ ch, w: make(ch).getBoundingClientRect().width }));
      const L1 = proto.reduce((t, p) => t + p.w + gap, 0);
      const maxW = Math.max(...proto.map((p) => p.w));
      this.W = W;
      // integrate the scale profile once into a lookup table: table[i] = screen x at natural s = i·step
      const sigma = W * LENS_WIDTH;
      const tau = W * SIDE_TAPER;
      this.step = Math.max(W / 1500, 0.5);
      this.table = [0];
      let reach = 0;
      for (let i = 1, x = 0, prev = lensScale(0, sigma, tau); i * this.step < W * 3; i++) {
        const cur = lensScale(i * this.step, sigma, tau);
        x += ((prev + cur) / 2) * this.step;
        prev = cur;
        this.table.push(x);
        if (!reach && x >= W / 2) reach = i * this.step;   // natural distance that reaches the screen edge
      }
      if (!reach) reach = W * 3;
      const copies = Math.ceil((2 * reach + 2 * maxW) / L1) + 1;
      el.innerHTML = '';
      this.items = [];
      let x = 0;
      for (let c = 0; c < copies; c++) {
        for (const p of proto) {
          this.items.push({ el: make(p.ch), x, w: p.w, shown: true, bolt: p.ch === 'BOLT' });
          x += p.w + gap;
        }
      }
      this.L = x;
      this.render();
    }
    tick(dt, speed) {
      if (!this.visible || !this.items.length) return;
      this.offset += speed * (this.W / 1440) * dt;
      this.render();
    }
    render() {
      const { L, W } = this;
      const half = W / 2;
      for (const it of this.items) {
        let s = mod(it.x - this.offset, L);
        if (s > L / 2) s -= L;
        const xa = this.X(s);
        const xb = this.X(s + it.w);
        const on = xb > -half && xa < half;
        if (on !== it.shown) { it.el.style.visibility = on ? '' : 'hidden'; it.shown = on; }
        if (!on) continue;
        let sc = (xb - xa) / it.w;
        let left = half + xa;
        if (it.bolt && sc > 1) { left += (xb - xa - it.w) / 2; sc = 1; }   // keep the bolt's shape: never stretch it, centre it in its slot
        it.el.style.transform = `translate3d(${left.toFixed(2)}px,0,0) scaleX(${sc.toFixed(4)})`;
      }
    }
  }
  const wordmarks = $$('[data-wordmark]').map((el) => new Wordmark(el));

  /* ---------------------------------------------------------
     Project rows — a camera zooming into a stack of rows.
     The rows live on a fixed stage. Row edges sit on a geometric scale towards a vanishing point
     below the screen:   edge(z) = Yv · (1 − e^(−λz))
     Scrolling slides every row's z down by the same amount, which multiplies the zoom: rows rush
     up and grow (the top ones faster than the scroll itself), lower rows follow evenly, and each
     row stays exactly on top of the next. The page height stays constant, so scrolling never stalls.
  --------------------------------------------------------- */
  const grid = $('#grid');
  const ROWS = 12;
  const K = 6;                       // tiles each side of the centre tile
  const ASPECT = 0.6;                // tile media height / width (matches CSS aspect-ratio 5/3)
  grid.style.setProperty('--k', K);

  const EYE = '<svg class="tile__eye" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12z"/><circle cx="12" cy="12" r="3"/></svg>';
  const CROSS = '<div class="tile__seen"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><line x1="0" y1="0" x2="100" y2="100"/><line x1="100" y1="0" x2="0" y2="100"/></svg></div>';
  const firstTile = new Set();

  function makeTile(p) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'tile' + (seen.has(p.id) ? ' is-seen' : '');
    b.dataset.id = p.id;
    if (firstTile.has(p.id)) { b.tabIndex = -1; b.setAttribute('aria-hidden', 'true'); }
    else { firstTile.add(p.id); b.setAttribute('aria-label', `Open project: ${p.name}`); }
    b.innerHTML =
      `<div class="tile__media"><img src="${p.cover.replace('assets/img/', 'assets/thumb/')}" alt="" loading="lazy" decoding="async" style="object-position:${p.pos || '50% 50%'}">` +
      (p.video ? `<video muted loop playsinline preload="none" data-src="${p.video}"></video>` : '') +
      `${CROSS}</div>` +
      `<div class="tile__meta"><span class="tile__name">${EYE}<span class="tile__label">${p.name}</span></span><span class="tile__year">../${p.year}</span></div>`;
    splitStretch(b.querySelector('.tile__label'));
    if (p.video) {
      const v = b.querySelector('video');
      b.addEventListener('pointerenter', () => {
        if (!v.src) v.src = v.dataset.src;
        v.play().then(() => b.classList.add('is-playing')).catch(() => {});
      });
      b.addEventListener('pointerleave', () => { v.pause(); b.classList.remove('is-playing'); });
    }
    return b;
  }

  const rows = [];
  for (let r = 0; r < ROWS; r++) {
    const centre = mod(2 + r * 5, N);
    const row = document.createElement('div');
    row.className = 'row';
    const track = document.createElement('div');
    track.className = 'row__track';
    for (let k = -K; k <= K; k++) track.appendChild(makeTile(PROJECTS[mod(centre + k, N)]));
    row.appendChild(track);
    grid.appendChild(row);
    rows.push({ el: row, w: -1, y: NaN, visible: true });
  }

  const stage = $('.stage');
  const markWrap = $('.stage__mark');
  const spacer = $('.work-spacer');
  let metrics = {};

  function measure() {
    const vw = grid.clientWidth;
    const vh = window.innerHeight;
    const css = getComputedStyle(document.documentElement);
    const gap = parseFloat(css.getPropertyValue('--gap')) || 16;
    const meta = parseFloat(css.getPropertyValue('--meta')) || 26;
    const metaH = meta + gap;
    const small = vw < 700;
    // tiles across for the row touching the top of the screen, and for the row resting on the bottom
    const acrossTop = small ? 1.15 : vw < 1100 ? 1.6 : 1.9;
    const acrossBottom = small ? 2.4 : vw < 1100 ? 3.6 : 4.5;
    const pitch = (small ? 0.3 : 0.38) * vh;          // scroll distance that advances the stack by one row
    const heroH = (small ? 0.55 : 0.72) * vh;         // where the first row starts (below the hero headline)
    markWrap.style.height = heroH.toFixed(0) + 'px';

    const hOf = (across) => (vw / across - gap) * ASPECT + metaH;
    const hT = Math.min(hOf(acrossTop), 0.7 * vh);
    const hB = Math.min(hOf(acrossBottom), hT * 0.9);
    // ratio between neighbouring rows (g) and the vanishing point (Yv) that satisfy both targets
    let g = clamp((vh - hB) / (vh - hT), 1.15, 2.4);
    let Yv = (hT * g) / (g - 1);
    if (Yv < 1.1 * vh) { Yv = 1.1 * vh; g = 1 / (1 - hT / Yv); }   // keep the vanishing point below the screen
    const lambda = Math.log(g) / pitch;               // per px of scroll
    const edge = (z) => Yv * (1 - Math.exp(-lambda * z));
    const zAt = (y) => -Math.log(1 - y / Yv) / lambda; // inverse of edge()
    // z of row i's bottom edge = z0 + (i + 1)·pitch − scroll; row 0's top starts at heroH
    const z0 = zAt(heroH);
    // the stack ends when the last row's bottom reaches the bottom of the screen
    const uEnd = Math.max(0, z0 + ROWS * pitch - zAt(vh - 1));
    spacer.style.height = (uEnd + vh).toFixed(0) + 'px';
    metrics = { vw, vh, metaH, pitch, edge, z0, uEnd, markH: markWrap.offsetHeight };
    rows.forEach((r) => { r.w = -1; r.y = NaN; });
  }

  function layoutRows() {
    const { vh, metaH, pitch, edge, z0, uEnd, markH } = metrics;
    const scroll = lenis ? lenis.animatedScroll : window.scrollY;
    const u = Math.min(scroll, uEnd);                 // zoom progress
    const lift = Math.max(0, scroll - uEnd);          // after the last row, the stage scrolls away normally
    stage.style.transform = lift ? `translate3d(0,${(-lift).toFixed(2)}px,0)` : '';
    let top = edge(z0 - u);
    markWrap.style.transform = `translate3d(0,${(top - markH).toFixed(2)}px,0)`;
    rows.forEach((r, i) => {
      const bottom = edge(z0 + (i + 1) * pitch - u);
      const h = bottom - top;
      const visible = bottom > 0 && top < vh && h > metaH + 8;
      if (visible !== r.visible) { r.el.style.visibility = visible ? '' : 'hidden'; r.visible = visible; }
      if (visible) {
        const w = (h - metaH) / ASPECT;
        if (Math.abs(w - r.w) > 0.05) { r.w = w; r.el.style.setProperty('--w', w.toFixed(2) + 'px'); }
        if (Math.abs(top - r.y) > 0.01 || r.y !== r.y) { r.y = top; r.el.style.transform = `translate3d(0,${top.toFixed(2)}px,0)`; }
      }
      top = bottom;
    });
  }

  /* ---------------------------------------------------------
     Project popup
  --------------------------------------------------------- */
  const modal = $('#modal');
  const scroller = $('.modal__scroll', modal);
  const mediaEl = $('.modal__media', modal);
  const cursorEl = $('.modal__cursor', modal);
  let current = -1;
  let openedIds = [];
  let lastFocus = null;
  let blocks = [];               // popup media blocks, revealed by scroll position
  let closeTimer = 0;
  let restoreFocus = false;

  function renderProject(i) {
    const p = PROJECTS[i];
    current = i;
    if (!openedIds.includes(p.id)) openedIds.push(p.id);
    $('.mi__title', modal).textContent = p.name;
    $('.mi__year', modal).textContent = p.year;
    const list = [['Category', [p.category]], ['Our role', p.role], ['Client', [p.client]], ['Deliverables', p.deliverables]];
    $('.mi__list', modal).innerHTML = list
      .filter(([, v]) => v && v.length)
      .map(([k, v]) => `<dt>${k}</dt><dd>${v.join('<br>')}</dd>`).join('');
    $('.mi__desc', modal).textContent = p.desc || '';
    $('.mi__count', modal).textContent = `${String(i + 1).padStart(2, '0')} / ${String(N).padStart(2, '0')}`;

    mediaEl.innerHTML = '';
    p.media.forEach((block) => {
      const fig = document.createElement('figure');
      const single = block.type === 'panel' && block.items.length === 1;
      fig.className = `mb mb--${block.type}${single ? ' mb--single' : ''}`;
      if (block.bg) fig.style.background = block.bg;
      const inner = document.createElement('div');
      inner.className = 'mb__inner';
      block.items.forEach((item) => {
        const wrap = document.createElement('div');
        wrap.className = 'mb__item';
        let el;
        if (typeof item === 'string') {
          el = document.createElement('img');
          el.alt = `${p.name} — project image`;
          el.decoding = 'async';
          el.addEventListener('load', () => wrap.style.setProperty('--ar', (el.naturalWidth / el.naturalHeight).toFixed(4)));
          el.src = item;
        } else {
          el = document.createElement('video');
          el.muted = true; el.loop = true; el.playsInline = true; el.autoplay = true;
          el.setAttribute('muted', ''); el.setAttribute('playsinline', '');
          el.preload = 'auto';
          el.poster = item.poster;
          el.setAttribute('aria-label', `${p.name} — video`);
          el.addEventListener('loadedmetadata', () => wrap.style.setProperty('--ar', (el.videoWidth / el.videoHeight).toFixed(4)));
          el.src = item.video;
        }
        wrap.appendChild(el);
        inner.appendChild(wrap);
      });
      fig.appendChild(inner);
      mediaEl.appendChild(fig);
    });
    scroller.scrollTop = 0;
    pop.target = pop.current = 0; pop.active = false;

    blocks = $$('.mb', mediaEl).map((el) => ({ el, v: reduceMotion ? 1 : 0, shown: -1 }));
    scrubBlocks();
    $$('video', mediaEl).forEach((v) => v.play().catch(() => {}));
  }

  // Scroll-linked reveal (as on the reference): a block entering from the bottom starts small,
  // pinned to the left edge and faded, and unfolds rightward to full size as it climbs the popup.
  function scrubBlocks() {
    if (!blocks.length) return;
    const vh = scroller.clientHeight;
    if (!vh) return;                                       // popup not laid out yet
    for (const b of blocks) {
      const top = b.el.getBoundingClientRect().top;      // origin is top-left, so scale never moves the top
      b.v = reduceMotion ? 1 : clamp((vh - top) / (vh * 0.62), 0, 1);
      if (Math.abs(b.v - b.shown) < 0.0003) continue;
      b.shown = b.v;
      const e = 1 - Math.pow(1 - b.v, 3);
      b.el.style.transform = e >= 1 ? '' : `scale(${(0.32 + 0.68 * e).toFixed(4)})`;
      b.el.style.opacity = e >= 1 ? '' : (0.1 + 0.9 * e).toFixed(3);
    }
  }

  function openProject(id, fromEl, viaKeyboard) {
    const i = PROJECTS.findIndex((p) => p.id === id);
    if (i < 0) return;
    clearTimeout(closeTimer);
    lastFocus = fromEl || document.activeElement;
    openedIds = [];
    renderProject(i);
    modal.hidden = false;
    document.documentElement.classList.add('modal-open');
    if (lenis) lenis.stop();
    requestAnimationFrame(() => requestAnimationFrame(() => modal.classList.add('is-open')));
    if (viaKeyboard) $('[data-close]', modal).focus({ preventScroll: true });
    else modal.focus({ preventScroll: true });
    restoreFocus = !!viaKeyboard;
  }

  function closeProject() {
    if (modal.hidden || !modal.classList.contains('is-open')) return;
    modal.classList.remove('is-open');
    cursorEl.classList.remove('is-on');
    document.documentElement.classList.remove('modal-open');
    if (lenis) lenis.start();
    $$('video', mediaEl).forEach((v) => v.pause());
    const ids = openedIds.slice();
    closeTimer = setTimeout(() => {
      modal.hidden = true;
      blocks = [];
      mediaEl.innerHTML = '';
      // mark as seen once the popup is gone, so the grey wash fades in visibly
      ids.forEach((id) => {
        seen.add(id);
        $$(`.tile[data-id="${id}"]`, grid).forEach((t) => t.classList.add('is-seen'));
      });
      saveSeen();
    }, 450);
    if (restoreFocus && lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    else if (document.activeElement) document.activeElement.blur();
  }

  grid.addEventListener('click', (e) => {
    const tile = e.target.closest('.tile');
    if (tile) openProject(tile.dataset.id, tile, e.detail === 0);
  });

  // anything that isn't a media block or the info column closes the popup
  const isContent = (t) => t.closest('.mb, .modal__info');
  scroller.addEventListener('click', (e) => { if (!isContent(e.target)) closeProject(); });
  $('[data-close]', modal).addEventListener('click', closeProject);
  $('[data-next]', modal).addEventListener('click', () => {
    mediaEl.style.opacity = '0';
    setTimeout(() => { renderProject(mod(current + 1, N)); mediaEl.style.opacity = ''; }, 220);
  });
  mediaEl.style.transition = 'opacity .22s ease';

  // smooth wheel scrolling inside the popup, same feel as the page
  const pop = { target: 0, current: 0, active: false };
  scroller.addEventListener('wheel', (e) => {
    if (e.ctrlKey || reduceMotion) return;
    e.preventDefault();
    const unit = e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? scroller.clientHeight : 1;
    const max = scroller.scrollHeight - scroller.clientHeight;
    if (!pop.active) pop.current = pop.target = scroller.scrollTop;
    pop.target = clamp(pop.target + e.deltaY * unit * 0.9, 0, max);
    pop.active = true;
  }, { passive: false });
  scroller.addEventListener('scroll', () => {
    if (!pop.active) pop.current = pop.target = scroller.scrollTop;  // keyboard / touch / scrollbar
  });
  function smoothPopup(dt) {
    if (!pop.active) return;
    pop.current += (pop.target - pop.current) * (1 - Math.pow(1 - 0.085, dt * 60));
    if (Math.abs(pop.target - pop.current) < 0.25) { pop.current = pop.target; pop.active = false; }
    scroller.scrollTop = pop.current;
  }

  scroller.addEventListener('pointermove', (e) => {
    const over = !isContent(e.target) && e.pointerType === 'mouse';
    cursorEl.classList.toggle('is-on', over);
    cursorEl.style.left = e.clientX + 'px';
    cursorEl.style.top = e.clientY + 'px';
  });
  scroller.addEventListener('pointerleave', () => cursorEl.classList.remove('is-on'));

  document.addEventListener('keydown', (e) => {
    if (modal.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); closeProject(); return; }
    if (e.key === 'Tab') {
      const f = $$('a[href], button', $('.modal__info', modal));
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------------------------------------------------------
     Main loop
  --------------------------------------------------------- */
  let last = performance.now();
  let markSpeed = 0;
  function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (lenis) lenis.raf(now);
    layoutRows();
    if (!modal.hidden) { smoothPopup(dt); scrubBlocks(); }
    // drift right-to-left, speeding up with scroll velocity (eased so it never jerks)
    const v = lenis ? Math.abs(lenis.velocity || 0) : 0;
    const want = reduceMotion ? 0 : 55 + Math.min(v * 30, 900);
    markSpeed += (want - markSpeed) * Math.min(dt * 4, 1);
    wordmarks.forEach((w) => w.tick(dt, markSpeed));
    requestAnimationFrame(frame);
  }

  function rebuild() {
    measure();
    wordmarks.forEach((w) => w.build());
    layoutRows();
  }

  let resizeTimer = 0;
  let lastW = window.innerWidth;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // ignore mobile URL-bar height jitter; only rebuild on real size changes
      if (window.innerWidth === lastW && Math.abs(window.innerHeight - metrics.vh) < 120) return;
      lastW = window.innerWidth;
      rebuild();
    }, 120);
  });

  measure();
  layoutRows();
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => {
    rebuild();
    requestAnimationFrame(frame);
  });
})();
