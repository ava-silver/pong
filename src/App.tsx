import React, { KeyboardEvent, useEffect, useState } from 'react';
import Ball from './Ball';
import Paddle from './Paddle';

export interface Position {
  x: number;
  y: number;
}

const UPDATE_TICK_MS = 20;

type Velocity = Position;
const PLAYER_SPEED = 10;

const playerMotion = {
  ArrowUp: ({ x, y }: Position) => {
    return { x, y: y - PLAYER_SPEED };
  },
  ArrowDown: ({ x, y }: Position) => {
    return { x, y: y + PLAYER_SPEED };
  },
  ArrowLeft: ({ x, y }: Position) => {
    return { x: x - PLAYER_SPEED, y };
  },
  ArrowRight: ({ x, y }: Position) => {
    return { x: x + PLAYER_SPEED, y };
  },
};

const MIN_X = 0;
const MAX_X = 1200;
const MIN_Y = 0;
const MAX_Y = 800;
const BALL_SIZE = 48;
const PLAYER_SIZE = 60;

function center(player: Position, size: number): Position {
  return { x: player.x + size / 2, y: player.y + size / 2 };
}
function distance(p1: Position, p2: Position) {
  return Math.sqrt(Math.pow(p2.x - p2.x, 2) + Math.pow(p2.y - p2.y, 2));
}
function overlap(player: Position, ball: Position): boolean {
  const pC = center(player, PLAYER_SIZE);
  const bC = center(ball, BALL_SIZE);
  return distance(pC, bC) <= PLAYER_SIZE / 2 + BALL_SIZE / 2;
}

function useBallPhysics(
  ball: Position,
  ballVel: Velocity,
  player: Position,
  setBallVel: React.Dispatch<React.SetStateAction<Velocity>>,
) {
  useEffect(() => {
    let xVelModifier: number | undefined = undefined;
    let yVelModifier: number | undefined = undefined;
    if (ball.x + BALL_SIZE >= MAX_X) {
      xVelModifier = -1;
    } else if (ball.x <= MIN_X) {
      xVelModifier = 1;
    }
    if (ball.y + BALL_SIZE >= MAX_Y) {
      yVelModifier = -1;
    } else if (ball.y <= MIN_Y) {
      yVelModifier = 1;
    }
    // assume circular player and ball, position being topleft
    if (overlap(player, ball)) {
    }
    if (xVelModifier !== undefined || yVelModifier !== undefined) {
      setBallVel(({ x, y }) => {
        return {
          x: xVelModifier === undefined ? x : xVelModifier * Math.abs(x),
          y: yVelModifier === undefined ? y : yVelModifier * Math.abs(y),
        };
      });
    }
  }, [ball, ballVel, player, setBallVel]);
}

function App() {
  const [playerPos, setPlayerPos] = useState<Position>({ x: 1150, y: 50 });
  const [ballPos, setBallPos] = useState<Position>({ x: 500, y: 500 });
  const [ballVel, setBallVel] = useState<Velocity>({ x: 3, y: 3 });
  useEffect(() => {
    const id = setInterval(() => {
      setBallPos(({ x, y }) => {
        return {
          x: x + ballVel.x,
          y: y + ballVel.y,
        };
      });
    }, UPDATE_TICK_MS);
    return () => clearInterval(id);
  }, [ballVel]);

  useBallPhysics(ballPos, ballVel, playerPos, setBallVel);

  function handleInput(evt: KeyboardEvent) {
    const key = evt.key as keyof typeof playerMotion;
    if (Object.keys(playerMotion).includes(key)) {
      setPlayerPos(playerMotion[key]);
    }
  }
  return (
    <div
      style={{
        position: 'absolute',
        left: '60px',
        backgroundColor: 'black',
        height: '50rem',
        width: '75rem',
      }}
      tabIndex={0}
      onKeyDown={handleInput}>
      <Ball pos={ballPos} />
      <Paddle pos={playerPos} />
    </div>
  );
}

export default App;
