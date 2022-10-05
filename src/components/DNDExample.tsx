import { TItems, TItemType } from '@/pages/dnd';
import { $ } from '@/utils';
import { useEffect } from 'react';

export default function DNDExample({
  items,
  setItems,
}: {
  items: TItems;
  setItems: (items: TItems) => void;
}) {
  useEffect(() => {
    document.addEventListener('mousedown', (e) => {
      const target = e.target as HTMLElement;
      const item = target?.closest('.dnd-item');
      if (!item) return;

      const itemRect = item.getBoundingClientRect();

      const ghostItem = item.cloneNode(true) as HTMLElement;
      ghostItem.style.position = 'fixed';
      ghostItem.style.top = `${itemRect.top}px`;
      ghostItem.style.left = `${itemRect.left}px`;
      ghostItem.style.width = `${itemRect.width}px`;
      ghostItem.style.height = `${itemRect.height}px`;
      ghostItem.classList.add('ghost');
      item.classList.add('placeholder');

      setTimeout(() => {
        ghostItem.style.opacity = '0.95';
        ghostItem.style.boxShadow = '0 30px 60px rgba(0, 0, 0, .3)';
        ghostItem.style.transform = 'scale(1.05)';
      }, 0);

      document.querySelector('#__next')?.appendChild(ghostItem);

      const moveHandler = (moveEvent: MouseEvent) => {
        const deltaX = moveEvent.pageX - e.pageX;
        const deltaY = moveEvent.pageY - e.pageY;

        ghostItem.style.top = `${itemRect.top + deltaY}px`;
        ghostItem.style.left = `${itemRect.left + deltaX}px`;
      };

      document.addEventListener('mousemove', moveHandler);
      document.addEventListener(
        'mouseup',
        () => {
          document.removeEventListener('mousemove', moveHandler);
          ghostItem.remove();
          item.classList.remove('placeholder');
        },
        { once: true },
      );
    });
  }, []);

  return (
    <div className="p-4">
      <div className="mb-2">
        <h1 className="text-3xl font-bold">Drag and Drop</h1>
        <span>with Todo</span>
      </div>

      <div className="mt-4 flex">
        <div className="grid flex-1 select-none grid-cols-2 gap-4 rounded-lg">
          {Object.keys(items).map((key) => (
            <div
              key={key}
              className={$(
                'flex flex-col gap-3 rounded-xl bg-gray-200 p-4 ring-1 ring-gray-300 dark:bg-[#000000]',
              )}
            >
              <span className="text-xs font-semibold">{key.toLocaleUpperCase()}</span>
              {items[key as TItemType].map((item, index) => (
                <div key={item.id} className="dnd-item">
                  <h5 className="font-semibold">{item.title}</h5>
                  <span className="text-sm text-gray-500">Make the world beatiful</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
