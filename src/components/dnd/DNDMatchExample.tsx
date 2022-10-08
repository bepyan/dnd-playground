import Confettiful from './Confettiful';
import { useEffect, useMemo, useState } from 'react';
import { DragAlphabet, DropAlphabet } from './Alphabet';
import { registDND } from './DNDMatchExample.drag';
import { $ } from '@/utils';

let cleanConfetti: () => void | undefined;
const WORDS = [...Array(26)].map((_, i) => String.fromCharCode(i + 65));

const getRandomWords = (n: number) => {
  return [...WORDS].sort(() => Math.random() - 0.5).slice(0, n);
};

export default function DNDMatchExample() {
  const [words, setWords] = useState<string[]>(getRandomWords(4));
  const [correctWords, setCorrectWords] = useState<string[]>([]);
  const dragWords = useMemo(() => [...words].sort(() => Math.random() - 0.5), [words]);
  const isClear = useMemo(() => correctWords.length === words.length, [correctWords, words]);

  const reset = () => {
    setWords(getRandomWords(4));
    setCorrectWords([]);
  };

  // CSR
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!ready) {
      setReady(true);
      return;
    }

    const cleanup = registDND(({ destination, isCorrect }) => {
      if (isCorrect) {
        setCorrectWords((list) => [...list, destination]);
      }
    });
    return () => cleanup();
  }, [ready]);

  useEffect(() => {
    if (isClear) {
      cleanConfetti = Confettiful();
    } else {
      cleanConfetti?.();
    }

    return () => {
      cleanConfetti?.();
    };
  }, [isClear]);

  if (!ready) return <></>;

  return (
    <div className="relative mt-16 flex flex-col items-center gap-16">
      <div className={$('flex gap-6', isClear && 'opacity-50')}>
        {words.map((value) => (
          <DropAlphabet isCorrect={correctWords.includes(value)} key={value} value={value} />
        ))}
      </div>

      <div className="flex gap-6">
        {dragWords.map((value) => (
          <DragAlphabet isCorrect={correctWords.includes(value)} key={value} value={value} />
        ))}
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="cursor-pointer" onClick={reset}>
          <svg
            fill="currentcolor"
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 56 56"
          >
            <path d="M 28.8555 26.1836 C 29.9102 26.1836 30.7070 25.3867 30.7070 24.3086 C 30.7070 23.8164 30.5195 23.3477 30.1680 22.9726 L 23.1602 16.0117 C 24.5664 15.7070 26.2070 15.5664 27.9883 15.5664 C 37.3867 15.5664 44.9336 23.0898 44.9336 32.4883 C 44.9336 41.9101 37.3867 49.4570 27.9883 49.4570 C 18.5899 49.4570 11.0664 41.9101 11.0664 32.4883 C 11.0664 31.3633 10.3399 30.5430 9.2383 30.5430 C 8.0899 30.5430 7.2930 31.3633 7.2930 32.4883 C 7.2930 43.9961 16.5039 53.2305 27.9883 53.2305 C 39.4726 53.2305 48.7070 43.9961 48.7070 32.4883 C 48.7070 21.0039 39.4726 11.7930 27.9883 11.7930 C 26.6289 11.7930 25.2695 11.9336 23.9336 12.1679 L 30.1914 6.0274 C 30.5195 5.6523 30.7070 5.1836 30.7070 4.6914 C 30.7070 3.6133 29.9102 2.7695 28.8555 2.7695 C 28.2930 2.7695 27.8242 2.9570 27.4961 3.3320 L 17.8399 13.1289 C 17.4648 13.5039 17.2539 14.0195 17.2539 14.5352 C 17.2539 15.0742 17.4180 15.5430 17.8399 15.9414 L 27.4961 25.6445 C 27.8242 25.9961 28.2695 26.1836 28.8555 26.1836 Z"></path>
          </svg>
        </div>

        {isClear && <div className="font-black uppercase">congraculation</div>}
      </div>

      {isClear && (
        <div
          className="absolute top-16 -rotate-12 cursor-pointer text-8xl font-black uppercase"
          onClick={reset}
        >
          clear
        </div>
      )}
    </div>
  );
}
