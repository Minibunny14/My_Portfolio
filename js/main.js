/* ---------- dynamic year ---------- */
document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- nav-link active highlight ---------- */
window.addEventListener('scroll', () => {
  let current = '';
  const sections = document.querySelectorAll('section');
  sections.forEach(sec => {
    const rect = sec.getBoundingClientRect();
    if (rect.top <= 60 && rect.bottom >= 60) {
      current = sec.getAttribute('id');
    }
  });
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === `#${current}`) {
      link.style.color = 'var(--primary)';
    }
  });
});

/* ---------- black-hole cursor ---------- */
const canvas = document.getElementById('cursor-canvas');
const ctx    = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height= window.innerHeight;

const particles = [];
const particleCount = 80;
let   mouse = { x: canvas.width / 2, y: canvas.height / 2 };

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 1;
    this.speedX = Math.random() * 2 - 1;
    this.speedY = Math.random() * 2 - 1;
    this.color = `hsl(${180 + Math.random() * 40}, 100%, 60%)`;
  }
  update() {
    // vector towards mouse
    const dx = mouse.x - this.x;
    const dy = mouse.y - this.y;
    const dist = Math.hypot(dx, dy);
    const force = 1200 / (dist + 1); // black-hole pull

    this.speedX += (dx / dist) * force * 0.0008;
    this.speedY += (dy / dist) * force * 0.0008;

    // friction
    this.speedX *= 0.96;
    this.speedY *= 0.96;

    this.x += this.speedX;
    this.y += this.speedY;

    // respawn if sucked in
    if (dist < 20) {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 1;
    }
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function init() {
  for (let i = 0; i < particleCount; i++) particles.push(new Particle());
}
init();

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animate);
}
animate();

/* resize handler */
window.addEventListener('resize', () => {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
});

/* mouse tracker */
window.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});