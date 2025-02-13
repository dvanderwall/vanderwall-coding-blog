// Get the canvas and its drawing context
const canvas = document.getElementById("pacmanCanvas");
const ctx = canvas.getContext("2d");

// ----------------------
// Game Settings & Maze
// ----------------------
const cellSize = 20;
const rows = 21;
const cols = 19;
canvas.width = cols * cellSize;
canvas.height = rows * cellSize;

/*
  Maze grid legend:
    0 → empty space (no pellet)
    1 → wall
    2 → pellet (dots that Pac-Man can eat)
  
  We create a basic maze:
  - Outer borders are walls.
  - Inner cells default to pellets.
  - Then we add some inner walls for interest.
*/
const maze = [];
for (let i = 0; i < rows; i++) {
  maze[i] = [];
  for (let j = 0; j < cols; j++) {
    // Create border walls
    if (i === 0 || i === rows - 1 || j === 0 || j === cols - 1) {
      maze[i][j] = 1;
    } else {
      maze[i][j] = 2; // pellet by default
    }
  }
}

// Add some inner walls (example pattern)
// Vertical wall in the center (leaving a gap)
for (let i = 2; i < rows - 2; i++) {
  if (i !== Math.floor(rows / 2)) {
    maze[i][Math.floor(cols / 2)] = 1;
  }
}
// Horizontal wall across the middle (with one opening)
for (let j = 2; j < cols - 2; j++) {
  if (j !== Math.floor(cols / 2)) {
    maze[Math.floor(rows / 2)][j] = 1;
  }
}

// ----------------------
// Game Objects & Variables
// ----------------------

// Pac-Man object: starting at cell (1,1)
let pacman = {
  x: 1,
  y: 1,
  dir: { x: 0, y: 0 },
  nextDir: { x: 0, y: 0 },
  speed: 5 // moves every 5 frames
};

// A single ghost starting in the bottom-right corner
let ghost = {
  x: cols - 2,
  y: rows - 2,
  dir: { x: 0, y: 0 },
  speed: 5
};

let score = 0;
let gameOver = false;
let frameCount = 0;

// ----------------------
// Input Handling
// ----------------------

// Listen for arrow key presses to update Pac-Man's next direction
document.addEventListener("keydown", function(e) {
  switch (e.key) {
    case "ArrowUp":
      pacman.nextDir = { x: 0, y: -1 };
      break;
    case "ArrowDown":
      pacman.nextDir = { x: 0, y: 1 };
      break;
    case "ArrowLeft":
      pacman.nextDir = { x: -1, y: 0 };
      break;
    case "ArrowRight":
      pacman.nextDir = { x: 1, y: 0 };
      break;
  }
});

// ----------------------
// Helper Functions
// ----------------------

// Check if cell (x, y) is free (i.e., not a wall)
function isFree(x, y) {
  if (x < 0 || x >= cols || y < 0 || y >= rows) return false;
  return maze[y][x] !== 1;
}

// ----------------------
// Game Update Functions
// ----------------------

// Update game state (movement, collisions, scoring)
function update() {
  frameCount++;

  // Update Pac-Man's movement every few frames
  if (frameCount % pacman.speed === 0) {
    // Try to change direction if the next cell in that direction is free
    if (isFree(pacman.x + pacman.nextDir.x, pacman.y + pacman.nextDir.y)) {
      pacman.dir = pacman.nextDir;
    }
    // Move Pac-Man if the cell in the current direction is free
    if (isFree(pacman.x + pacman.dir.x, pacman.y + pacman.dir.y)) {
      pacman.x += pacman.dir.x;
      pacman.y += pacman.dir.y;
    }
    // Eat pellet if present
    if (maze[pacman.y][pacman.x] === 2) {
      maze[pacman.y][pacman.x] = 0;
      score += 10;
    }
  }

  // Update ghost movement every few frames
  if (frameCount % ghost.speed === 0) {
    moveGhost(ghost);
  }

  // Check collision: if Pac-Man meets the ghost, it's game over
  if (pacman.x === ghost.x && pacman.y === ghost.y) {
    gameOver = true;
  }
}

