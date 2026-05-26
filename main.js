const canvas = document.querySelector("#world");
const ctx = canvas.getContext("2d");

const intro = document.querySelector("#intro");
const game = document.querySelector("#game");
const startButton = document.querySelector("#startButton");
const hint = document.querySelector("#hint");
const progressText = document.querySelector("#progressText");
const progressFill = document.querySelector("#progressFill");

const memoryDialog = document.querySelector("#memoryDialog");
const closeDialog = document.querySelector("#closeDialog");
const claimMemory = document.querySelector("#claimMemory");
const memoryMonth = document.querySelector("#memoryMonth");
const memoryTitle = document.querySelector("#memoryTitle");
const memoryPhoto = document.querySelector("#memoryPhoto");
const memoryPlace = document.querySelector("#memoryPlace");
const memoryText = document.querySelector("#memoryText");
const memoryReward = document.querySelector("#memoryReward");

const finalDialog = document.querySelector("#finalDialog");
const closeFinal = document.querySelector("#closeFinal");

const memories = [
  ["Mes 1", "El inicio del viaje", "Portal del primer encuentro", 150, 130, "Aquí va el recuerdo del primer mes.", "Fragmento del Comienzo"],
  ["Mes 2", "La risa aparece", "Plaza de las risas", 330, 115, "Un lugar para una foto donde se rieron mucho.", "Fragmento de la Risa"],
  ["Mes 3", "Primer refugio", "Casa tibia", 520, 120, "Ese momento donde todo empezó a sentirse como hogar.", "Fragmento del Hogar"],
  ["Mes 4", "La misión dulce", "Cafecito", 760, 150, "Una salida, una comida o una conversación bonita.", "Fragmento del Cuidado"],
  ["Mes 5", "Camino compartido", "Sendero norte", 850, 310, "Un paseo que merece quedar guardado.", "Fragmento del Camino"],
  ["Mes 6", "Mitad del mapa", "Puente del medio año", 680, 340, "Seis meses caminando juntos.", "Fragmento de la Constancia"],
  ["Mes 7", "Día de colores", "Taller de pintura", 505, 300, "Un recuerdo conectado con su lado artístico.", "Fragmento del Color"],
  ["Mes 8", "Pequeña gran victoria", "Colina brillante", 300, 310, "Un momento donde se apoyaron o celebraron algo.", "Fragmento del Valor"],
  ["Mes 9", "Noche tranquila", "Lago de calma", 145, 350, "Un recuerdo íntimo, suave, de esos que no hacen ruido.", "Fragmento de la Calma"],
  ["Mes 10", "Promesa del bosque", "Bosquecito", 235, 515, "Algo que quieras prometerle para lo que viene.", "Fragmento de la Promesa"],
  ["Mes 11", "Tesoro cotidiano", "Mercadito", 520, 515, "Un día normal que contigo se volvió especial.", "Fragmento de lo Simple"],
  ["Mes 12", "El corazón completo", "Jardín final", 790, 500, "El lugar del aniversario.", "Fragmento del Año"],
].map(([month, title, place, x, y, text, reward], index) => ({
  id: index + 1,
  month,
  title,
  place,
  x,
  y,
  text,
  reward,
  claimed: false,
}));

const keys = new Set();
const player = {
  x: 90,
  y: 560,
  size: 26,
  speed: 3,
};

let activeMemory = null;
let running = false;

