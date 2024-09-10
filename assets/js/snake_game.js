const gameBoard = document.getElementById("game-board");
const scoreBoard = document.getElementById("game-points");
const highestScore = document.getElementById("game-record");
const ctx = gameBoard.getContext("2d");

const SCORES_STORAGE_KEY = "previous_scores";
const boardCenter = { x: 0, y: 0 };
const gridSize = 20;
const [finalGameSpeed, initialGameSpeed] = [120, 360];
const previousScores = { scores: [] };
const StateEnum = Object.freeze({
  IDLE: 0,
  PLAYING: 1,
  PAUSED: 2,
  GAME_OVER: 3,
});
const Colors = Object.freeze({
  snakeBody: "green",
  snakeEyes: "black",
  boardBorder: "black",
  boardBackground: "white",
  textColor: "black",
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
  clearInterval(gameLoop);
  gameLoop = setInterval(update, gameSpeed);
}

const scoreFormatter = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
  minimumIntegerDigits: 3,
});

const paddedScoreFormatter = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
  minimumIntegerDigits: 9,
});

function formatScore(score, { padded } = {}) {
  if (padded) paddedScoreFormatter.format(score)
  return scoreFormatter.format(score);
}

function renderPoints(points) {
  if (!scoreBoard || isNaN(points)) return;
  scoreBoard.innerText = formatScore(points);
}

function loadPreviousScores() {
  try {
    const saveFile = localStorage.getItem(SCORES_STORAGE_KEY) ?? '{"scores":[]}';
    previousScores.scores = JSON.parse(saveFile).scores;
  } catch (err) {
    console.error("Something went wrong loading the scores", err);
  }
}

function savePreviousScores() {
  try {
    const saveFile = JSON.stringify(previousScores);
    localStorage.setItem(SCORES_STORAGE_KEY, saveFile);
  } catch (err) {
    console.error("Something went wrong saving the scores", err);
  }
}

function renderHighest() {
  if (!highestScore) return;
  const maxScore = previousScores.scores.reduce(
    (prev, curr) => (curr.points > prev.points ? curr : prev),
    { points: 0 }
  );
  highestScore.innerText = formatScore(maxScore.points, { padded: true });
}

function snakeGameInit() {
  // Set canvas size to match container
  resizeCanvas();
  points = 0;
  gameSpeed = initialGameSpeed;
  loadPreviousScores();
  renderPoints(points);
  renderHighest();
}

function snakeGameStart() {
  snake = [
    { x: 5, y: 5 },
    { x: 4, y: 5 },
    { x: 3, y: 5 },
    { x: 3, y: 4 },
    { x: 3, y: 3 },
  ];
  food = generateFood();
  direction = "right";
  snakeGameInit();
  startGameLoop();
}

function snakeGameOver() {
  state = StateEnum.GAME_OVER;
  previousScores.scores.push({ points, dt: new Date().getTime() });
  savePreviousScores();
  renderHighest();
  draw();
}

