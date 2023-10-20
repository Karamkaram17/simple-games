let jumpInterval = null;
let time = 0;
let jumpMvnmt = 10;
let obstacleMvmnt = 30;

const DOM = {
  timer: document.querySelector("#timer"),
  start: document.querySelector("#start"),
  play: document.querySelector("#play"),
  pause: document.querySelector("#pause"),
  restart: document.querySelector("#restart"),
  obstacles_count: document.querySelector("#obstacles"),
  obstacle: document.querySelector("#ob"),
  player: document.querySelector("#player"),
  gameOver: document.querySelector("#game-over"),
  jump_btn: document.querySelector("#jump-btn"),
  setTimer: function (time) {
    this.timer.textContent = `Time: ${time}`;
  },
  setObstacles: function (count) {
    this.obstacles_count.textContent = `Obstacles: ${count}`;
  },
  INITIALIZE: function () {
    this.start.style.display = "block";
    this.play.style.display = "none";
    this.pause.style.display = "none";
    this.restart.style.display = "none";
    jumpMvnmt = 10;
    obstacleMvmnt = 30;
  },
  START_OR_PLAY: function () {
    this.start.style.display = "none";
    this.pause.style.display = "block";
    this.play.style.display = "none";
    this.restart.style.display = "none";
  },
  PAUSE: function () {
    this.start.style.display = "none";
    this.play.style.display = "block";
    this.pause.style.display = "none";
    this.restart.style.display = "block";
  },
  showGameOver: function () {
    this.gameOver.style["z-index"] = "10";
    this.INITIALIZE();
  },
  hideGameOver: function () {
    this.gameOver.style["z-index"] = "-10";
    this.START_OR_PLAY();
  },
  movePlayer: function (position) {
    this.player.style.bottom = `${position}px`;
  },
  moveObstacle: function (position) {
    this.obstacle.style.right = `${position}px`;
  },
};

const timer = {
  totalSeconds: 0,
  timerInterval: null,
  start: function () {
    DOM.START_OR_PLAY();
    this.updateDisplay();
    this.timerInterval = setInterval(() => this.increaseTime(), 1000);
  },
  pause: function () {
    DOM.PAUSE();
    clearInterval(this.timerInterval);
  },
  restart: function () {
    DOM.INITIALIZE();
    clearInterval(this.timerInterval);
    this.totalSeconds = 0;
    this.updateDisplay();
  },
  increaseTime: function () {
    this.totalSeconds++;
    this.updateDisplay();
  },
  updateDisplay: function () {
    const minutes = Math.floor(this.totalSeconds / 60);
    const remainingSeconds = this.totalSeconds % 60;
    const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
    DOM.setTimer(formattedTime);
  },
};

const game = {
  gameInterval: null,
  gameSpeed: 15,
  obstacles: 0,
  start: function (initializeGame) {
    if (initializeGame) {
      timer.restart();
      DOM.hideGameOver();
      this.obstacles = 0;
      DOM.setObstacles(this.obstacles);
      DOM.moveObstacle(30);
      DOM.movePlayer(10);
    }
    timer.start();
    this.gameInterval = setInterval(() => this.play(), this.gameSpeed);
    this.addListener();
  },
  pause: function () {
    timer.pause();
    clearInterval(this.gameInterval);
    this.removeListener();
  },
  restart: function () {
    timer.restart();
    this.obstacles = 0;
    DOM.setObstacles(this.obstacles);
    clearInterval(this.gameInterval);
    this.removeListener();
  },
  gameOver: function () {
    this.pause();
    DOM.showGameOver();
    this.removeListener();
  },
  play: function () {
    this.moveObstacles();
  },
  moveObstacles: function () {
    const max = 250;
    const min = 0;
    if (obstacleMvmnt >= max) {
      obstacleMvmnt = min;
      this.obstacles++;
      DOM.setObstacles(this.obstacles);
    }
    obstacleMvmnt += 5;
    DOM.moveObstacle(obstacleMvmnt);
    this.checkForImpact();
  },
  checkForImpact: function () {
    const obPosition = DOM.obstacle.style.right;
    const jump_y = DOM.player.style.bottom;
    if (obPosition === "220px") {
      if (jump_y === "10px" || jump_y === "15px") {
        this.gameOver();
      }
    }
  },
  addListener: function () {
    document.addEventListener("keydown", this.jump);
    if (window.innerWidth < 600) {
      DOM.jump_btn.style.display = "block";
      DOM.jump_btn.addEventListener("click", this.jump);
    }
  },
  removeListener: function () {
    document.removeEventListener("keydown", this.jump);
    if (window.innerWidth < 600) {
      DOM.jump_btn.removeEventListener("click", this.jump);
      DOM.jump_btn.style.display = "none";
    }
  },
  jump: function (e) {
    if ((e.key === " " && e.type === "keydown") || e.type === "click") {
      DOM.movePlayer(10);
      if (jumpMvnmt === 10 && time === 0) {
        jumpInterval = setInterval(() => {
          time += 10;
          if (time <= 500 / 2) {
            jumpMvnmt += 2;
          } else {
            jumpMvnmt -= 2;
          }
          DOM.movePlayer(jumpMvnmt);
          if (jumpMvnmt <= 10 || time >= 1000) {
            jumpMvnmt = 10;
            time = 0;
            clearInterval(jumpInterval);
            return;
          }
        }, 10);
      }
    }
  },
};

function toggleButtonVisibility() {
  if (window.innerWidth < 600) {
    DOM.jump_btn.style.display = "block";
  } else {
    DOM.jump_btn.style.display = "none";
  }
}

// Initial call to set the button's visibility when the page loads.
toggleButtonVisibility();

DOM.INITIALIZE();
window.addEventListener("resize", toggleButtonVisibility);
