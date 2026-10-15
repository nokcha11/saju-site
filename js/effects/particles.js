const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");

let particles = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);


class Particle {
  constructor() {
    this.reset(true);
  }

  reset(first = false) {
    this.x = Math.random() * canvas.width;

    this.y = first
      ? Math.random() * canvas.height
      : canvas.height + 20;

    this.size = Math.random() * 2.2 + 0.5;

    this.speedY = Math.random() * 0.25 + 0.08;
    this.speedX = (Math.random() - 0.5) * 0.15;

    this.alpha = Math.random() * 0.5 + 0.15;

    this.twinkleSpeed = Math.random() * 0.025 + 0.008;
    this.twinkleDirection = Math.random() > 0.5 ? 1 : -1;

    const colors = [
      "255, 255, 255",
      "220, 220, 255",
      "195, 180, 255",
      "235, 225, 255"
    ];

    this.color =
      colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    this.y -= this.speedY;
    this.x += this.speedX;

    this.alpha +=
      this.twinkleSpeed * this.twinkleDirection;

    if (this.alpha >= 0.8) {
      this.alpha = 0.8;
      this.twinkleDirection = -1;
    }

    if (this.alpha <= 0.1) {
      this.alpha = 0.1;
      this.twinkleDirection = 1;
    }

    if (
      this.y < -20 ||
      this.x < -20 ||
      this.x > canvas.width + 20
    ) {
      this.reset();
    }
  }

  draw() {
    ctx.beginPath();

    ctx.arc(
      this.x,
      this.y,
      this.size,
      0,
      Math.PI * 2
    );

    ctx.fillStyle =
      `rgba(${this.color}, ${this.alpha})`;

    ctx.shadowBlur = this.size * 6;

    ctx.shadowColor =
      `rgba(${this.color}, ${this.alpha})`;

    ctx.fill();

    ctx.shadowBlur = 0;
  }
}


function createParticles() {
  particles = [];

  let particleCount;

  if (window.innerWidth < 768) {
    particleCount = 45;
  } else {
    particleCount = 90;
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
}

createParticles();


function animateParticles() {
  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  particles.forEach((particle) => {
    particle.update();
    particle.draw();
  });

  requestAnimationFrame(animateParticles);
}

animateParticles();


window.addEventListener("resize", () => {
  resizeCanvas();
  createParticles();
});