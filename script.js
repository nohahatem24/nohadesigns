/* ── DYNAMIC YEAR ── */
document.getElementById("copy-year").textContent = new Date().getFullYear();

/* ── ANIMATED BACKGROUND ── */
const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

const PAL = {
  a: "rgba(122,92,74,",
  b: "rgba(168,134,110,",
};

const orbs = Array.from({ length: 6 }, (_, i) => ({
  x: Math.random() * window.innerWidth,
  y: Math.random() * window.innerHeight,
  r: 180 + Math.random() * 220,
  speed: 0.0003 + Math.random() * 0.0003,
  ax: 0.6 + Math.random() * 0.4,
  ay: 0.5 + Math.random() * 0.5,
  col: i % 2 === 0 ? PAL.a : PAL.b,
  alpha: 0.04 + Math.random() * 0.04,
}));

class Leaf {
  constructor() {
    this.reset(true);
  }
  reset(init) {
    this.x = Math.random() * canvas.width;
    this.y = init ? Math.random() * canvas.height : -40;
    this.size = 6 + Math.random() * 14;
    this.speed = 0.2 + Math.random() * 0.4;
    this.drift = (Math.random() - 0.5) * 0.3;
    this.rot = Math.random() * Math.PI * 2;
    this.rotSpeed = (Math.random() - 0.5) * 0.005;
    this.alpha = 0.08 + Math.random() * 0.12;
    this.col = Math.random() > 0.5 ? PAL.a : PAL.b;
  }
  update() {
    this.y += this.speed;
    this.x += this.drift;
    this.rot += this.rotSpeed;
    if (this.y > canvas.height + 50) this.reset(false);
  }
  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rot);
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.col + "1)";
    ctx.beginPath();
    ctx.moveTo(0, -this.size);
    ctx.bezierCurveTo(
      this.size * 0.6,
      -this.size * 0.4,
      this.size * 0.6,
      this.size * 0.4,
      0,
      this.size,
    );
    ctx.bezierCurveTo(
      -this.size * 0.6,
      this.size * 0.4,
      -this.size * 0.6,
      -this.size * 0.4,
      0,
      -this.size,
    );
    ctx.fill();
    ctx.strokeStyle = this.col + "0.5)";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(0, -this.size);
    ctx.lineTo(0, this.size);
    ctx.stroke();
    ctx.restore();
  }
}

const leaves = Array.from({ length: 22 }, () => new Leaf());
let t = 0;

function animate() {
  t += 0.008;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  orbs.forEach((o) => {
    const x = o.x + Math.sin(t * o.speed * 1000 * o.ax) * canvas.width * 0.18;
    const y = o.y + Math.cos(t * o.speed * 1000 * o.ay) * canvas.height * 0.18;
    const g = ctx.createRadialGradient(x, y, 0, x, y, o.r);
    g.addColorStop(0, o.col + o.alpha * 2 + ")");
    g.addColorStop(1, o.col + "0)");
    ctx.beginPath();
    ctx.arc(x, y, o.r, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
  });

  leaves.forEach((l) => {
    l.update();
    l.draw();
  });
  requestAnimationFrame(animate);
}
animate();

/* ── STAGGERED CARD ENTRANCE ── */
const cards = document.querySelectorAll(".link-card");
const ctaWrap = document.querySelector(".cta-wrap");

cards.forEach((card, i) => {
  setTimeout(
    () => {
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    },
    450 + i * 85,
  );
});

setTimeout(
  () => {
    ctaWrap.style.opacity = "1";
    ctaWrap.style.transform = "translateY(0)";
  },
  450 + cards.length * 85 + 120,
);

/* ── RIPPLE ON CLICK ── */
cards.forEach((card) => {
  card.addEventListener("click", function (e) {
    const rect = this.getBoundingClientRect();
    const ripple = document.createElement("span");
    ripple.style.cssText = `
      position:absolute; border-radius:50%;
      width:8px; height:8px;
      background:rgba(122,92,74,0.2);
      left:${e.clientX - rect.left - 4}px;
      top:${e.clientY - rect.top - 4}px;
      pointer-events:none; z-index:0;
      transform:scale(0); opacity:1;
      transition: transform 0.55s ease, opacity 0.55s ease;
    `;
    this.appendChild(ripple);
    requestAnimationFrame(() => {
      ripple.style.transform = "scale(70)";
      ripple.style.opacity = "0";
    });
    setTimeout(() => ripple.remove(), 600);
  });
});
