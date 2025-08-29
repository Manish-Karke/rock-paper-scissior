const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

let players = {};
let choices = {};

io.on("connection", (socket) => {
  console.log("Player connected:", socket.id);

  // Register player
  players[socket.id] = { id: socket.id };

  socket.on("choice", (choice) => {
    choices[socket.id] = choice;
    console.log(`Player ${socket.id} chose ${choice}`);

    if (Object.keys(choices).length === 2) {
      const [p1, p2] = Object.keys(choices);
      const c1 = choices[p1];
      const c2 = choices[p2];

      let result;
      if (c1 === c2) result = "Draw!";
      else if (
        (c1 === "rock" && c2 === "scissors") ||
        (c1 === "paper" && c2 === "rock") ||
        (c1 === "scissors" && c2 === "paper")
      )
        result = `Player ${p1} wins!`;
      else result = `Player ${p2} wins!`;

      io.emit("result", { p1: c1, p2: c2, result });
      choices = {}; // reset for next round
    }
  });

  socket.on("disconnect", () => {
    console.log("Player disconnected:", socket.id);
    delete players[socket.id];
  });
});

server.listen(4000, () => console.log("Server running on port 4000"));
