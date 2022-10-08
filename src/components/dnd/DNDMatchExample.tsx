import { useEffect, useMemo, useState } from 'react';
import { DragAlphabet, DropAlphabet } from './Alphabet';

const WORDS = [...Array(26)].map((_, i) => String.fromCharCode(i + 65));

const getRandomWords = (n: number) => {
  return [...WORDS].sort(() => Math.random() - 0.5).slice(0, n);
};

export default function DNDMatchExample() {
  const [words, setWords] = useState<string[]>(getRandomWords(4));
  const dragWords = useMemo(() => [...words].sort(() => Math.random() - 0.5), [words]);

  // CSR
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return <></>;

  return (
    <div className="flex flex-col items-center gap-16">
      <div className="flex gap-8">
        {words.map((value, index) => (
          <DropAlphabet className="dnd-drop-area" key={value} value={value} />
        ))}
      </div>

      <div className="flex gap-8">
        {dragWords.map((value, index) => (
          <DragAlphabet
            className="dnd-drag-item"
            key={value}
            value={value}
            onMouseDown={(clickEvent: React.MouseEvent<Element, MouseEvent>) => {
              const item = clickEvent.currentTarget as HTMLElement;
              const itemRect = item.getBoundingClientRect();
              const dropAreaList = document.querySelectorAll<HTMLElement>('.dnd-drop-area');

              // Ghost 만들기
              const ghostItem = item.cloneNode(true) as HTMLElement;
              ghostItem.classList.add('ghost');
              ghostItem.style.position = 'fixed';
              ghostItem.style.top = `${itemRect.top}px`;
              ghostItem.style.left = `${itemRect.left}px`;
              ghostItem.style.transition = 'transform 200ms ease';
              ghostItem.style.pointerEvents = 'none';

              setTimeout(() => {
                ghostItem.style.textShadow = '0 30px 60px rgba(0, 0, 0, .3)';
                ghostItem.style.transform = 'scale(1.05)';

                item.style.opacity = '0.5';
                item.style.cursor = 'grabbing';
                document.body.style.cursor = 'grabbing';
              }, 0);

              document.body.appendChild(ghostItem);

              const mouseMoveHandler = (moveEvent: MouseEvent) => {
                // Ghost Drag
                const deltaX = moveEvent.pageX - clickEvent.pageX;
                const deltaY = moveEvent.pageY - clickEvent.pageY;

                ghostItem.style.top = `${itemRect.top + deltaY}px`;
                ghostItem.style.left = `${itemRect.left + deltaX}px`;

                // Drop 영역 확인
                const ghostItemRect = ghostItem.getBoundingClientRect();
                const ghostCenterX = ghostItemRect.left + ghostItemRect.width / 2;
                const ghostCenterY = ghostItemRect.top + ghostItemRect.height / 2;

                const dropItem = document
                  .elementFromPoint(ghostCenterX, ghostCenterY)
                  ?.closest('.dnd-drop-area') as HTMLElement;

                dropAreaList.forEach((area) => {
                  area.classList.remove('active');
                  area.removeAttribute('style');
                });

                if (dropItem) {
                  dropItem.classList.add('active');
                  dropItem.style.filter = 'drop-shadow(16px 16px 16px gray)';
                }
              };

              const mouseUpHandler = (moveEvent: MouseEvent) => {
                // 제자리 복귀
                ghostItem.style.transition = 'all 200ms ease';
                ghostItem.style.left = `${itemRect.left}px`;
                ghostItem.style.top = `${itemRect.top}px`;
                ghostItem.style.transform = 'none';

                ghostItem.addEventListener(
                  'transitionend',
                  () => {
                    item.removeAttribute('style');
                    document.body.removeAttribute('style');
                    ghostItem.remove();
                  },
                  { once: true },
                );

                document.removeEventListener('mousemove', mouseMoveHandler);
              };

              document.addEventListener('mousemove', mouseMoveHandler);
              document.addEventListener('mouseup', mouseUpHandler, { once: true });
            }}
          />
        ))}
      </div>
    </div>
  );
}
