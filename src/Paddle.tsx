import React, { CSSProperties } from 'react';
import { Position } from './App';

function Paddle({ pos }: { pos: Position }) {
  const style: CSSProperties = {
    backgroundColor: 'yellow',
    width: '4rem',
    height: '4rem',
    position: 'absolute',
    top: `${pos.y}px`,
    left: `${pos.x}px`,
  };

  return <div style={style} />;
}

export default Paddle;
