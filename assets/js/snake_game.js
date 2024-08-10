const gameBoard = document.getElementById("game-board");
const scoreBoard = document.getElementById("game-points");
const ctx = gameBoard.getContext("2d");

const gridSize = 20;
const SNAKE_COLOR = "green";
const SNAKE_EYES_COLOR = "black";
const [finalGameSpeed, initialGameSpeed] = [120, 360];
const StateEnum = Object.freeze({
  IDLE: 0,
  PLAYING: 1,
  PAUSED: 2,
  GAME_OVER: 3
});

const grid = { width: 0, height: 0 };
let food, direction, lastDirection, gameLoop;
let snake = [];
let state = StateEnum.IDLE; // can be 
let points = 0;
let gameSpeed = initialGameSpeed;

function startGameLoop() {
  // Start game loop
  gameLoop = setInterval(update, gameSpeed);
  state = StateEnum.PLAYING;
}

function stopGameLoop() {
  clearInterval(gameLoop);
  gameLoop = null;
}

function updateGameLoop() {
  clearInterval(gameLoop)
  gameLoop = setInterval(update, gameSpeed);
}

function renderPoints(points) {
  if (!scoreBoard) return;
  scoreBoard.innerText = points;
}

function snakeGameInit() {
  // Set canvas size to match container
  resizeCanvas();
  draw();
  points = 0;
  gameSpeed = initialGameSpeed;
  renderPoints(points);
}

function snakeGameStart() {
  snake = [{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }];
  food = generateFood();
  direction = "right";
  snakeGameInit();
  startGameLoop();
}

function snakeGameOver() {
  stopGameLoop();
  snake = [];
  food = undefined;
  state = StateEnum.GAME_OVER;
  alert("Game Over!");
}

function resizeCanvas() {
  const container = gameBoard.parentElement;
  gameBoard.width = container.clientWidth - (container.clientWidth % gridSize);
  gameBoard.height =
    container.clientHeight - (container.clientHeight % gridSize);
  grid.height = gameBoard.height / gridSize;
  grid.width = gameBoard.width / gridSize;
  if (food && (food.x > grid.width || food.y > grid.height)) {
    food = generateFood();
  }
  const isSnakeOutOfBounds = snake?.some(
    ({ x, y }) => x > gameBoard.width || y > gameBoard.height
  );
  if (isSnakeOutOfBounds) {
    snakeGameOver();
  }
}

function generateFood() {
  const maxX = Math.floor(gameBoard.width / gridSize) - 1;
  const maxY = Math.floor(gameBoard.height / gridSize) - 1;
  function genRandomXY() {
    return [Math.floor(Math.random() * maxX), Math.floor(Math.random() * maxY)];
  }
  let [x, y] = genRandomXY();
  function foodCollidesWithSnake() {
    return snake.some(({ x: sx, y: sy }) => sx == x && sy == y);
  }
  while (foodCollidesWithSnake()) {
    [x, y] = genRandomXY();
  }
  return { x, y };
}

function update() {
  if (!gameLoop) return;
  moveSnake();
  if (checkCollision()) {
    snakeGameOver();
    return;
  }
  if (snake[0].x === food.x && snake[0].y === food.y) {
    snake.push({});
    points += Math.floor((snake.length * (1200 / gameSpeed)) / 0.11);
    food = generateFood();
    gameSpeed -= 10;
    if (gameSpeed < finalGameSpeed) gameSpeed = finalGameSpeed;
    updateGameLoop();
  }
  draw();
  renderPoints(points);
}

function moveSnake() {
  const newHead = { x: snake[0].x, y: snake[0].y };
  const maxY = Math.floor(gameBoard.height / gridSize) - 1;
  const maxX = Math.floor(gameBoard.width / gridSize) - 1;
  switch (direction) {
    case "up":
      if (newHead.y - 1 < 0) {
        newHead.y = maxY;
      } else {
        newHead.y -= 1;
      }
      break;
    case "down":
      if (newHead.y + 1 > maxY) {
        newHead.y = 0;
      } else {
        newHead.y += 1;
      }
      break;
    case "left":
      if (newHead.x - 1 < 0) {
        newHead.x = maxX;
      } else {
        newHead.x -= 1;
      }
      break;
    case "right":
      if (newHead.x + 1 > maxX) {
        newHead.x = 0;
      } else {
        newHead.x += 1;
      }
      break;
  }
  lastDirection = direction;
  snake.unshift(newHead);
  snake.pop();
}

function checkCollision() {
  const head = snake[0];

  const hitItself = snake
    .slice(1)
    .some((segment) => segment.x === head.x && segment.y === head.y);

  return hitItself;
}

function drawSnake() {
  ctx.fillStyle = SNAKE_COLOR;
    snake.forEach((segment, idx) => {
      const [x, y] = [segment.x * gridSize, segment.y * gridSize];
      ctx.fillRect(x, y, gridSize - 1, gridSize - 1);
      if (idx < 1) {
        // draw snake eyes (4 inner dots draw or not depending on direction)
        ctx.fillStyle = SNAKE_EYES_COLOR;
        ctx.fillRect(
          x + gridSize / 4,
          y + gridSize / 4,
          gridSize / 2 - 1,
          gridSize / 2 - 1
        );
        ctx.fillStyle = SNAKE_COLOR;
      }
    });
}

function draw() {
  ctx.clearRect(0, 0, gameBoard.width, gameBoard.height);

  ctx.strokeStyle = "black";
  ctx.fillStyle = "white";
  ctx.strokeRect(1, 1, gameBoard.width - 1, gameBoard.height - 1);

  if (snake?.length) {
    drawSnake()
  }

  if (food && 'x' in food && 'y' in food) {
    // Draw food
    ctx.fillStyle = "red";
    ctx.fillRect(
      food.x * gridSize,
      food.y * gridSize,
      gridSize - 1,
      gridSize - 1
    );
  }
}

function handleKeyDownEvent(e) {
  const opposites = { down: "up", left: "right", right: "left", up: "down" };
  function setDirection(desired) {
    if (lastDirection !== opposites[desired]) {
      direction = desired;
    }
  }
  switch (e.code) {
    case "ArrowUp":
      setDirection("up");
      break;
    case "ArrowDown":
      setDirection("down");
      break;
    case "ArrowLeft":
      setDirection("left");
      break;
    case "ArrowRight":
      setDirection("right");
      break;
  }
}

function handleKeyUpEvent(e) {
  switch (e.code) {
    case "Escape":
      if (gameLoop && state == StateEnum.PLAYING) {
        stopGameLoop();
        state = StateEnum.PAUSED;
      } else if (state == StateEnum.GAME_OVER) { 
        stopGameLoop();
        snakeGameInit();
        state = StateEnum.IDLE;
      } else if (state == StateEnum.PAUSED) {
        startGameLoop();
      }
      break;
    case "Space":
      if (!gameLoop && state == StateEnum.PAUSED) {
        startGameLoop();
      } else if (state == StateEnum.IDLE) {
        stopGameLoop();
        snakeGameStart();
      }
      break;
  }
}

document.addEventListener("keydown", handleKeyDownEvent);

document.addEventListener("keyup", handleKeyUpEvent);

window.addEventListener("resize", resizeCanvas);

window.snakeGameControls = {
  init() {
    snakeGameInit();
  },
  start() {
    snakeGameStart();
  },
  pause() {
    stopGameLoop();
    state = StateEnum.PAUSED;
  },
  stop() {
    snakeGameOver();
  },
  remove() {
    ctx.clearRect(0, 0, gameBoard.width, gameBoard.height);
    snake = [];
    food = undefined;
  }
}
