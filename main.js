/* =============================================
   PARTICLE CANVAS
============================================= */
(function () {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Particle() {
    this.reset();
  }
  Particle.prototype.reset = function () {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.r = Math.random() * 1.5 + 0.5;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.alpha = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.5 ? '#00c8ff' : '#7c5cfc';
  };
  Particle.prototype.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.alpha;
    ctx.fill();
  };
  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  };

  function connect() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = '#00c8ff';
          ctx.globalAlpha = 0.06 * (1 - dist / 120);
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    connect();
    requestAnimationFrame(animate);
  }

  resize();
  for (let i = 0; i < 80; i++) particles.push(new Particle());
  animate();
  window.addEventListener('resize', resize);
})();

/* =============================================
   NAVBAR SCROLL
============================================= */
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

/* =============================================
   HAMBURGER
============================================= */
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* =============================================
   TYPED TITLE EFFECT
============================================= */
const titles = window.heroTypedTitles || [
  'Mobile Architect',
  'AI Solutions Leader',
  'iOS & ARKit Expert',
  'PMP® Certified Consultant',
  'Spatial Computing Pioneer'
];
let tIdx = 0, cIdx = 0, deleting = false;
const el = document.getElementById('typed-title');

function type() {
  const current = titles[tIdx];
  if (!deleting) {
    el.textContent = current.substring(0, cIdx + 1);
    cIdx++;
    if (cIdx === current.length) {
      deleting = true;
      setTimeout(type, 3500);
      return;
    }
  } else {
    el.textContent = current.substring(0, cIdx - 1);
    cIdx--;
    if (cIdx === 0) {
      deleting = false;
      tIdx = (tIdx + 1) % titles.length;
    }
  }
  setTimeout(type, deleting ? 35 : 85);
}
type();

/* =============================================
   COUNTER ANIMATION
============================================= */
function animateCounter(el, target, duration) {
  let start = 0;
  const step = target / (duration / 16);
  function update() {
    start += step;
    if (start >= target) { el.textContent = target; return; }
    el.textContent = Math.floor(start);
    requestAnimationFrame(update);
  }
  update();
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.stat-num').forEach(num => {
        animateCounter(num, parseInt(num.dataset.target), 1200);
      });
      statsObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('#about .about-stats').forEach(s => statsObserver.observe(s));

/* =============================================
   SCROLL REVEAL FOR TIMELINE
============================================= */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => {
        e.target.classList.add('visible');
      }, i * 80);
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.timeline-item').forEach(item => revealObserver.observe(item));
