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

// width 1일 떄 height의 비율
const ASPECT_RADIO = 1;

export default function CarouselInfiniteExample() {
  const [hide, setHide] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [transX, setTransX] = useState(0);
  const [animate, setAnimate] = useState(false);

  const slideList = [imageList.at(-1), ...imageList, imageList.at(0)];

  const { ref: carouselRef, width, height } = useCarouselSize();

  return (
    <>
      <div className="p-4">
        <div className="mb-2 whitespace-nowrap">
          <h1 className="text-3xl font-bold">Infinite Carousel</h1>
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
        ref={carouselRef}
        className="flex w-full max-w-lg"
        style={{
          height,
          overflow: hide ? 'hidden' : 'visible',
        }}
      >
        <div
          className="flex"
          style={{
            transform: `translateX(${-currentIndex * width + transX}px)`,
            transition: `transform ${animate ? 300 : 0}ms ease-in-out 0s`,
          }}
          {...registDragEvent({
            onDragChange: (deltaX) => {
              setTransX(inrange(deltaX, -width + 10, width - 10));
            },
            onDragEnd: (deltaX) => {
              const maxIndex = slideList.length - 1;

              if (deltaX < -100) setCurrentIndex(inrange(currentIndex + 1, 0, maxIndex));
              if (deltaX > 100) setCurrentIndex(inrange(currentIndex - 1, 0, maxIndex));

              setAnimate(true);
              setTransX(0);
            },
          })}
          onTransitionEnd={() => {
            setAnimate(false);

            if (currentIndex === 0) {
              setCurrentIndex(slideList.length - 2);
            } else if (currentIndex === slideList.length - 1) {
              setCurrentIndex(1);
            }
          }}
        >
          {slideList.map((url, i) => (
            <div key={i} className="flex-shrink-0">
              <img draggable={false} src={url} alt="img" width={width} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
