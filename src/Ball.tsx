import React, { CSSProperties } from 'react';
import { Position } from './App';

function Ball({ pos }: { pos: Position }) {
  const style: CSSProperties = {
    backgroundColor: 'red',
    width: '3rem',
    height: '3rem',
    position: 'absolute',
    borderRadius: '50%',
    top: `${pos.y}px`,
    left: `${pos.x}px`,
  };

  return <div style={style} />;
}

export default Ball;
