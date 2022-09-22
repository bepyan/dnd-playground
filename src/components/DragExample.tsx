import React, { useRef, useState } from 'react';

export default function DragExample() {
  const dragRef = useRef({
    initX: NaN,
    initY: NaN,
    deltaX: 0,
    deltaY: 0,
  });

  const [{ x, y }, setPosition] = useState({
    x: 0,
    y: 0,
  });

  return (
    <div className="p-20">
      <h1 className="mb-3 text-lg font-bold">DRAG</h1>

      <div className="relative h-64 overflow-hidden rounded bg-gray-50">
        <div
          className="absolute h-20 w-20 cursor-move rounded bg-white shadow-lg transition-[transform,shadow] active:scale-95 active:shadow-xl"
          style={{
            left: dragRef.current.deltaX,
            top: dragRef.current.deltaY,
          }}
          onMouseDown={(e) => {
            dragRef.current.initX = e.screenX - x;
            dragRef.current.initY = e.screenY - y;

            const mouseMoveHandler = (e: MouseEvent) => {
              dragRef.current.deltaX = e.screenX - dragRef.current.initX;
              dragRef.current.deltaY = e.screenY - dragRef.current.initY;

              setPosition({
                x: dragRef.current.deltaX,
                y: dragRef.current.deltaY,
              });
            };
            const mouseUpHandler = (e: MouseEvent) => {
              document.removeEventListener('mousemove', mouseMoveHandler);
            };

            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler, { once: true });
          }}
        ></div>
      </div>
    </div>
  );
}
