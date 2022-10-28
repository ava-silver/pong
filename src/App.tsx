import React, { KeyboardEvent, useState } from "react";
import Paddle from "./Paddle";

export interface Position {
  x: number;
  y: number;
}

function App() {
  const [player1Pos, setPlayer1Pos] = useState<number>(50);
  const [player2Pos, setPlayer2Pos] = useState<number>(50);
  // const [p1move, setP1move] = useState<-1 | 0 | 1>(0);
  // const [p2move, setP2move] = useState<-1 | 0 | 1>(0);

  function handleInput(evt: KeyboardEvent) {
    if (evt.shiftKey && !evt.ctrlKey) {
      // P1 up
      setPlayer1Pos((y) => y - 10);
    } else if (!evt.shiftKey && evt.ctrlKey) {
      // P1 down
      setPlayer1Pos((y) => y + 10);
    }
    if (evt.key === "ArrowUp") {
      // P2 up
      setPlayer2Pos((y) => y - 10);
    } else if (evt.key === "ArrowDown") {
      // P2 down
      setPlayer2Pos((y) => y + 10);
    }
  }
  return (
    <div
      style={{
        position: "absolute",
        left: "60px",
        backgroundColor: "black",
        height: "50rem",
        width: "75rem",
      }}
      tabIndex={0}
      onKeyDown={handleInput}
    >
      <Paddle pos={{ x: 0, y: player1Pos }} />
      <Paddle pos={{ x: 800, y: player2Pos }} />
    </div>
  );
}

export default App;
