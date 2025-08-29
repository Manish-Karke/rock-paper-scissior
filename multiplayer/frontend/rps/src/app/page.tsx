"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

export default function App() {
  const [name, setName] = useState("");
  const [registered, setRegistered] = useState(false);
  const [choice, setChoice] = useState(null);
  const [result, setResult] = useState("");
  const choices = ["rock", "paper", "scissors"];

  const register = () => {
    if (name.trim()) {
      socket.emit("setName", name);
      setRegistered(true);
    }
  };

  const sendChoice = (c) => {
    setChoice(c);
    socket.emit("choice", c);
  };

  useEffect(() => {
    socket.on("result", (data) => {
      setResult(
        `${data.p1.name}: ${data.p1.choice} | ${data.p2.name}: ${data.p2.choice} → ${data.result}`
      );
    });
  }, []);

  if (!registered) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        <h1 className="text-2xl font-bold">Enter your name</h1>
        <input
          className="border p-2 rounded"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={register}
        >
          Join Game
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6">
      <h1 className="text-3xl font-bold">Welcome, {name}</h1>
      <div className="flex gap-4">
        {choices.map((c) => (
          <button
            key={c}
            disabled={!registered} // ✅ can’t play until registered
            className="px-4 py-2 bg-green-500 text-white rounded-lg disabled:opacity-50"
            onClick={() => sendChoice(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="text-xl">You chose: {choice ?? "-"}</div>
      <div className="text-2xl font-semibold">{result}</div>
    </div>
  );
}
