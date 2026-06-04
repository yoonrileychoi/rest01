// ── DARK / LIGHT MODE ──
const darkmodeBtn = document.getElementById('darkmodeToggle');
const isLight = localStorage.getItem('lightMode') === 'true';
if (isLight) { document.body.classList.add('light-mode'); darkmodeBtn.textContent = '☀️'; }

darkmodeBtn.addEventListener('click', () => {
  const light = document.body.classList.toggle('light-mode');
  darkmodeBtn.textContent = light ? '☀️' : '🌙';
  localStorage.setItem('lightMode', light);
});

// ── THEME SWITCHER ──
const themeCss    = document.getElementById('theme-css');
const paletteToggle = document.getElementById('paletteToggle');
const palettePanel  = document.getElementById('palettePanel');
const paletteOpts   = document.querySelectorAll('.palette-option');

function applyTheme(name) {
  themeCss.href = `assets/css/themes/theme-${name}.css`;
  localStorage.setItem('theme', name);
  paletteOpts.forEach(o => o.classList.toggle('active', o.dataset.theme === name));
  // 파티클 색상 갱신 (테마 로드 후)
  themeCss.onload = updateParticleColor;
}

const savedTheme = localStorage.getItem('theme') || 'green';
applyTheme(savedTheme);

paletteToggle.addEventListener('click', () => {
  palettePanel.classList.toggle('open');
});
paletteOpts.forEach(btn => {
  btn.addEventListener('click', () => {
    applyTheme(btn.dataset.theme);
    palettePanel.classList.remove('open');
  });
});
document.addEventListener('click', e => {
  if (!palettePanel.contains(e.target) && e.target !== paletteToggle)
    palettePanel.classList.remove('open');
});

// ── HAMBURGER MENU ──
const burger   = document.getElementById('navBurger');
const navLinks = document.getElementById('navLinks');

burger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-expanded', open);
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  });
});

// ── PARTICLE BACKGROUND ──
const canvas = document.getElementById('particleCanvas');
const ctx    = canvas.getContext('2d');
let particleColor = '82,183,136';

function updateParticleColor() {
  const s = getComputedStyle(document.documentElement);
  const r = s.getPropertyValue('--particle-r').trim();
  const g = s.getPropertyValue('--particle-g').trim();
  const b = s.getPropertyValue('--particle-b').trim();
  if (r) particleColor = `${r},${g},${b}`;
}
updateParticleColor();

function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resize();
window.addEventListener('resize', resize, { passive: true });

const PARTICLE_COUNT = 72;
const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
  x:     Math.random() * canvas.width,
  y:     Math.random() * canvas.height,
  r:     Math.random() * 1.8 + 0.4,
  dx:    (Math.random() - 0.5) * 0.35,
  dy:    (Math.random() - 0.5) * 0.35,
  alpha: Math.random() * 0.5 + 0.15,
}));

function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${particleColor},${p.alpha})`;
    ctx.fill();
    p.x += p.dx; p.y += p.dy;
    if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
  });
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(${particleColor},${0.12 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();

// ── GSAP MOTION PATH ──
if (typeof gsap !== 'undefined' && typeof MotionPathPlugin !== 'undefined') {
  gsap.registerPlugin(MotionPathPlugin);
  gsap.to('#deco-rect', {
    motionPath: {
      path: '#deco-path',
      align: '#deco-path',
      alignOrigin: [0.5, 0.5],
      autoRotate: true,
    },
    duration: 18,
    ease: 'none',
    repeat: -1,
  });
}

// ── TYPING EFFECT ──
const phrases = ['서비스 기획자', 'UI/UX 설계', '아이디어를 현실로'];
let phraseIdx = 0, charIdx = 0, deleting = false;
const typeEl  = document.getElementById('typeText');

function type() {
  const current = phrases[phraseIdx];
  if (!deleting) {
    typeEl.textContent = current.slice(0, ++charIdx);
    if (charIdx === current.length) { deleting = true; setTimeout(type, 1800); return; }
    setTimeout(type, 90);
  } else {
    typeEl.textContent = current.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      setTimeout(type, 400); return;
    }
    setTimeout(type, 45);
  }
}
type();

// ── SCROLL FADE-UP ──
const observer = new IntersectionObserver(
  entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
  { threshold: 0.12 }
);
document.querySelectorAll(
  '.skill-card, .timeline__item, .edu-card, .contact-card, .section__title'
).forEach(el => { el.classList.add('fade-up'); observer.observe(el); });

// ── NAV SCROLL BACKGROUND ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.style.background = window.scrollY > 50
    ? `color-mix(in srgb, var(--color-bg) 97%, transparent)`
    : `color-mix(in srgb, var(--color-bg) 80%, transparent)`;
}, { passive: true });

// ── ACTIVE NAV LINK ──
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav__links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => { if (window.scrollY >= sec.offsetTop - 120) current = sec.id; });
  navAnchors.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--color-text)' : '';
  });
}, { passive: true });
