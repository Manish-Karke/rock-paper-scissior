const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

let players = {}; // { socketId: { id, name } }
let choices = {}; // { socketId: "rock" }

io.on("connection", (socket) => {
  console.log("Player connected:", socket.id);

  // Player sets their name
  socket.on("setName", (name) => {
    players[socket.id] = { id: socket.id, name };
    console.log(`✅ ${socket.id} registered as ${name}`);
  });

  // Player makes a choice
  socket.on("choice", (choice) => {
    const player = players[socket.id];

    // If player hasn't registered yet, ignore
    if (!player || !player.name) {
      console.log("❌ Choice ignored, player not registered:", socket.id);
      return;
    }

    choices[socket.id] = choice;
    console.log(`${player.name} chose ${choice}`);

    if (Object.keys(choices).length === 2) {
      const [p1, p2] = Object.keys(choices);
      const c1 = choices[p1];
      const c2 = choices[p2];

      const name1 = players[p1]?.name || "Player 1";
      const name2 = players[p2]?.name || "Player 2";

      let result;
      if (c1 === c2) result = "It's a Draw!";
      else if (
        (c1 === "rock" && c2 === "scissors") ||
        (c1 === "paper" && c2 === "rock") ||
        (c1 === "scissors" && c2 === "paper")
      )
        result = `${name1} wins!`;
      else result = `${name2} wins!`;

      io.emit("result", {
        p1: { name: name1, choice: c1 },
        p2: { name: name2, choice: c2 },
        result,
      });

      choices = {}; // reset round
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("Player disconnected:", players[socket.id]?.name || socket.id);
    delete players[socket.id];
    delete choices[socket.id];
  });
});

server.listen(4000, () =>
  console.log("✅ Server running on http://localhost:4000")
);
