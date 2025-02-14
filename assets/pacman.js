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
    0 → empty space (or pellet already eaten)
    1 → wall
    2 → pellet (dot that Pac-Man can eat)
  
  Build a simple maze:
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

// Example: Add inner walls
// Vertical wall in the center (with a gap)
for (let i = 2; i < rows - 2; i++) {
  if (i !== Math.floor(rows / 2)) {
    maze[i][Math.floor(cols / 2)] = 1;
  }
}
// Horizontal wall across the middle (with one opening at the center)
for (let j = 2; j < cols - 2; j++) {
  if (j !== Math.floor(cols / 2)) {
    maze[Math.floor(rows / 2)][j] = 1;
  }
}

// ----------------------
// Fruits Setup
// ----------------------
// Define fruit positions in the four corners (inside the walls)
// Note: The corners of the playable area are (1,1), (cols-2,1), (1,rows-2), (cols-2,rows-2).
const fruits = [
  { x: 1, y: 1, collected: false },
  { x: cols - 2, y: 1, collected: false },
  { x: 1, y: rows - 2, collected: false },
  { x: cols - 2, y: rows - 2, collected: false }
];
// Remove pellets from fruit cells so they don't overlap
for (let fruit of fruits) {
  maze[fruit.y][fruit.x] = 0;
}

// ----------------------
// Game Objects & Variables
// ----------------------

// Pac-Man starting at cell (1,1)
// (If you wish to delay fruit collection, consider starting Pac-Man at a different cell.)
let pacman = {
  x: 1,
  y: 1,
  dir: { x: 0, y: 0 },
  nextDir: { x: 0, y: 0 },
  speed: 5 // moves every 5 frames
};

let score = 0;
let frameCount = 0;

// Define ghost cage settings
const centerX = Math.floor(cols / 2);
const centerY = Math.floor(rows / 2) + 1; // Cage center shifted slightly downward
// Define the cage as a 3x3 region:
const cage = {
  left: centerX - 1,
  right: centerX + 1,
  top: centerY - 1,
  bottom: centerY + 1
};

// Ghosts array – create four ghosts with staggered exit delays.
let ghosts = [];
function initializeGhosts() {
  ghosts = [];
  ghosts.push({
    x: centerX,
    y: centerY,
    dir: { x: 0, y: 0 },
    speed: 10,       // Slower movement: update every 10 frames
    inCage: true,
    exitDelay: 100   // Delay (in frame count) before this ghost starts exiting
  });
  ghosts.push({
    x: centerX - 1,
    y: centerY,
    dir: { x: 0, y: 0 },
    speed: 10,
    inCage: true,
    exitDelay: 200
  });
  ghosts.push({
    x: centerX + 1,
    y: centerY,
    dir: { x: 0, y: 0 },
    speed: 10,
    inCage: true,
    exitDelay: 300
  });
  ghosts.push({
    x: centerX,
    y: centerY + 1,
    dir: { x: 0, y: 0 },
    speed: 10,
    inCage: true,
    exitDelay: 400
  });
}
initializeGhosts();

// ----------------------
// Input Handling
// ----------------------
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
function update() {
  frameCount++;

  // Update Pac-Man's movement every few frames
  if (frameCount % pacman.speed === 0) {
    // Change direction if possible
    if (isFree(pacman.x + pacman.nextDir.x, pacman.y + pacman.nextDir.y)) {
      pacman.dir = pacman.nextDir;
    }
    // Move if possible
    if (isFree(pacman.x + pacman.dir.x, pacman.y + pacman.dir.y)) {
      pacman.x += pacman.dir.x;
      pacman.y += pacman.dir.y;
    }
    // Eat pellet if present
    if (maze[pacman.y][pacman.x] === 2) {
      maze[pacman.y][pacman.x] = 0;
      score += 10;
    }
    // Check for fruit collision
    for (let fruit of fruits) {
      if (!fruit.collected && pacman.x === fruit.x && pacman.y === fruit.y) {
        fruit.collected = true;
        resetGhostsToCage();
      }
    }
  }

  // Update ghosts movement (each ghost moves every ghost.speed frames)
  for (let ghost of ghosts) {
    if (frameCount % ghost.speed === 0) {
      if (ghost.inCage && frameCount >= ghost.exitDelay) {
        // EXIT LOGIC: Force ghost to exit the cage.
        // First, align ghost horizontally with cage center.
        if (ghost.x < centerX && isFree(ghost.x + 1, ghost.y)) {
          ghost.dir = { x: 1, y: 0 };
        } else if (ghost.x > centerX && isFree(ghost.x - 1, ghost.y)) {
          ghost.dir = { x: -1, y: 0 };
        } else {
          // Once aligned horizontally, move upward to exit.
          ghost.dir = { x: 0, y: -1 };
        }
        if (isFree(ghost.x + ghost.dir.x, ghost.y + ghost.dir.y)) {
          ghost.x += ghost.dir.x;
          ghost.y += ghost.dir.y;
        }
        // Check if ghost left the cage area
        if (
          ghost.x < cage.left ||
          ghost.x > cage.right ||
          ghost.y < cage.top ||
          ghost.y > cage.bottom
        ) {
          ghost.inCage = false;
        }
      } else if (!ghost.inCage) {
        // When not in the cage, use random movement.
        moveGhostRandom(ghost);
      }
    }
    // Collision check: If any ghost touches Pac-Man, restart the game.
    if (ghost.x === pacman.x && ghost.y === pacman.y) {
      resetGame();
      return; // Exit update early after reset.
    }
  }
}

