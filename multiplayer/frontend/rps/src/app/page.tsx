"use client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

export default function App() {
  const [choice, setChoice] = useState<string | null>(null);
  const [result, setResult] = useState("");
  const choices = ["rock", "paper", "scissors"];

  const sendChoice = (c: string) => {
    setChoice(c);
    socket.emit("choice", c);
  };

  useEffect(() => {
    socket.on("result", (data) => {
      setResult(`P1: ${data.p1} | P2: ${data.p2} → ${data.result}`);
    });
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6">
      <h1 className="text-3xl font-bold">Multiplayer RPS</h1>
      <div className="flex gap-4">
        {choices.map((c) => (
          <button
            key={c}
            className="px-4 py-2 bg-green-500 text-white rounded-lg"
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
