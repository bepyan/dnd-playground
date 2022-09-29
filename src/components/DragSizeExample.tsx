import registMouseDownDrag from '@/hooks/useMouseDownDrag';
import { useEffect, useRef, useState } from 'react';
import Boundary from './Boundary';

export default function DragSizeExample() {
  const MIN_W = 80;
  const MIN_H = 80;

  const boundaryRef = useRef<HTMLDivElement>(null);
  const [{ x, y, w, h }, setConfig] = useState({
    x: 0,
    y: 0,
    w: 0,
    h: 0,
  });

  useEffect(() => {
    const boundary = boundaryRef.current?.getBoundingClientRect();

    if (boundary) {
      const defaultW = 240;
      const defulatH = 120;
      setConfig({
        x: Math.floor(boundary.width / 2 - defaultW / 2),
        y: Math.floor(boundary.height / 2 - defulatH / 2),
        w: defaultW,
        h: defulatH,
      });
    }
  }, [boundaryRef]);

  return (
    <div className="p-20">
      <div className="mb-2">
        <h1 className="text-3xl font-bold">Drag Size</h1>
        <span>resize the element size like powerpoint</span>
        <span className="ml-4">
          x:{x} y:{y}
        </span>
        <span className="ml-4">
          w:{w} h:{h}
        </span>
      </div>
      <Boundary ref={boundaryRef}>
        <div
          className="relative bg-white"
          style={{ transform: `translateX(${x}px) translateY(${y}px)`, width: w, height: h }}
        >
          <div className="absolute bottom-0 top-0 left-0 right-0 p-4">
            <div
              className="h-full w-full cursor-move bg-gray-500"
              {...registMouseDownDrag((deltaX, deltaY) => {
                setConfig({
                  x: x + deltaX,
                  y: y + deltaY,
                  w,
                  h,
                });
              })}
            />
          </div>
          <div
            className="absolute top-0 left-0 h-4 w-4 cursor-nw-resize bg-gray-700"
            {...registMouseDownDrag((deltaX, deltaY) => {
              setConfig({
                x: Math.min(x + deltaX, x + (w - MIN_W)),
                y: Math.min(y + deltaY, y + (h - MIN_H)),
                w: Math.max(w - deltaX, MIN_W),
                h: Math.max(h - deltaY, MIN_H),
              });
            })}
          />
          <div
            className="absolute top-0 right-0 h-4 w-4 cursor-ne-resize bg-gray-700"
            {...registMouseDownDrag((deltaX, deltaY) => {
              setConfig({
                x,
                y: Math.min(y + deltaY, y + (h - MIN_H)),
                w: Math.max(w + deltaX, MIN_W),
                h: Math.max(h - deltaY, MIN_H),
              });
            })}
          />
          <div
            className="absolute bottom-0 right-0 h-4 w-4 cursor-se-resize bg-gray-700"
            {...registMouseDownDrag((deltaX, deltaY) => {
              setConfig({
                x,
                y,
                w: Math.max(w + deltaX, MIN_W),
                h: Math.max(h + deltaY, MIN_H),
              });
            })}
          />
          <div
            className="absolute bottom-0 left-0 h-4 w-4 cursor-sw-resize bg-gray-700"
            {...registMouseDownDrag((deltaX, deltaY) => {
              setConfig({
                x: Math.min(x + deltaX, x + (w - MIN_W)),
                y,
                w: Math.max(w - deltaX, MIN_W),
                h: Math.max(h + deltaY, MIN_H),
              });
            })}
          />
        </div>
      </Boundary>
    </div>
  );
}

// w 80
// x 321 -> 320 / deltaX 40 => x -> 280
