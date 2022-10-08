import { useState } from 'react';
import Boundary from '../Boundary';

export default function TouchExample() {
  const [{ x, y }, setPosition] = useState({
    x: 0,
    y: 0,
  });

  return (
    <div className="p-4">
      <div className="mb-2">
        <h1 className="text-3xl font-bold">DOM Event</h1>
        <span>watch the console log</span>
        <span className="ml-4">
          screen x:{x} y:{y}
        </span>
      </div>
      <Boundary
        onTouchStart={(touchEvent) => {
          const mouseMoveHandler = (moveEvent: TouchEvent) => {
            setPosition({
              x: moveEvent.touches[0].pageX - touchEvent.touches[0].pageX,
              y: moveEvent.touches[0].pageY - touchEvent.touches[0].pageY,
            });
          };
          const touchEndHandler = () => {
            document.removeEventListener('touchmove', mouseMoveHandler);
          };

          document.addEventListener('touchmove', mouseMoveHandler);
          document.addEventListener('touchend', touchEndHandler, { once: true });
        }}
      />
    </div>
  );
}
