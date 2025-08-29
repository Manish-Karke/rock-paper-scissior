const readline = require("readline");

const r1 = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function play() {
  r1.question("player 1: Rock, Paper , or Scissor?", (p1) => {
    r1.question("player 2: Rock, Paper , or Scissor?", (p2) => {
      p1 = p1.toLowerCase();
      p2 = p2.toLowerCase();

      if (p1 === p2) {
        console.log("hey dude, DRAW");
      } else if (
        (p1 === "rock" && p2 === "scissors") ||
        (p1 === "paper" && p2 === "rock") ||
        (p1 === "scissors" && p2 === "paper")
      ) {
        console.log("player1 owns he is hero");
      } else {
        console.log("player2 owns he is hero");
      }
      r1.close();
    });
  });
}

play();
