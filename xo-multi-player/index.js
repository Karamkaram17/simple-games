const result = document.querySelector("#result");
const x = document.querySelector("#x");
const o = document.querySelector("#o");
const t = document.querySelector("#t");
const btns = document.querySelector("#btns");
const c = document.querySelector("#current");
const start = "X";
let current = "X";
let choices = ["", "", "", "", "", "", "", "", ""];
let divs = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
let endGame = false;
let xWins = 0;
let oWins = 0;
let tWins = 0;

function choise(id) {
  if (endGame) {
    return;
  }
  let choice;
  if (start !== current) {
    choice = "O";
    current = "O";
  } else {
    choice = start;
    current = "X";
  }
  c.innerHTML = `${current === "X" ? "O" : "X"}'s Turn`;
  const target = document.querySelector(`#d${id}`);
  if (target.innerHTML) return;
  if (!choices[id - 1]) {
    target.innerHTML = choice;
    target.classList.add("disabled");
    choices[id - 1] = choice;
    current === "X" ? (current = "Y") : (current = "X");
  }
  if (checkForWin() === true) {
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
    btns.innerHTML = `<button class="btn btn-dark" onclick="Restart()" >Play Again</button> <button onclick="reset()" class="btn btn-dark" >Reset</button> `;
  }
  if (checkForWin() === false) {
    endGame = true;
    divs.forEach((id) => {
      document.querySelector(`#d${id}`).classList.add("disabled");
    });
    result.innerHTML = "Tie !";
    tWins++;
    t.innerHTML = "Tie: " + tWins;
    btns.innerHTML = `<button class="btn btn-dark" onclick="Restart()" >Play Again</button> <button class="btn btn-dark" onclick="reset()" >Reset</button> `;
  }
}

function checkForWin() {
  if (
    (choices[0] === choices[1] && choices[1] === choices[2] && choices[1]) ||
    (choices[3] === choices[4] && choices[4] === choices[5] && choices[4]) ||
    (choices[6] === choices[7] && choices[7] === choices[8] && choices[7]) ||
    (choices[0] === choices[4] && choices[4] === choices[8] && choices[4]) ||
    (choices[6] === choices[4] && choices[4] === choices[2] && choices[4]) ||
    (choices[0] === choices[3] && choices[3] === choices[6] && choices[3]) ||
    (choices[1] === choices[4] && choices[4] === choices[7] && choices[4]) ||
    (choices[2] === choices[5] && choices[5] === choices[8] && choices[5])
  ) {
    return true;
  } else if (choices.every((v) => !!v)) {
    return false;
  } else return undefined;
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
  oWins = 0;
  xWins = 0;
  tWins = 0;
  t.innerHTML = "Tie: 0";
  x.innerHTML = "X: 0 Wins";
  o.innerHTML = "O: 0 Wins";
  c.innerHTML = "X's Turn";
  current = "X";
}
