/* eslint-disable @next/next/no-img-element */
import { inrange } from '@/utils';
import registDragEvent from '@/utils/registDragEvent2';
import { useState } from 'react';
import useCarouselSize from './useCarouselSize';

const imageList = [
  'https://blog.kakaocdn.net/dn/dpxiAT/btqUBv6Fvpn/E8xUMncq7AVuDeOim0LrMk/img.jpg',
  'https://blog.kakaocdn.net/dn/BGT7X/btqUzvTqi5h/flp39GdJH0GU6mo7cTbbhk/img.jpg',
  'https://blog.kakaocdn.net/dn/bWnmfv/btqUBwqZvwA/3CiXGt3SR0TXoOveRJxV91/img.jpg',
  'https://blog.kakaocdn.net/dn/XsLCO/btqUL8PQLwp/NZWCU2jAYKkKSXwcohBKTK/img.jpg',
  'https://blog.kakaocdn.net/dn/bG3iVL/btqUvCZPaRL/ofIjkNWJP1mj2bOG9fie51/img.jpg',
];

export default function CarouselExample() {
  const [hide, setHide] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [transX, setTransX] = useState(0);

  const { ref, width, height } = useCarouselSize();

  return (
    <>
      <div className="p-4">
        <div className="mb-2 whitespace-nowrap">
          <h1 className="text-3xl font-bold">Carousel</h1>
          <span>slide width darg</span>
          <span className="ml-4">current index {currentIndex}</span>
          <span className="ml-4">transX {transX}</span>

          <div className="flex items-center gap-1">
            <label htmlFor="hide">hide overflow</label>
            <input id="hide" type="checkbox" checked={hide} onChange={() => setHide(!hide)} />
          </div>
        </div>
      </div>

      <div
        ref={ref}
        className="w-full max-w-lg"
        style={{
          height,
          overflow: hide ? 'hidden' : 'visible',
        }}
      >
        <div
          className="flex"
          style={{
            transform: `translateX(${-currentIndex * width + transX}px)`,
            transition: `transform ${transX ? 0 : 300}ms ease-in-out 0s`,
          }}
          {...registDragEvent({
            onDragChange: (deltaX) => {
              setTransX(inrange(deltaX, -width, width));
            },
            onDragEnd: (deltaX) => {
              const maxIndex = imageList.length - 1;

              if (deltaX < -100) setCurrentIndex(inrange(currentIndex + 1, 0, maxIndex));
              if (deltaX > 100) setCurrentIndex(inrange(currentIndex - 1, 0, maxIndex));

              setTransX(0);
            },
          })}
        >
          {imageList.map((url, i) => (
            <div key={i} className="flex-shrink-0">
              <img draggable={false} src={url} alt="img" width={width} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
