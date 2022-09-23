import React, { useRef, useState } from 'react';
import Boundary from './Boundary';
import Box from './Box';

export default function DragExample() {
  const dragRef = useRef({
    initX: NaN,
    initY: NaN,
  });

  const [{ x, y }, setPosition] = useState({
    x: 0,
    y: 0,
  });

  return (
    <div className="p-20">
      <div className="mb-2">
        <h1 className="text-3xl font-bold">Drag</h1>
        <span>without bounce</span>
      </div>

      <Boundary>
        <Box
          style={{ left: x, top: y }}
          // style={{ transform: `translateX(${x}px) translateY(${y}px)` }}
          onMouseDown={(e) => {
            dragRef.current.initX = e.screenX - x;
            dragRef.current.initY = e.screenY - y;

            const mouseMoveHandler = (e: MouseEvent) => {
              setPosition({
                x: e.screenX - dragRef.current.initX,
                y: e.screenY - dragRef.current.initY,
              });
            };
            const mouseUpHandler = (e: MouseEvent) => {
              document.removeEventListener('mousemove', mouseMoveHandler);
            };

            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler, { once: true });
          }}
        ></Box>
      </Boundary>
    </div>
  );
}
