import registMouseDownDrag from '@/hooks/useMouseDownDrag';
import { useEffect, useRef, useState } from 'react';
import Boundary from './Boundary';

const minmax = (v: number, min: number, max: number) => {
  if (v < min) return min;
  if (v > max) return max;
  return v;
};

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
  }, []);

  const getBoundaryPosition = () => {
    if (!boundaryRef.current) return;

    const BOUNDARY_MARGIN = 12;
    const boundary = boundaryRef.current.getBoundingClientRect();

    return {
      maxx: boundary.width - w - BOUNDARY_MARGIN,
      minx: BOUNDARY_MARGIN,
      maxy: boundary.height - h - BOUNDARY_MARGIN,
      miny: BOUNDARY_MARGIN,
    };
  };

  return (
    <div className="p-20">
      <div className="mb-2">
        <h1 className="text-3xl font-bold">Drag Size</h1>
        <span>resize the element size with boundary</span>
        <span className="ml-4">
          x:{x} y:{y}
        </span>
        <span className="ml-4">
          w:{w} h:{h}
        </span>
      </div>
      <Boundary ref={boundaryRef}>
        <div
          style={{ width: w, height: h, left: x, top: y }}
          className="relative"
          {...registMouseDownDrag((deltaX, deltaY) => {
            const boundaryPosition = getBoundaryPosition()!;
            if (!boundaryPosition) return;

            const { maxx, maxy, minx, miny } = getBoundaryPosition()!;
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
            className="absolute -bottom-1 -right-1 h-4 w-4 cursor-se-resize rounded-full bg-gray-500 opacity-50 transition-transform active:scale-110"
            {...registMouseDownDrag((deltaX, deltaY) => {
              if (!boundaryRef.current) return;

              const BOUNDARY_MARGIN = 12;
              const boundary = boundaryRef.current.getBoundingClientRect();
              const maxx = boundary.width - BOUNDARY_MARGIN;
              const maxy = boundary.height - BOUNDARY_MARGIN;

              setConfig({
                x,
                y,
                w: Math.min(Math.max(w + deltaX, MIN_W), maxx - x),
                h: Math.min(Math.max(h + deltaY, MIN_H), maxy - y),
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
