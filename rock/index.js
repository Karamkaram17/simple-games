const choises = document.querySelector("#choise");
const computer = document.querySelector("#computer");
const statuss = document.querySelector("#status");
const options = ["rock", "paper", "scisors"];

function choose(choice) {
  choises.innerHTML = choice;
  const computerchoice = options[Math.floor(Math.random() * 3)];
  computer.innerHTML = computerchoice;

  if (choice === computerchoice) {
    statuss.innerHTML = "Tie !";
    statuss.className = "h2 text-warning";
  } else if (choice === "rock") {
    if (computerchoice === "paper") {
      statuss.innerHTML = "You Loose !";
      statuss.className = "h2 text-danger";
    } else if (computerchoice === "scisors") {
      statuss.innerHTML = "You Win !";
      statuss.className = "h2 text-light";
    }
  } else if (choice === "paper") {
    if (computerchoice === "rock") {
      statuss.innerHTML = "You Win !";
      statuss.className = "h2 text-light";
    } else if (computerchoice === "scisors") {
      statuss.innerHTML = "You Loose !";
      statuss.className = "h2 text-danger";
    }
  } else if (choice === "scisors") {
    if (computerchoice === "paper") {
      statuss.innerHTML = "You Win !";
      statuss.className = "h2 text-light";
    } else if (computerchoice === "rock") {
      statuss.innerHTML = "You Loose !";
      statuss.className = "h2 text-danger";
    }
  }
}
