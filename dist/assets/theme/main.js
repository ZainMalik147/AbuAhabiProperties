// Abu Dhabi — interactions
const d = document, root = d.documentElement;
const fine = matchMedia('(pointer: fine)').matches;
let motionOff = matchMedia('(prefers-reduced-motion: reduce)').matches;
try { if (localStorage.getItem('motion') === 'off') motionOff = true; } catch (e) {}
if (motionOff) root.classList.add('no-motion');

let shown = false;
try { shown = sessionStorage.getItem('curtain') === '1'; sessionStorage.setItem('curtain', '1'); } catch (e) {}
const done = () => d.body.classList.add('is-loaded');
setTimeout(done, shown || motionOff ? 50 : 1300);

const header = d.querySelector('.site-header');
let lastY = 0;
addEventListener('scroll', () => {
  const y = scrollY;
  header.classList.toggle('is-scrolled', y > 60);
  header.classList.toggle('is-hidden', y > lastY && y > 500 && !d.body.classList.contains('menu-open'));
  lastY = y;
}, { passive: true });

const btn = d.querySelector('.menu-btn'), menu = d.getElementById('menu');
btn?.addEventListener('click', () => {
  const open = btn.getAttribute('aria-expanded') !== 'true';
  btn.setAttribute('aria-expanded', open);
  d.body.classList.toggle('menu-open', open);
  if (open) { menu.hidden = false; requestAnimationFrame(() => menu.classList.add('is-open')); menu.querySelector('a')?.focus({ preventScroll: true }); }
  else { menu.classList.remove('is-open'); setTimeout(() => (menu.hidden = true), 900); }
});
menu?.addEventListener('click', e => { if (e.target.closest('a')) btn.click(); });
d.addEventListener('keydown', e => { if (e.key === 'Escape' && btn?.getAttribute('aria-expanded') === 'true') { btn.click(); btn.focus(); } });

const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
d.querySelectorAll('.reveal').forEach(el => io.observe(el));

// Counters
const cio = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return; cio.unobserve(e.target);
  const el = e.target, to = +el.dataset.count; if (motionOff || !to) return;
  const t0 = performance.now();
  (function step(t) { const p = Math.min(1, (t - t0) / 1600); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); })(t0);
}), { threshold: .6 });
d.querySelectorAll('[data-count]').forEach(el => cio.observe(el));

// Scroll-driven motion (parallax + stacking panels), smoothed with a single rAF loop that
// only runs while something is still moving, so the page stays light when idle.
const par = [...d.querySelectorAll('[data-parallax]')];
const panels = [...d.querySelectorAll('.panel')];
const desk = matchMedia('(min-width: 1000px)');
const pstate = panels.map(() => ({ cur: 0 }));
let ticking = false;

// Tall panels stick by their bottom edge so nothing is hidden before the next one slides over.
function fitPanels() {
  panels.forEach(p => { p.style.top = desk.matches ? Math.min(0, innerHeight - p.offsetHeight) + 'px' : ''; });
}

function frame() {
  ticking = false;
  const vh = innerHeight;
  let moving = false;
  for (const el of par) {
    const r = el.parentElement.getBoundingClientRect();
    if (r.bottom < -50 || r.top > vh + 50) continue;
    const k = parseFloat(el.dataset.parallax) || .15;
    el.style.transform = `translate3d(0, ${(-r.top * k).toFixed(1)}px, 0)`;
  }
  if (desk.matches) panels.forEach((p, i) => {
    const nx = panels[i + 1]; if (!nx) return;
    const top = nx.getBoundingClientRect().top;
    let target = Math.max(0, Math.min(1, 1 - top / vh));
    target = target * target * (3 - 2 * target); // smoothstep easing
    const st = pstate[i];
    st.cur += (target - st.cur) * 0.2;
    if (Math.abs(target - st.cur) < 0.001) st.cur = target; else moving = true;
    const g = p.querySelector('.panel-grid');
    g.style.transform = `translate3d(0, ${(-st.cur * 48).toFixed(2)}px, 0) scale(${(1 - st.cur * 0.06).toFixed(4)})`;
    g.style.opacity = (1 - st.cur * 0.55).toFixed(3);
    p.style.setProperty('--shade', (st.cur * 0.6).toFixed(3));
  });
  if (moving) request();
}
function request() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
if (!motionOff && (par.length || panels.length)) {
  fitPanels();
  addEventListener('scroll', request, { passive: true });
  addEventListener('resize', () => { fitPanels(); request(); });
  addEventListener('load', () => { fitPanels(); request(); });
  request();
}

// Index hover preview (desktop)
const prev = d.querySelector('.idx-preview');
if (prev && fine && !motionOff) {
  const img = prev.querySelector('img');
  let x = 0, y = 0, cx = 0, cy = 0;
  d.querySelectorAll('.idx-list a').forEach(a => {
    a.addEventListener('pointerenter', () => { img.src = a.dataset.preview; prev.classList.add('on'); });
    a.addEventListener('pointerleave', () => prev.classList.remove('on'));
  });
  addEventListener('pointermove', e => { x = e.clientX; y = e.clientY; }, { passive: true });
  (function follow() { cx += (x - cx) * .14; cy += (y - cy) * .14; prev.style.left = cx + 'px'; prev.style.top = cy + 'px'; requestAnimationFrame(follow); })();
}

const mt = d.querySelector('.motion-toggle');
if (mt) {
  mt.setAttribute('aria-pressed', motionOff);
  mt.textContent = motionOff ? 'Resume motion' : 'Pause motion';
  mt.addEventListener('click', () => { try { localStorage.setItem('motion', motionOff ? 'on' : 'off'); } catch (e) {} location.reload(); });
}

const canvas = d.querySelector('.hero-gl');
if (canvas && !motionOff && !(navigator.connection && navigator.connection.saveData)) {
  const go = () => import('./scene.js').then(m => m.start(canvas)).catch(() => {});
  ('requestIdleCallback' in window) ? requestIdleCallback(go, { timeout: 1200 }) : setTimeout(go, 400);
}
