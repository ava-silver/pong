import React, { KeyboardEvent, useEffect, useState } from 'react';
import Ball from './Ball';
import Paddle from './Paddle';

export interface Position {
  x: number;
  y: number;
}

const UPDATE_TICK_MS = 20;
const BALL_INITIAL_SPEED = 15;
type Velocity = Position;
const PLAYER_SPEED = 10;

// const MIN_REFLECT_MS = 150; // min time between player bounces

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

const MIN_X = 40;
const MAX_X = 1240;
const MIN_Y = 8;
const MAX_Y = 808;
const BALL_SIZE = 48;
const PLAYER_SIZE = 64;
const GOAL_SIZE = 160;
const BOARD_CENTER_Y = (MAX_Y + MIN_Y) / 2;
const BOARD_CENTER_X = (MAX_X + MIN_X) / 2;

function center(player: Position, size: number): Position {
  return { x: player.x + size / 2, y: player.y + size / 2 };
}
function distance(p1: Position, p2: Position) {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}
function overlap(player: Position, ball: Position): boolean {
  const pC = center(player, PLAYER_SIZE);
  const bC = center(ball, BALL_SIZE);
  return distance(pC, bC) <= PLAYER_SIZE / 2 + BALL_SIZE / 2;
}
function dot(p1: Velocity, p2: Velocity): number {
  return p1.x * p2.x + p1.y * p2.y;
}
function reflect(player: Position, ball: Position, bV: Velocity): Velocity {
  // already been reflected, traveling away from the player
  if (dot({ x: ball.x - player.x, y: ball.y - player.y }, bV) > 0) {
    return bV;
  }
  player = center(player, PLAYER_SIZE);
  ball = center(ball, BALL_SIZE);
  const midpoint: Position = { x: (player.x + ball.x) / 2, y: (player.y + ball.y) / 2 };
  // slope of tangent line:
  const dx = -(ball.y - player.y);
  const dy = ball.x - player.x;

  // adjust velocity relative to midpoint
  bV = { x: bV.x + midpoint.x, y: bV.y + midpoint.y };

  if (dx === 0 && dy === 0) {
    // don't think we should ever get here?
    return { x: 2 * midpoint.x - bV.x, y: 2 * midpoint.y - bV.y };
  } else {
    const t = ((bV.x - midpoint.x) * dx + (bV.y - midpoint.y) * dy) / (dx * dx + dy * dy);
    // calculate the points and adjust the velocity
    // to not be relative to the midpoint
    const x = 2 * (midpoint.x + t * dx) - bV.x - midpoint.x;
    const y = 2 * (midpoint.y + t * dy) - bV.y - midpoint.y;
    return { x, y };
  }
}

export function goalScored(ball: Position): boolean {
  return (
    (ball.x <= MIN_X || ball.x + BALL_SIZE >= MAX_X - 5) &&
    ball.y > BOARD_CENTER_Y - GOAL_SIZE / 2 &&
    ball.y < BOARD_CENTER_Y + GOAL_SIZE / 2
  );
}

function useBallPhysics(
  ball: Position,
  player: Position,
  setBallVel: React.Dispatch<React.SetStateAction<Velocity>>,
) {
  // let timeSinceBounce = useRef(Date.now());
  useEffect(() => {
    // assume circular player and ball, position being topleft
    if (overlap(player, ball)) {
      return setBallVel(ballVel => reflect(player, ball, ballVel));
    }
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
    if (xVelModifier !== undefined || yVelModifier !== undefined) {
      setBallVel(({ x, y }) => {
        return {
          x: xVelModifier === undefined ? x : xVelModifier * Math.abs(x),
          y: yVelModifier === undefined ? y : yVelModifier * Math.abs(y),
        };
      });
    }
  }, [ball, player, setBallVel]);
}

function App() {
  const [playerPos, setPlayerPos] = useState<Position>({ x: 1150, y: 50 });
  const [ballPos, setBallPos] = useState<Position>({ x: 500, y: 500 });
  const [ballVel, setBallVel] = useState<Velocity>({
    x: 0,
    y: BALL_INITIAL_SPEED,
  });
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

  useBallPhysics(ballPos, playerPos, setBallVel);
  useEffect(() => {
    if (goalScored(ballPos)) {
      console.log('scored');
    }
  }, [ballPos]);

  function handleInput(evt: KeyboardEvent) {
    // stops the player if theyre colliding with a ball to reduce jank physics
    if (overlap(playerPos, ballPos)) {
      return;
    }
    const key = evt.key as keyof typeof playerMotion;
    if (Object.keys(playerMotion).includes(key)) {
      setPlayerPos(playerMotion[key]);
    }
  }
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
      }}>
      <div
        style={{
          backgroundColor: 'blue',
          height: '10rem',
          width: '2rem',
        }}
      />
      <div
        style={{
          backgroundColor: 'black',
          height: '50rem',
          width: '75rem',
        }}
        tabIndex={0}
        onKeyDown={handleInput}>
        <Ball pos={ballPos} />
        <Paddle pos={playerPos} />
      </div>
      <div
        style={{
          backgroundColor: 'blue',
          height: '10rem',
          width: '2rem',
        }}
      />
    </div>
  );
}

export default App;
