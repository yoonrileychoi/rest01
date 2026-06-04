// ── PARTICLE BACKGROUND ──
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
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
    ctx.fillStyle = `rgba(196,168,245,${p.alpha})`;
    ctx.fill();

    p.x += p.dx;
    p.y += p.dy;
    if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
  });

  // 가까운 파티클끼리 선으로 연결
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx   = particles[i].x - particles[j].x;
      const dy   = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(196,168,245,${0.12 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
}
drawParticles();

// ── TYPING EFFECT ──
const phrases = ['서비스 기획자', 'UI/UX 설계', '아이디어를 현실로'];
let phraseIdx = 0, charIdx = 0, deleting = false;
const typeEl  = document.getElementById('typeText');

function type() {
  const current = phrases[phraseIdx];
  if (!deleting) {
    typeEl.textContent = current.slice(0, ++charIdx);
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(type, 1800);
      return;
    }
    setTimeout(type, 90);
  } else {
    typeEl.textContent = current.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting  = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      setTimeout(type, 400);
      return;
    }
    setTimeout(type, 45);
  }
}
type();

// ── SCROLL FADE-UP ──
const observer = new IntersectionObserver(
  (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
  { threshold: 0.12 }
);
document.querySelectorAll(
  '.skill-card, .timeline__item, .edu-card, .contact-card, .section__title'
).forEach(el => { el.classList.add('fade-up'); observer.observe(el); });

// ── NAV BACKGROUND ON SCROLL ──
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.style.background = window.scrollY > 50
    ? 'rgba(14,12,22,.97)'
    : 'rgba(14,12,22,.75)';
}, { passive: true });

// ── ACTIVE NAV LINK HIGHLIGHT ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav__links a');
const onScroll = () => {
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}`
      ? 'var(--color-text)'
      : '';
  });
};
window.addEventListener('scroll', onScroll, { passive: true });
