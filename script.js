const canvas = document.getElementById("fireworksCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
const holdTime = 100; // Hold "50" shape for this many frames (approximately 2 seconds)

function startFireworks() {
  createNumberParticles("50");
}

function createNumberParticles(text) {
  ctx.font = "bold 200px Arial";
  ctx.fillStyle = "white";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  const textX = canvas.width / 2;
  const textY = canvas.height / 2;
  ctx.fillText(text, textX, textY);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const buffer = imageData.data;

  for (let y = 0; y < imageData.height; y += 6) {
    for (let x = 0; x < imageData.width; x += 6) {
      const alpha = buffer[(y * imageData.width + x) * 4 + 3];
      if (alpha > 128) {
        particles.push(new Particle(x, y));
      }
    }
  }
}

function Particle(x, y) {
  this.x = x;
  this.y = y;
  this.originalX = x; // Store original position to hold it initially
  this.originalY = y;
  this.size = 3;
  this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
  this.speedX = (Math.random() - 0.5) * 1.5;
  this.speedY = (Math.random() - 0.5) * 1.5;
  this.fadeRate = 0.995;
  this.holdTime = holdTime;

  this.update = function () {
    if (this.holdTime > 0) {
      this.holdTime--; // Decrease holdTime to keep particle static
    } else {
      this.x += this.speedX;
      this.y += this.speedY;
      this.size *= this.fadeRate;
    }
  };

  this.draw = function () {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  };
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach((particle, index) => {
    particle.update();
    particle.draw();

    if (particle.size < 0.5) {
      particles.splice(index, 1);
    }
  });

  requestAnimationFrame(animate);
}

animate();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
