const result = document.querySelector("#result");
const x = document.querySelector("#x");
const o = document.querySelector("#o");
const t = document.querySelector("#t");
const btns = document.querySelector("#btns");
let choices = ["", "", "", "", "", "", "", "", ""];
let divs = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
let availableChoisesIndexs = [0, 1, 2, 3, 4, 5, 6, 7, 8];
let endGame = false;
let xWins = 0;
let oWins = 0;
let tWins = 0;

function choose(id, choice) {
  if (endGame) {
    return;
  }
  const target = document.querySelector(`#d${id}`);
  if (!choices[id - 1]) {
    target.innerHTML = choice;
    target.classList.add("disabled");
    choices[id - 1] = choice;
  }
  if (checkWin(choice) === true) {
    endGame = true;
    divs.forEach((id) => {
      document.querySelector(`#d${id}`).classList.add("disabled");
    });
    result.innerHTML = choice + " wins";
    if (choice === "X") {
      xWins++;
      x.innerHTML = "X: " + xWins + " Wins";
    } else if (choice === "O") {
      oWins++;
      o.innerHTML = "O: " + oWins + " Wins";
    }
    btns.innerHTML = `<button class="btn btn-dark" onclick="Restart()" >Play again</button> <button onclick="reset()" class="btn btn-dark" >Reset</button> `;
  }
  if (checkWin(choice) === false) {
    endGame = true;
    divs.forEach((id) => {
      document.querySelector(`#d${id}`).classList.add("disabled");
    });
    result.innerHTML = "Tie !";
    tWins++;
    t.innerHTML = "Tie: " + tWins;
    btns.innerHTML = `<button class="btn btn-dark" onclick="Restart()" >Play again</button> <button class="btn btn-dark" onclick="reset()" >Reset</button> `;
  }
  if (choice === "X" && choices[id - 1] === "X") {
    choose(computerMove("O") + 1, "O");
  }
}

function computerMove(player) {
  // Define the opponent's symbol
  const opponent = player === "X" ? "O" : "X";

  // Check for a winning move
  for (let i = 0; i < choices.length; i++) {
    if (choices[i] === "") {
      choices[i] = player;
      if (checkWin(player)) {
        choices[i] = ""; // Undo the move
        return i; // Winning move found
      }
      choices[i] = ""; // Undo the move
    }
  }

  // Check for a blocking move
  for (let i = 0; i < choices.length; i++) {
    if (choices[i] === "") {
      choices[i] = opponent;
      if (checkWin(opponent)) {
        choices[i] = ""; // Undo the move
        return i; // Blocking move found
      }
      choices[i] = ""; // Undo the move
    }
  }

  // If no winning or blocking moves, make a strategic move
  if (choices[4] === "") {
    return 4; // Try to take the center if available
  }

  // If the center is not available, choose a random empty corner
  const corners = [0, 2, 6, 8];
  const emptyCorners = corners.filter((corner) => choices[corner] === "");
  if (emptyCorners.length > 0) {
    return emptyCorners[Math.floor(Math.random() * emptyCorners.length)];
  }

  // If no corners are available, choose a random empty side
  const sides = [1, 3, 5, 7];
  const emptySides = sides.filter((side) => choices[side] === "");
  return emptySides[Math.floor(Math.random() * emptySides.length)];
}

function checkWin(player) {
  const winCombos = [
    [0, 1, 2], // Rows
    [3, 4, 5], // Rows
    [6, 7, 8], // Rows
    [0, 3, 6], // Columns
    [1, 4, 7], // Columns
    [2, 5, 8], // Columns
    [0, 4, 8], // Diagonals
    [2, 4, 6], // Diagonals
  ];

  for (const combo of winCombos) {
    if (
      choices[combo[0]] === player &&
      choices[combo[1]] === player &&
      choices[combo[2]] === player
    ) {
      return true; // Player has won
    }
  }

  if (choices.every((v) => !!v)) {
    return false; // tie
  } else return undefined; // continue
}

function Restart() {
  result.innerHTML = "";
  btns.innerHTML = "";
  endGame = false;
  divs.forEach((id) => {
    const target = document.querySelector(`#d${id}`);
    target.classList.remove("disabled");
    target.innerHTML = "";
  });
  choices = ["", "", "", "", "", "", "", "", ""];
  availableChoisesIndexs = [0, 1, 2, 3, 4, 5, 6, 7, 8];
}

function reset() {
  result.innerHTML = "";
  btns.innerHTML = "";
  endGame = false;
  divs.forEach((id) => {
    const target = document.querySelector(`#d${id}`);
    target.classList.remove("disabled");
    target.innerHTML = "";
  });
  choices = ["", "", "", "", "", "", "", "", ""];
  availableChoisesIndexs = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  oWins = 0;
  xWins = 0;
  tWins = 0;
  t.innerHTML = "Tie: 0";
  x.innerHTML = "X: 0 Wins";
  o.innerHTML = "O: 0 Wins";
  current = "X";
}
