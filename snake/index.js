const gameContainerDOM = document.querySelector(".game-container");
const scoreDOM = document.querySelector("#score");
const playDOM = document.querySelector("#play");
const pauseDOM = document.querySelector("#pause");
const restartDOM = document.querySelector("#restart");
let movementArr = [];
let dotsDOM;
let interval;

let SPEED = 100;
let GAME_DIMENTIONS = 300;
let DOT_SIZE = 10;
let START_DOT_COUNT = 10;
let movementDirection = { x: DOT_SIZE, y: 0 };
let CURRENT_VISIBLE_DOT_LENGHT = START_DOT_COUNT;
let FIRST_DOT_INDEX = CURRENT_VISIBLE_DOT_LENGHT - 1;
let CURRENT_DIRECTION = "x";
let CURRENT_LINE = 1;
let negativeCount = 0;
let dotCountPerRow = 0;
let totalDotsCount = 0;
let foodIndex = undefined;
let score = 0;

function goBack() {
  location.reload();
}

function startGame() {
  initializeGameSettings();
  drawGameContainer();
  drawDots();
  startInterval();
}

function pauseGame() {
  playDOM.style.display = "block";
  pauseDOM.style.display = "none";
  clearInterval(interval);
  const pDOM = document.getElementById("paused");
  if (!pDOM) {
    const div = document.createElement("div");
    div.id = "paused";
    div.innerText = "Paused";
    div.style.width = GAME_DIMENTIONS + "px";
    div.style.height = GAME_DIMENTIONS + "px";
    gameContainerDOM.appendChild(div);
  } else {
    pDOM.style.display = "flex";
  }
  document.removeEventListener("keydown", movements);
}

function restart(start) {
  restartDOM.style.display = "none";
  START_DOT_COUNT = 10;
  movementDirection = { x: DOT_SIZE, y: 0 };
  CURRENT_VISIBLE_DOT_LENGHT = START_DOT_COUNT;
  FIRST_DOT_INDEX = CURRENT_VISIBLE_DOT_LENGHT - 1;
  CURRENT_DIRECTION = "x";
  CURRENT_LINE = 1;
  negativeCount = 0;
  dotCountPerRow = 0;
  totalDotsCount = 0;
  movementArr = [];
  foodIndex = undefined;
  score = 0;
  scoreDOM.innerHTML = `Score: ${score}`;
  const GOverDom = document.getElementById("game-over");
  gameContainerDOM.innerHTML = "";
  dotsDOM &&
    dotsDOM.forEach((element) => {
      element.style.display = "none";
    });
  GOverDom.style.display = "none";
  start && startGame();
}

function startInterval() {
  playDOM.style.display = "none";
  pauseDOM.style.display = "block";
  const pDOM = document.getElementById("paused");
  pDOM && (pDOM.style.display = "none");
  interval = setInterval(() => {
    moveDots(movementDirection.x, movementDirection.y);
  }, SPEED);
  document.addEventListener("keydown", movements);
}

function initializeGameSettings() {
  const selectValue = document.querySelector("#game-settings").value;
  if (selectValue === "Easy") {
    SPEED = 300;
    GAME_DIMENTIONS = 400;
    DOT_SIZE = 20;
  } else if (selectValue === "Medium") {
    SPEED = 200;
    GAME_DIMENTIONS = 350;
    DOT_SIZE = 10;
  } else if (selectValue === "Hard") {
    SPEED = 100;
    GAME_DIMENTIONS = 300;
    DOT_SIZE = 5;
  } else if (selectValue === "SuperHard") {
    SPEED = 50;
    GAME_DIMENTIONS = 300;
    DOT_SIZE = 5;
  }
  document.getElementById("game").style.display = "block";
  document.getElementById("game-settings-container").style.display = "none";
  pauseDOM.style.display = "block";
  movementDirection = { x: DOT_SIZE, y: 0 };
  dotCountPerRow = GAME_DIMENTIONS / DOT_SIZE;
  totalDotsCount = dotCountPerRow * dotCountPerRow;
}

function drawGameContainer() {
  gameContainerDOM.style.width = GAME_DIMENTIONS + 10 + "px";
  gameContainerDOM.style["min-width"] = GAME_DIMENTIONS + 10 + "px";
  gameContainerDOM.style.height = GAME_DIMENTIONS + 10 + "px";
  gameContainerDOM.style["min-height"] = GAME_DIMENTIONS + 10 + "px";
}

function drawDots() {
  let startCount = START_DOT_COUNT;
  for (let j = 0; j < dotCountPerRow; j++) {
    for (let i = 0; i < dotCountPerRow; i++) {
      const dot = document.createElement("div");
      dot.className = "dot";
      dot.style.top = j * DOT_SIZE + "px";
      dot.style.left = i * DOT_SIZE + "px";
      dot.style.width = DOT_SIZE + "px";
      dot.style.height = DOT_SIZE + "px";
      if (startCount) {
        startCount--;
        dot.style.display = "block";
      }
      gameContainerDOM.appendChild(dot);
    }
  }
  dotsDOM = document.querySelectorAll(".dot");
  drawFood();
}

