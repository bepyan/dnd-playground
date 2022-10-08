import { inrange } from '@/utils';
import React, { useRef, useState } from 'react';
import Boundary from '../Boundary';
import Box from '../Box';

export default function DragBouceExample() {
  const boundaryRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const [{ x, y }, setPosition] = useState({
    x: 0,
    y: 0,
  });

  return (
    <div className="p-4">
      <div className="mb-2">
        <h1 className="text-3xl font-bold">Drag Boundary</h1>
        <span>with boundary bounce</span>
        <span className="ml-4">
          x:{x} y:{y}
        </span>
      </div>

      <Boundary ref={boundaryRef} className="grid items-center justify-center">
        <div
          className="h-24 w-24"
          style={{ transform: `translateX(${x}px) translateY(${y}px)` }}
          onMouseDown={(e) => {
            const initX = e.pageX;
            const initY = e.pageY;

            const mouseMoveHandler = (e: MouseEvent) => {
              if (boundaryRef.current && boxRef.current) {
                const boundary = boundaryRef.current.getBoundingClientRect();
                const box = boxRef.current.getBoundingClientRect();
                const BOUNDARY_MARGIN = 12;

                const deltaX = e.pageX - initX;
                const deltaY = e.pageY - initY;

                setPosition({
                  x: inrange(
                    x + deltaX,
                    Math.floor(-boundary.width / 2 + box.width / 2 + BOUNDARY_MARGIN),
                    Math.floor(boundary.width / 2 - box.width / 2 - BOUNDARY_MARGIN),
                  ),
                  y: inrange(
                    y + deltaY,
                    Math.floor(-boundary.height / 2 + box.height / 2 + BOUNDARY_MARGIN),
                    Math.floor(boundary.height / 2 - box.height / 2 - BOUNDARY_MARGIN),
                  ),
                });
              }
            };
            const mouseUpHandler = (e: MouseEvent) => {
              document.removeEventListener('mousemove', mouseMoveHandler);
            };

            document.addEventListener('mousemove', mouseMoveHandler);
            document.addEventListener('mouseup', mouseUpHandler, { once: true });
          }}
        >
          <Box ref={boxRef} />
        </div>
      </Boundary>
    </div>
  );
}