function resizeCanvas() {
  const container = gameBoard.parentElement;
  gameBoard.width = container.clientWidth - (container.clientWidth % gridSize);
  gameBoard.height =
    container.clientHeight - (container.clientHeight % gridSize);
  grid.height = gameBoard.height / gridSize;
  grid.width = gameBoard.width / gridSize;
  boardCenter.x = gameBoard.width / 2;
  boardCenter.y = gameBoard.height / 2;
  if (
    state == StateEnum.PLAYING &&
    food &&
    (food.x > grid.width || food.y > grid.height)
  ) {
    food = generateFood();
  }
  const isSnakeOutOfBounds = snake?.some(
    ({ x, y }) => x > gameBoard.width || y > gameBoard.height
  );
  if (isSnakeOutOfBounds) {
    snakeGameOver();
  }
  draw();
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
  if (state != StateEnum.PLAYING) {
    draw();
    return;
  }

  moveSnake();
  if (checkCollision()) {
    snakeGameOver();
    return;
  }

  const { x: headX, y: headY } = snake.find((seg) => seg);

  if (headX === food.x && headY === food.y) {
    snake.push({});
    points += Math.floor((snake.length * (1200 / gameSpeed)) / 0.13);
    food = generateFood();
    if (gameSpeed - 10 < finalGameSpeed) gameSpeed = finalGameSpeed;
    else gameSpeed -= 10;
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
  snake.forEach((segment, idx) => {
    const [x, y] = [segment.x * gridSize, segment.y * gridSize];
    ctx.fillStyle = Colors.snakeBody;
    ctx.fillRect(x, y, gridSize - 1, gridSize - 1);
    if (idx < 1) {
      // draw snake eyes (4 inner dots draw or not depending on direction)
      ctx.fillStyle = Colors.snakeEyes;
      const eyeSize = gridSize / 6 - 1;
      if (direction == "left" || direction == "up")
        ctx.fillRect(
          x + (gridSize / 4) * 1.0,
          y + (gridSize / 4) * 1.0,
          eyeSize,
          eyeSize
        );

      if (direction == "up" || direction == "right")
        ctx.fillRect(
          x + (gridSize / 4) * 2.4,
          y + (gridSize / 4) * 1.0,
          eyeSize,
          eyeSize
        );

      if (direction == "left" || direction == "down")
        ctx.fillRect(
          x + (gridSize / 4) * 1.0,
          y + (gridSize / 4) * 2.4,
          eyeSize,
          eyeSize
        );

      if (direction == "right" || direction == "down")
        ctx.fillRect(
          x + (gridSize / 4) * 2.4,
          y + (gridSize / 4) * 2.4,
          eyeSize,
          eyeSize
        );
    }
  });
}

function draw() {
  ctx.clearRect(0, 0, gameBoard.width, gameBoard.height);

  ctx.strokeStyle = "black";
  ctx.fillStyle = "white";
  ctx.strokeRect(1, 1, gameBoard.width - 1, gameBoard.height - 1);

  if (snake?.length) {
    drawSnake();
  }

  if (food && "x" in food && "y" in food) {
    // Draw food
    ctx.fillStyle = "red";
    ctx.fillRect(
      food.x * gridSize,
      food.y * gridSize,
      gridSize - 1,
      gridSize - 1
    );
  }

  if (state == StateEnum.IDLE) {
    ctx.strokeStyle = Colors.textColor;
    ctx.fillStyle = Colors.textColor;
    ctx.textAlign = "center";
    ctx.font = "24px serif";
    ctx.fillText("Snake Game", boardCenter.x, boardCenter.y - 14);
    ctx.font = "14px serif";
    ctx.fillText("press SPACE to start", boardCenter.x, boardCenter.y + 10);
  }

  if (state == StateEnum.PAUSED) {
    ctx.strokeStyle = Colors.textColor;
    ctx.fillStyle = Colors.textColor;
    ctx.textAlign = "center";
    ctx.font = "24px serif";
    ctx.fillText("PAUSED", boardCenter.x, boardCenter.y);
  }

  if (state == StateEnum.GAME_OVER) {
    const formattedScore = formatScore(points);
    ctx.strokeStyle = Colors.textColor;
    ctx.fillStyle = Colors.textColor;
    ctx.textAlign = "center";
    ctx.font = "24px serif";
    ctx.fillText("Game Over", boardCenter.x, boardCenter.y - 26);
    ctx.font = "14px serif";
    ctx.fillText(`${formattedScore} POINTS!`, boardCenter.x, boardCenter.y);
    ctx.fillText(
      `Press SPACE to play again`,
      boardCenter.x,
      boardCenter.y + 16
    );
  }
}

function handleKeyDownEvent(e) {
  if (!gameLoop || state !== StateEnum.PLAYING) return;
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
        state = StateEnum.PAUSED;
      } else if (state == StateEnum.GAME_OVER) {
        stopGameLoop();
        snakeGameInit();
        state = StateEnum.IDLE;
      } else if (state == StateEnum.PAUSED) {
        state = StateEnum.PLAYING;
      }
      break;
    case "Space":
      if (state == StateEnum.PAUSED) {
        state = StateEnum.PLAYING;
      } else if (state == StateEnum.IDLE || state == StateEnum.GAME_OVER) {
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
    state = StateEnum.PAUSED;
  },
  stop() {
    snakeGameOver();
  },
  remove() {
    ctx.clearRect(0, 0, gameBoard.width, gameBoard.height);
    snake = [];
    food = undefined;
    stopGameLoop();
  },
  input(code, toKeyUp = false) {
    if (toKeyUp) {
      handleKeyUpEvent({ code })
    } else {
      handleKeyDownEvent({ code })
    }
  }
};
