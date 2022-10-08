import { useEffect, useMemo, useState } from 'react';
import { DragAlphabet, DropAlphabet } from './Alphabet';
import { registDND } from './DNDMatchExample.drag';

const WORDS = [...Array(26)].map((_, i) => String.fromCharCode(i + 65));

const getRandomWords = (n: number) => {
  return [...WORDS].sort(() => Math.random() - 0.5).slice(0, n);
};

export default function DNDMatchExample() {
  const [words, setWords] = useState<string[]>(getRandomWords(4));
  const dragWords = useMemo(() => [...words].sort(() => Math.random() - 0.5), [words]);

  // CSR
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!ready) {
      setReady(true);
      return;
    }

    const cleanup = registDND();
    return () => cleanup();
  }, [ready]);

  if (!ready) return <></>;

  return (
    <div className="flex flex-col items-center gap-16">
      <div className="flex gap-8">
        {words.map((value) => (
          <DropAlphabet className="dnd-drop-area" key={value} value={value} />
        ))}
      </div>

      <div className="flex gap-8">
        {dragWords.map((value) => (
          <DragAlphabet className="dnd-drag-item" key={value} value={value} />
        ))}
      </div>

      <div>
        <div className="" onClick={() => setWords(getRandomWords(4))}>
          RESET
        </div>
      </div>
    </div>
  );
}
