import registMouseDownDrag from '@/hooks/useMouseDownDrag';
import { useEffect, useRef, useState } from 'react';
import Boundary from './Boundary';

const minmax = (v: number, min: number, max: number) => {
  if (v < min) return min;
  if (v > max) return max;
  return v;
};

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

  const registResize = (fn: (w: number, h: number) => void) => {
    return registMouseDownDrag((deltaX, deltaY) => {
      if (!boundaryRef.current) return;

      const boundary = boundaryRef.current.getBoundingClientRect();
      const maxx = boundary.width - BOUNDARY_MARGIN;
      const maxy = boundary.height - BOUNDARY_MARGIN;

      const resizew = Math.min(Math.max(w + deltaX, MIN_W), maxx - x);
      const resizeh = Math.min(Math.max(h + deltaY, MIN_H), maxy - y);

      fn(resizew, resizeh);
    }, true);
  };

  return (
    <div className="p-20">
      <div className="mb-2">
        <h1 className="text-3xl font-bold">Drag Size</h1>
        <div>
          <span>resize the element size with boundary</span>
          <span className="ml-4">
            x:{x} y:{y}
          </span>
          <span className="ml-4">
            w:{w} h:{h}
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
          {...registMouseDownDrag((deltaX, deltaY) => {
            if (!boundaryRef.current) return;

            const boundary = boundaryRef.current.getBoundingClientRect();

            const maxx = boundary.width - w - BOUNDARY_MARGIN;
            const minx = BOUNDARY_MARGIN;
            const maxy = boundary.height - h - BOUNDARY_MARGIN;
            const miny = BOUNDARY_MARGIN;

            setConfig({
              x: minmax(x + deltaX, minx, maxx),
              y: minmax(y + deltaY, miny, maxy),
              w,
              h,
            });
          })}
        >
          <Box />
          <div
            className="absolute -bottom-1 -right-1 h-4 w-4 cursor-se-resize"
            style={{ backgroundColor: show ? '#12121250' : 'transparent' }}
            {...registResize((w, h) => {
              setConfig({ x, y, w, h });
            })}
          />
          <div
            className="absolute bottom-3 top-3 -right-0.5 w-2 cursor-e-resize"
            style={{ backgroundColor: show ? '#12121250' : 'transparent' }}
            {...registResize((w) => {
              setConfig({ x, y, w, h });
            })}
          />
          <div
            className="absolute -bottom-0.5 left-3 right-3 h-2 cursor-s-resize"
            style={{ backgroundColor: show ? '#12121250' : 'transparent' }}
            {...registResize((_, h) => {
              setConfig({ x, y, w, h });
            })}
          />
        </div>
      </Boundary>
    </div>
  );
}

const Box = () => (
  <div className="absolute h-full w-full cursor-move rounded-xl bg-white shadow-xl ring-1 ring-gray-100 transition-[shadow,transform] active:scale-[0.97] active:shadow-lg" />
);