function moveDots(x, y) {
  SetCurrentDirection();
  if (x) {
    if (x > 0) {
      FIRST_DOT_INDEX++;
    } else if (x < 0) {
      FIRST_DOT_INDEX--;
    }
    CURRENT_LINE = Math.ceil(FIRST_DOT_INDEX / dotCountPerRow);
  } else if (y) {
    if (y > 0) {
      FIRST_DOT_INDEX = FIRST_DOT_INDEX - dotCountPerRow;
    } else if (y < 0) {
      FIRST_DOT_INDEX = FIRST_DOT_INDEX + dotCountPerRow;
    }
  }
  if (checkForBorderCollision(totalDotsCount, dotCountPerRow)) {
    GameOver();
    return;
  }
  if (checkForSelfCollision()) {
    GameOver();
    return;
  }
  movementArr.push(FIRST_DOT_INDEX);
  checkForFoodCollision();
  const lastDotIndex =
    negativeCount < START_DOT_COUNT
      ? negativeCount
      : movementArr[movementArr.length - CURRENT_VISIBLE_DOT_LENGHT - 1];
  if (movementArr.length - CURRENT_VISIBLE_DOT_LENGHT - 1 > 0) {
    movementArr.shift();
  }
  dotsDOM[lastDotIndex].style.display = "none";
  negativeCount++;
  const nextDot = dotsDOM[FIRST_DOT_INDEX];
  nextDot.style.display = "block";
}

function drawFood() {
  let i = getFoodNumber();
  if (!movementArr.includes(i)) {
    foodIndex = i;
    dotsDOM[foodIndex].classList.add("food");
    dotsDOM[foodIndex].style.display = "block";
  } else {
    drawFood();
  }
}

function getFoodNumber() {
  let nb = Math.floor(Math.random() * totalDotsCount);
  return movementArr.length >= START_DOT_COUNT ? nb : START_DOT_COUNT + 10;
}

function checkForFoodCollision() {
  if (movementArr.includes(foodIndex)) {
    CURRENT_VISIBLE_DOT_LENGHT++;
    dotsDOM[foodIndex].classList.remove("food");
    score++;
    scoreDOM.innerHTML = `Score: ${score}`;
    drawFood();
  }
}

function checkForBorderCollision(totalDotsCount, dotCountPerRow) {
  if (FIRST_DOT_INDEX < 0 || FIRST_DOT_INDEX > totalDotsCount) {
    return true;
  }
  if (CURRENT_DIRECTION === "x" && movementDirection.x) {
    if (
      movementDirection.x > 0 &&
      FIRST_DOT_INDEX + 1 > CURRENT_LINE * dotCountPerRow
    ) {
      return true;
    } else if (
      movementDirection.x < 0 &&
      FIRST_DOT_INDEX === CURRENT_LINE * dotCountPerRow - 1
    ) {
      return true;
    }
  }
  return false;
}

function checkForSelfCollision() {
  if (movementArr.includes(FIRST_DOT_INDEX)) {
    return true;
  }
  return false;
}

function GameOver() {
  clearInterval(interval);
  const GGameOverDOM = document.getElementById("game-over");
  if (!GGameOverDOM) {
    const div = document.createElement("div");
    div.id = "game-over";
    div.innerText = "Game Over!";
    div.style.width = GAME_DIMENTIONS + "px";
    div.style.height = GAME_DIMENTIONS + "px";
    gameContainerDOM.appendChild(div);
  } else {
    GGameOverDOM.style.display = "flex";
  }
  pauseDOM.style.display = "none";
  playDOM.style.display = "none";
  restartDOM.style.display = "block";
  document.removeEventListener("keydown", movements);
}

function moveUp() {
  if (CURRENT_DIRECTION === "x") {
    movementDirection = { x: 0, y: DOT_SIZE };
  }
}

function moveDown() {
  if (CURRENT_DIRECTION === "x") {
    movementDirection = { x: 0, y: -DOT_SIZE };
  }
}

function moveLeft() {
  if (CURRENT_DIRECTION === "y") {
    movementDirection = { x: -DOT_SIZE, y: 0 };
  }
}

function moveRight() {
  if (CURRENT_DIRECTION === "y") {
    movementDirection = { x: DOT_SIZE, y: 0 };
  }
}

function SetCurrentDirection() {
  if (movementDirection.x) {
    CURRENT_DIRECTION = "x";
  } else if (movementDirection.y) {
    CURRENT_DIRECTION = "y";
  }
}

function movements(event) {
  if (event.key === "ArrowUp" || event.key === "w") {
    moveUp();
  } else if (event.key === "ArrowDown" || event.key === "s") {
    moveDown();
  } else if (event.key === "ArrowLeft" || event.key === "a") {
    moveLeft();
  } else if (event.key === "ArrowRight" || event.key === "d") {
    moveRight();
  }
}