function drawPixelRect(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

function drawMap() {
  drawPixelRect(0, 0, canvas.width, canvas.height, "#98ca78");

  drawPixelRect(0, 92, 960, 46, "#d7b77a");
  drawPixelRect(112, 0, 48, 640, "#d7b77a");
  drawPixelRect(0, 486, 960, 50, "#d7b77a");
  drawPixelRect(480, 0, 52, 640, "#d7b77a");
  drawPixelRect(0, 296, 960, 42, "#d7b77a");

  drawPixelRect(118, 98, 36, 34, "#b99a61");
  drawPixelRect(486, 302, 40, 30, "#b99a61");
  drawPixelRect(486, 492, 40, 36, "#b99a61");

  drawPixelRect(64, 370, 160, 90, "#77aac2");
  drawPixelRect(70, 376, 148, 78, "#8fc6d8");

  drawHouse(270, 48, "#efb7a0", "#b65f55");
  drawHouse(730, 82, "#97c9d2", "#6f8b69");
  drawHouse(450, 232, "#e9c47c", "#a46554");
  drawHouse(455, 445, "#c8b5e6", "#8066aa");
  drawHouse(735, 435, "#f0a5b5", "#a94255");

  drawTrees();
  drawFlowers();
}

function drawHouse(x, y, wall, roof) {
  drawPixelRect(x, y + 26, 72, 58, wall);
  drawPixelRect(x - 8, y + 24, 88, 12, roof);
  drawPixelRect(x + 8, y + 12, 56, 18, roof);
  drawPixelRect(x + 30, y + 54, 16, 30, "#654d37");
  drawPixelRect(x + 10, y + 42, 16, 14, "#fff5cc");
  drawPixelRect(x + 48, y + 42, 16, 14, "#fff5cc");
}

function drawTrees() {
  const trees = [
    [48, 42], [58, 150], [62, 220], [205, 62], [395, 48], [620, 60],
    [880, 58], [880, 210], [700, 230], [350, 250], [63, 545], [355, 560],
    [640, 560], [900, 555], [842, 380], [260, 395],
  ];

  for (const [x, y] of trees) {
    drawPixelRect(x + 12, y + 30, 12, 28, "#765337");
    drawPixelRect(x, y + 14, 36, 28, "#4d8d52");
    drawPixelRect(x + 6, y, 24, 24, "#5eaa5c");
  }
}

function drawFlowers() {
  const flowers = [
    [590, 210, "#d95f76"], [615, 220, "#e1a93d"], [640, 205, "#fff5cc"],
    [340, 442, "#d95f76"], [365, 456, "#fff5cc"], [392, 445, "#e1a93d"],
    [820, 250, "#fff5cc"], [795, 265, "#d95f76"],
  ];

  for (const [x, y, color] of flowers) {
    drawPixelRect(x, y, 6, 6, color);
    drawPixelRect(x + 2, y + 6, 2, 10, "#3f7f45");
  }
}

function drawMemoryMarkers() {
  for (const memory of memories) {
    drawPixelRect(memory.x - 12, memory.y - 12, 24, 24, memory.claimed ? "#e1a93d" : "#fffdf6");
    drawPixelRect(memory.x - 7, memory.y - 7, 14, 14, memory.claimed ? "#fffdf6" : "#d95f76");
    ctx.fillStyle = "#24312d";
    ctx.font = "bold 14px Segoe UI";
    ctx.textAlign = "center";
    ctx.fillText(memory.id, memory.x, memory.y + 5);
  }
}

function drawPlayer() {
  drawPixelRect(player.x - 10, player.y - 18, 20, 18, "#573f8f");
  drawPixelRect(player.x - 13, player.y - 2, 26, 26, "#d95f76");
  drawPixelRect(player.x - 8, player.y + 24, 7, 12, "#654d37");
  drawPixelRect(player.x + 2, player.y + 24, 7, 12, "#654d37");
  drawPixelRect(player.x - 8, player.y - 28, 16, 14, "#f2c49d");
}

function updatePlayer() {
  const left = keys.has("ArrowLeft") || keys.has("a");
  const right = keys.has("ArrowRight") || keys.has("d");
  const up = keys.has("ArrowUp") || keys.has("w");
  const down = keys.has("ArrowDown") || keys.has("s");

  if (left) player.x -= player.speed;
  if (right) player.x += player.speed;
  if (up) player.y -= player.speed;
  if (down) player.y += player.speed;

  player.x = Math.max(20, Math.min(canvas.width - 20, player.x));
  player.y = Math.max(30, Math.min(canvas.height - 20, player.y));
}

function findNearbyMemory() {
  return memories.find((memory) => {
    const distance = Math.hypot(player.x - memory.x, player.y - memory.y);
    return distance < 48;
  });
}

function updateHint() {
  activeMemory = findNearbyMemory();
  hint.classList.toggle("is-hidden", !activeMemory);
}

function openMemory(memory) {
  memoryMonth.textContent = memory.month;
  memoryTitle.textContent = memory.title;
  memoryPlace.textContent = memory.place;
  memoryText.textContent = memory.text;
  memoryReward.textContent = `Recompensa: ${memory.reward}`;
  memoryPhoto.textContent = `Foto pendiente para ${memory.month}`;
  claimMemory.textContent = memory.claimed ? "Fragmento guardado" : "Guardar fragmento";
  claimMemory.disabled = memory.claimed;
  memoryDialog.showModal();
}

function claimActiveMemory() {
  if (!activeMemory) return;

  activeMemory.claimed = true;
  updateProgress();
  memoryDialog.close();

  if (memories.every((memory) => memory.claimed)) {
    finalDialog.showModal();
  }
}

function updateProgress() {
  const claimed = memories.filter((memory) => memory.claimed).length;
  progressText.textContent = `${claimed} / 12 recuerdos`;
  progressFill.style.width = `${(claimed / memories.length) * 100}%`;
}

function loop() {
  if (!running) return;
  updatePlayer();
  updateHint();
  drawMap();
  drawMemoryMarkers();
  drawPlayer();
  requestAnimationFrame(loop);
}

startButton.addEventListener("click", () => {
  intro.classList.add("is-hidden");
  game.classList.remove("is-hidden");
  running = true;
  loop();
});

window.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  keys.add(key);

  if (key === "e" && activeMemory && !memoryDialog.open) {
    openMemory(activeMemory);
  }
});

window.addEventListener("keyup", (event) => {
  keys.delete(event.key.toLowerCase());
});

closeDialog.addEventListener("click", () => memoryDialog.close());
claimMemory.addEventListener("click", claimActiveMemory);
closeFinal.addEventListener("click", () => finalDialog.close());

drawMap();
drawMemoryMarkers();
drawPlayer();
updateProgress();
