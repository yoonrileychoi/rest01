// Scroll-triggered fade-up
const observer = new IntersectionObserver(
  (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
  { threshold: 0.12 }
);

document.querySelectorAll(
  '.skill-card, .timeline__item, .edu-card, .contact-card, .section__title'
).forEach(el => { el.classList.add('fade-up'); observer.observe(el); });

// Nav background on scroll
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.style.background = window.scrollY > 50
    ? 'rgba(15,15,19,.95)'
    : 'rgba(15,15,19,.75)';
}, { passive: true });

// Smooth active nav link highlight
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