// Ghost movement: choose a random valid direction at each move
function moveGhost(ghost) {
  // Possible directions (up, down, left, right)
  const directions = [
    { x: 0, y: -1 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
    { x: 1, y: 0 }
  ];

  let validDirs = directions.filter(dir =>
    isFree(ghost.x + dir.x, ghost.y + dir.y)
  );

  // If the ghost can continue in its current direction, add it as an option
  if (isFree(ghost.x + ghost.dir.x, ghost.y + ghost.dir.y)) {
    validDirs.push(ghost.dir);
  }

  // Choose a random valid direction
  if (validDirs.length > 0) {
    ghost.dir = validDirs[Math.floor(Math.random() * validDirs.length)];
    ghost.x += ghost.dir.x;
    ghost.y += ghost.dir.y;
  }
}

// ----------------------
// Drawing Functions
// ----------------------

// Draw the maze (walls and pellets)
function drawMaze() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      let cell = maze[i][j];
      let x = j * cellSize;
      let y = i * cellSize;
      if (cell === 1) {
        // Draw wall as a blue block
        ctx.fillStyle = "#0000FF";
        ctx.fillRect(x, y, cellSize, cellSize);
      } else if (cell === 2) {
        // Draw pellet as a small white circle
        ctx.fillStyle = "#FFF";
        ctx.beginPath();
        ctx.arc(x + cellSize / 2, y + cellSize / 2, cellSize / 8, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

// Draw Pac-Man with an open mouth (directional)
function drawPacman() {
  let centerX = pacman.x * cellSize + cellSize / 2;
  let centerY = pacman.y * cellSize + cellSize / 2;
  let radius = cellSize / 2 - 2;
  let mouthAngle = Math.PI / 8;

  ctx.fillStyle = "yellow";
  ctx.beginPath();

  // Determine starting angle based on current direction
  let startAngle;
  if (pacman.dir.x === -1) { // left
    startAngle = Math.PI + mouthAngle;
  } else if (pacman.dir.x === 1) { // right
    startAngle = mouthAngle;
  } else if (pacman.dir.y === -1) { // up
    startAngle = 1.5 * Math.PI + mouthAngle;
  } else if (pacman.dir.y === 1) { // down
    startAngle = 0.5 * Math.PI + mouthAngle;
  } else {
    // Default facing right
    startAngle = mouthAngle;
  }
  let endAngle = startAngle + (2 * Math.PI - 2 * mouthAngle);
  ctx.arc(centerX, centerY, radius, startAngle, endAngle, false);
  ctx.lineTo(centerX, centerY);
  ctx.fill();
}

// Draw a ghost with a simple “spooky” shape
function drawGhost() {
  let centerX = ghost.x * cellSize + cellSize / 2;
  let centerY = ghost.y * cellSize + cellSize / 2;
  let radius = cellSize / 2 - 2;

  // Draw ghost body
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, Math.PI, 0, false);
  ctx.lineTo(centerX + radius, centerY + radius);
  // Create the bottom waves of the ghost
  let waveCount = 4;
  for (let i = 0; i < waveCount; i++) {
    let angle = Math.PI + ((i + 1) * Math.PI) / waveCount;
    let x = centerX + radius * Math.cos(angle);
    let y = centerY + radius * Math.sin(angle);
    ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();

  // Draw ghost eyes
  ctx.fillStyle = "#FFF";
  ctx.beginPath();
  ctx.arc(centerX - radius / 2.5, centerY - radius / 4, radius / 4, 0, Math.PI * 2);
  ctx.arc(centerX + radius / 2.5, centerY - radius / 4, radius / 4, 0, Math.PI * 2);
  ctx.fill();

  // Draw ghost pupils
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.arc(centerX - radius / 2.5, centerY - radius / 4, radius / 8, 0, Math.PI * 2);
  ctx.arc(centerX + radius / 2.5, centerY - radius / 4, radius / 8, 0, Math.PI * 2);
  ctx.fill();
}

// Draw score and, if applicable, the game over message
function drawHUD() {
  ctx.fillStyle = "#FFF";
  ctx.font = "16px Arial";
  ctx.fillText("Score: " + score, 10, canvas.height - 10);
  
  if (gameOver) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#FFF";
    ctx.font = "40px Arial";
    ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2);
  }
}

// Main draw function
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMaze();
  drawPacman();
  drawGhost();
  drawHUD();
}

// ----------------------
// Game Loop
// ----------------------

function gameLoop() {
  if (!gameOver) {
    update();
  }
  draw();
  requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
