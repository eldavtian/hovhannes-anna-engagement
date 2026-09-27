// ============================================
// PARTICLES.JS — Floating luxury background particles
// Draws small glowing dots that drift slowly upward, like floating gold dust.
// ============================================

// Wait until the HTML is fully loaded before touching any elements
document.addEventListener("DOMContentLoaded", initParticles);

function initParticles() {
  const canvas = document.getElementById("particles-canvas");
  const ctx = canvas.getContext("2d");

  let particles = [];
  const PARTICLE_COUNT = 45; // fewer = more subtle, more = busier background

  // Make the canvas always match the current window size
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  // Create one particle object with randomized starting properties
  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2 + 0.5,       // size: 0.5px to 2.5px
      speedY: Math.random() * 0.4 + 0.1,     // how fast it drifts upward
      drift: Math.random() * 0.3 - 0.15,     // slight left/right sway
      opacity: Math.random() * 0.5 + 0.2
    };
  }

  function initParticleArray() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle());
    }
  }

  // Move each particle upward slightly, and reset it to the bottom once it drifts off the top
  function updateParticle(p) {
    p.y -= p.speedY;
    p.x += p.drift;

    if (p.y < -10) {
      p.y = canvas.height + 10;
      p.x = Math.random() * canvas.width;
    }
  }

  // Draw a single soft golden dot
  function drawParticle(p) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(201, 161, 90, ${p.opacity})`; // matches --color-gold
    ctx.fill();
  }

  // Main animation loop — runs ~60 times per second
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(function (p) {
      updateParticle(p);
      drawParticle(p);
    });

    requestAnimationFrame(animate); // schedules the next frame smoothly
  }

  // --- Run everything ---
  resizeCanvas();
  initParticleArray();
  animate();

  // Keep canvas correctly sized if the window is resized (e.g. rotating a phone)
  window.addEventListener("resize", function () {
    resizeCanvas();
    initParticleArray(); // regenerate particles so they fit the new size properly
  });
}