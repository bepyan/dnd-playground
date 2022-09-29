import registMouseDownDrag from '@/hooks/useMouseDownDrag';
import { useState } from 'react';
import Boundary from './Boundary';

export default function DragSizeCenterExample() {
  const [{ x, y }, setPosition] = useState({
    x: 0,
    y: 0,
  });

  const MIN_W = 80;
  const MIN_H = 80;
  const [{ w, h }, setSize] = useState({
    w: 120,
    h: 120,
  });

  return (
    <div className="p-20">
      <div className="mb-2">
        <h1 className="text-3xl font-bold">Drag Size</h1>
        <span>resize the element size</span>
        <span className="ml-4">
          x:{x} y:{y}
        </span>
        <span className="ml-4">
          w:{w} h:{h}
        </span>
      </div>
      <Boundary className="grid items-center justify-center">
        <div
          className="relative bg-white"
          style={{ transform: `translateX(${x}px) translateY(${y}px)`, width: w, height: h }}
        >
          <div className="absolute bottom-0 top-0 left-0 right-0 p-4">
            <div
              className="h-full w-full cursor-move bg-gray-500"
              {...registMouseDownDrag((deltaX, deltaY) => {
                setPosition({
                  x: x + deltaX,
                  y: y + deltaY,
                });
              })}
            />
          </div>
          <div
            className="absolute top-0 left-0 h-4 w-4 cursor-nw-resize bg-gray-700"
            {...registMouseDownDrag((deltaX, deltaY) => {
              setSize({
                w: Math.max(w - deltaX * 2, MIN_W),
                h: Math.max(h - deltaY * 2, MIN_H),
              });
            })}
          />
          <div
            className="absolute top-0 right-0 h-4 w-4 cursor-ne-resize bg-gray-700"
            {...registMouseDownDrag((deltaX, deltaY) => {
              setSize({
                w: Math.max(w + deltaX * 2, MIN_W),
                h: Math.max(h - deltaY * 2, MIN_H),
              });
            })}
          />
          <div
            className="absolute bottom-0 right-0 h-4 w-4 cursor-se-resize bg-gray-700"
            {...registMouseDownDrag((deltaX, deltaY) => {
              setSize({
                w: Math.max(w + deltaX * 2, MIN_W),
                h: Math.max(h + deltaY * 2, MIN_H),
              });
            })}
          />
          <div
            className="absolute bottom-0 left-0 h-4 w-4 cursor-sw-resize bg-gray-700"
            {...registMouseDownDrag((deltaX, deltaY) => {
              setSize({
                w: Math.max(w - deltaX * 2, MIN_W),
                h: Math.max(h + deltaY * 2, MIN_H),
              });
            })}
          />
        </div>
      </Boundary>
    </div>
  );
}