// Random movement for ghosts (when not in the cage)
function moveGhostRandom(ghost) {
  const directions = [
    { x: 0, y: -1 },
    { x: 0, y: 1 },
    { x: -1, y: 0 },
    { x: 1, y: 0 }
  ];
  // Filter out invalid moves
  let validDirs = directions.filter(dir =>
    isFree(ghost.x + dir.x, ghost.y + dir.y)
  );
  // Optionally keep current direction if still valid
  if (isFree(ghost.x + ghost.dir.x, ghost.y + ghost.dir.y)) {
    validDirs.push(ghost.dir);
  }
  if (validDirs.length > 0) {
    ghost.dir = validDirs[Math.floor(Math.random() * validDirs.length)];
    ghost.x += ghost.dir.x;
    ghost.y += ghost.dir.y;
  }
}

// Reset game state: reposition Pac-Man and all ghosts; reset score.
function resetGame() {
  pacman.x = 1;
  pacman.y = 1;
  pacman.dir = { x: 0, y: 0 };
  pacman.nextDir = { x: 0, y: 0 };
  initializeGhosts();
  score = 0;
}

// Reset ghosts by returning them to the cage (triggered when fruit is collected)
function resetGhostsToCage() {
  initializeGhosts();
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

// Draw the fruits in the four corners
function drawFruits() {
  for (let fruit of fruits) {
    if (!fruit.collected) {
      const x = fruit.x * cellSize + cellSize / 2;
      const y = fruit.y * cellSize + cellSize / 2;
      const radius = cellSize / 3;
      ctx.fillStyle = "orange";
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "yellow";
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }
}

// Draw Pac-Man with an open mouth (directional)
function drawPacman() {
  let centerXPos = pacman.x * cellSize + cellSize / 2;
  let centerYPos = pacman.y * cellSize + cellSize / 2;
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
  ctx.arc(centerXPos, centerYPos, radius, startAngle, endAngle, false);
  ctx.lineTo(centerXPos, centerYPos);
  ctx.fill();
}

// Draw a ghost with a simple “spooky” shape
function drawGhost(ghost) {
  let centerXPos = ghost.x * cellSize + cellSize / 2;
  let centerYPos = ghost.y * cellSize + cellSize / 2;
  let radius = cellSize / 2 - 2;
  // Draw ghost body
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(centerXPos, centerYPos, radius, Math.PI, 0, false);
  ctx.lineTo(centerXPos + radius, centerYPos + radius);
  let waveCount = 4;
  for (let i = 0; i < waveCount; i++) {
    let angle = Math.PI + ((i + 1) * Math.PI) / waveCount;
    let x = centerXPos + radius * Math.cos(angle);
    let y = centerYPos + radius * Math.sin(angle);
    ctx.lineTo(x, y);
  }
  ctx.closePath();
  ctx.fill();
  // Draw ghost eyes
  ctx.fillStyle = "#FFF";
  ctx.beginPath();
  ctx.arc(centerXPos - radius / 2.5, centerYPos - radius / 4, radius / 4, 0, Math.PI * 2);
  ctx.arc(centerXPos + radius / 2.5, centerYPos - radius / 4, radius / 4, 0, Math.PI * 2);
  ctx.fill();
  // Draw ghost pupils
  ctx.fillStyle = "#000";
  ctx.beginPath();
  ctx.arc(centerXPos - radius / 2.5, centerYPos - radius / 4, radius / 8, 0, Math.PI * 2);
  ctx.arc(centerXPos + radius / 2.5, centerYPos - radius / 4, radius / 8, 0, Math.PI * 2);
  ctx.fill();
}

// Draw score and HUD
function drawHUD() {
  ctx.fillStyle = "#FFF";
  ctx.font = "16px Arial";
  ctx.fillText("Score: " + score, 10, canvas.height - 10);
}

// Main draw function
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawMaze();
  drawFruits();
  drawPacman();
  for (let ghost of ghosts) {
    drawGhost(ghost);
  }
  drawHUD();
}

// ----------------------
// Game Loop
// ----------------------
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}
gameLoop();
