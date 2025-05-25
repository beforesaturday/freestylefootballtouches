const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

let barX = 100;
let barDirection = 1;
let barSpeed = 4;

let touchCount = 0;
let leg = "right";

let ballY = 400;
let ballAscending = false;
let ballDescending = false;
let ballSpeed = 0.5;

// Altura máxima a la que sube el balón (60 píxeles por encima de su posición inicial)
let ballMaxHeight = 30;

function drawStickman(x, y, leg) {
  // Cabeza
  ctx.beginPath();
  ctx.arc(x, y - 50, 20, 0, Math.PI * 2);
  ctx.stroke();

  // Cuerpo
  ctx.beginPath();
  ctx.moveTo(x, y - 30);
  ctx.lineTo(x, y + 50);
  ctx.stroke();

  // Brazos hacia abajo, pegados al cuerpo
  ctx.beginPath();
  ctx.moveTo(x, y - 10);
  ctx.lineTo(x - 10, y + 30);
  ctx.moveTo(x, y - 10);
  ctx.lineTo(x + 10, y + 30);
  ctx.stroke();

  // Piernas
  ctx.beginPath();
  if (leg === "right") {
    ctx.moveTo(x, y + 50);
    ctx.lineTo(x + 20, y + 100);
    ctx.moveTo(x, y + 50);
    ctx.lineTo(x - 10, y + 100);
  } else {
    ctx.moveTo(x, y + 50);
    ctx.lineTo(x - 20, y + 100);
    ctx.moveTo(x, y + 50);
    ctx.lineTo(x + 10, y + 100);
  }
  ctx.stroke();
}

function drawBall(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, Math.PI * 2);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.stroke();
}

function handleTouch() {
  const normPos = (barX - 100) / (canvas.width - 200);
  if (normPos >= 0.45 && normPos <= 0.55) {
    touchCount++;
    leg = leg === "right" ? "left" : "right";
    ballAscending = true;
    ballDescending = false;
  } else {
    alert(`You failed, Touches: ${touchCount}`);
    touchCount = 0;
    leg = "right";
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Fondo
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Barra de movimiento
  ctx.strokeStyle = "lightblue";
  ctx.strokeRect(100, canvas.height - 100, canvas.width - 200, 20);
  ctx.beginPath();
  ctx.moveTo(barX, canvas.height - 110);
  ctx.lineTo(barX, canvas.height - 70);
  ctx.stroke();

  // Zona roja (óptima)
  const zoneStart = 100 + (canvas.width - 200) * 0.45;
  const zoneEnd = 100 + (canvas.width - 200) * 0.55;
  ctx.fillStyle = "red";
  ctx.fillRect(zoneStart, canvas.height - 100, zoneEnd - zoneStart, 20);

  // Stickman y pelota
  drawStickman(canvas.width / 2, canvas.height / 2, leg);
  drawBall(canvas.width / 2, ballY);

  // Contador de toques
  ctx.fillStyle = "lightblue";
  ctx.font = "28px Arial";
  ctx.fillText("Touches: " + touchCount, 20, 40);

  // Botón Touch
  ctx.strokeStyle = "lightblue";
  ctx.strokeRect(canvas.width / 2 - 75, canvas.height - 60, 150, 40);
  ctx.fillText("Touch", canvas.width / 2 - 35, canvas.height - 30);
}

function update() {
  // Mover barra
  barX += barSpeed * barDirection;
  if (barX >= canvas.width - 100 || barX <= 100) {
    barDirection *= -1;
  }

  // Movimiento de la pelota
  if (ballAscending) {
    ballY -= ballSpeed;
    if (ballY <= canvas.height - 210 - ballMaxHeight) {  // Aquí se controla la altura máxima
      ballAscending = false;
      ballDescending = true;
    }
  } else if (ballDescending) {
    ballY += ballSpeed;
    if (ballY >= 400) {
      ballDescending = false;
    }
  }
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // Botón Touch
  if (
    x > canvas.width / 2 - 75 &&
    x < canvas.width / 2 + 75 &&
    y > canvas.height - 60 &&
    y < canvas.height - 20
  ) {
    handleTouch();
  }
});

document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    handleTouch();
  }
});

gameLoop();
