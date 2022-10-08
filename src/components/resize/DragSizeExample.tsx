import { inrange } from '@/utils';
import registDragEvent from '@/utils/registDragEvent';
import { useEffect, useRef, useState } from 'react';
import Boundary from '../Boundary';

const BOUNDARY_MARGIN = 12;
const MIN_W = 80;
const MIN_H = 80;

export default function DragSizeExample() {
  const boundaryRef = useRef<HTMLDivElement>(null);

  const [{ x, y, w, h }, setConfig] = useState({
    x: 0,
    y: 0,
    w: 0,
    h: 0,
  });
  const [show, setShow] = useState(true);

  useEffect(() => {
    const boundary = boundaryRef.current?.getBoundingClientRect();

    if (boundary) {
      const DEFAULT_W = 240;
      const DEFAULT_H = 120;
      setConfig({
        x: Math.floor(boundary.width / 2 - DEFAULT_W / 2),
        y: Math.floor(boundary.height / 2 - DEFAULT_H / 2),
        w: DEFAULT_W,
        h: DEFAULT_H,
      });
    }
  }, []);

  return (
    <div className="p-4">
      <div className="mb-2">
        <h1 className="text-3xl font-bold">Drag Size</h1>
        <div>
          <span>resize the element size with boundary</span>
          <span className="ml-4">
            x:{Math.floor(x)} y:{Math.floor(y)}
          </span>
          <span className="ml-4">
            w:{Math.floor(w)} h:{Math.floor(h)}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <label htmlFor="show">show active playground</label>
          <input id="show" type="checkbox" checked={show} onChange={() => setShow(!show)} />
        </div>
      </div>
      <Boundary ref={boundaryRef}>
        <div
          style={{ width: w, height: h, left: x, top: y }}
          className="relative"
          {...registDragEvent((deltaX, deltaY) => {
            if (!boundaryRef.current) return;

            const boundary = boundaryRef.current.getBoundingClientRect();

            setConfig({
              x: inrange(x + deltaX, BOUNDARY_MARGIN, boundary.width - w - BOUNDARY_MARGIN),
              y: inrange(y + deltaY, BOUNDARY_MARGIN, boundary.height - h - BOUNDARY_MARGIN),
              w,
              h,
            });
          })}
        >
          <Box />

          {/* 좌상단 */}
          <div
            className="absolute -top-1 -left-1 h-4 w-4 cursor-nw-resize"
            style={{ backgroundColor: show ? '#12121250' : 'transparent' }}
            {...registDragEvent((deltaX, deltaY) => {
              setConfig({
                x: inrange(x + deltaX, BOUNDARY_MARGIN, x + w - MIN_W),
                y: inrange(y + deltaY, BOUNDARY_MARGIN, y + h - MIN_H),
                w: inrange(w - deltaX, MIN_W, x + w - BOUNDARY_MARGIN),
                h: inrange(h - deltaY, MIN_H, y + h - BOUNDARY_MARGIN),
              });
            }, true)}
          />
          {/* 우상단 */}
          <div
            className="absolute -top-1 -right-1 h-4 w-4 cursor-ne-resize"
            style={{ backgroundColor: show ? '#12121250' : 'transparent' }}
            {...registDragEvent((deltaX, deltaY) => {
              if (!boundaryRef.current) return;

              const boundary = boundaryRef.current.getBoundingClientRect();

              setConfig({
                x,
                y: inrange(y + deltaY, BOUNDARY_MARGIN, y + h - MIN_H),
                w: inrange(w + deltaX, MIN_W, boundary.width - x - BOUNDARY_MARGIN),
                h: inrange(h - deltaY, MIN_H, y + h - BOUNDARY_MARGIN),
              });
            }, true)}
          />
          {/* 좌하단 */}
          <div
            className="absolute -bottom-1 -left-1 h-4 w-4 cursor-ne-resize"
            style={{ backgroundColor: show ? '#12121250' : 'transparent' }}
            {...registDragEvent((deltaX, deltaY) => {
              if (!boundaryRef.current) return;

              const boundary = boundaryRef.current.getBoundingClientRect();

              setConfig({
                x: inrange(x + deltaX, BOUNDARY_MARGIN, x + w - MIN_W),
                y,
                w: inrange(w - deltaX, MIN_W, x + w - BOUNDARY_MARGIN),
                h: inrange(h + deltaY, MIN_H, boundary.height - y - BOUNDARY_MARGIN),
              });
            }, true)}
          />
          {/* 우하단 */}
          <div
            className="absolute -bottom-1 -right-1 h-4 w-4 cursor-se-resize"
            style={{ backgroundColor: show ? '#12121250' : 'transparent' }}
            {...registDragEvent((deltaX, deltaY) => {
              if (!boundaryRef.current) return;

              const boundary = boundaryRef.current.getBoundingClientRect();

              setConfig({
                x,
                y,
                w: inrange(w + deltaX, MIN_W, boundary.width - x - BOUNDARY_MARGIN),
                h: inrange(h + deltaY, MIN_H, boundary.height - y - BOUNDARY_MARGIN),
              });
            }, true)}
          />
          {/* 상단 */}
          <div
            className="absolute -top-0.5 left-3 right-3 h-2 cursor-n-resize"
            style={{ backgroundColor: show ? '#12121250' : 'transparent' }}
            {...registDragEvent((_, deltaY) => {
              setConfig({
                x,
                y: inrange(y + deltaY, BOUNDARY_MARGIN, y + h - MIN_H),
                w,
                h: inrange(h - deltaY, MIN_H, y + h - BOUNDARY_MARGIN),
              });
            }, true)}
          />
          {/* 하단 */}
          <div
            className="absolute -bottom-0.5 left-3 right-3 h-2 cursor-s-resize"
            style={{ backgroundColor: show ? '#12121250' : 'transparent' }}
            {...registDragEvent((_, deltaY) => {
              if (!boundaryRef.current) return;

              const boundary = boundaryRef.current.getBoundingClientRect();

              setConfig({
                x,
                y,
                w,
                h: inrange(h + deltaY, MIN_H, boundary.height - y - BOUNDARY_MARGIN),
              });
            }, true)}
          />
          {/* 우측 */}
          <div
            className="absolute bottom-3 top-3 -right-0.5 w-2 cursor-e-resize"
            style={{ backgroundColor: show ? '#12121250' : 'transparent' }}
            {...registDragEvent((deltaX) => {
              if (!boundaryRef.current) return;

              const boundary = boundaryRef.current.getBoundingClientRect();

              setConfig({
                x,
                y,
                w: inrange(w + deltaX, MIN_W, boundary.width - x - BOUNDARY_MARGIN),
                h,
              });
            }, true)}
          />
          {/* 좌측 */}
          <div
            className="absolute bottom-3 top-3 -left-0.5 w-2 cursor-w-resize"
            style={{ backgroundColor: show ? '#12121250' : 'transparent' }}
            {...registDragEvent((deltaX) => {
              setConfig({
                x: inrange(x + deltaX, BOUNDARY_MARGIN, x + w - MIN_W),
                y,
                w: inrange(w - deltaX, MIN_W, x + w - BOUNDARY_MARGIN),
                h,
              });
            }, true)}
          />
        </div>
      </Boundary>
    </div>
  );
}

const Box = () => (
  <div className="absolute h-full w-full cursor-move rounded-xl bg-white shadow-xl ring-1 ring-gray-100 transition-[shadow,transform] active:scale-[0.97] active:shadow-lg" />
);
