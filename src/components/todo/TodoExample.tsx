import { TItems, TItemType } from '@/pages/todo';
import registDocumentDragEvent from '@/utils/registDocumentDragEvent';
import { useEffect } from 'react';

export default function TodoExample({
  items,
  setItems,
}: {
  items: TItems;
  setItems: (items: TItems) => void;
}) {
  useEffect(() => {
    registDocumentDragEvent<{ item: HTMLElement; ghostItem: HTMLElement; itemRect: DOMRect }>({
      onDragStart: ({ e }) => {
        const target = e.target as HTMLElement;
        const item = target?.closest('.dnd-item') as HTMLElement;
        if (!item) return;

        // Drag 에니메이션 적용
        const itemRect = item.getBoundingClientRect();

        const ghostItem = item.cloneNode(true) as HTMLElement;
        ghostItem.style.position = 'fixed';
        ghostItem.style.top = `${itemRect.top}px`;
        ghostItem.style.left = `${itemRect.left}px`;
        ghostItem.style.width = `${itemRect.width}px`;
        ghostItem.style.height = `${itemRect.height}px`;
        ghostItem.style.transition =
          'transform 200ms ease, opacity 200ms ease, boxShadow 200ms ease';
        ghostItem.classList.add('ghost');

        item.classList.add('placeholder');

        setTimeout(() => {
          ghostItem.style.opacity = '0.95';
          ghostItem.style.boxShadow = '0 30px 60px rgba(0, 0, 0, .3)';
          ghostItem.style.transform = 'scale(1.05)';
        }, 0);

        document.body.appendChild(ghostItem);

        return { item, itemRect, ghostItem };
      },
      onDragChange: ({ deltaX, deltaY }, props) => {
        if (!props) return;
        const { ghostItem, item, itemRect } = props;

        // ghost move 로직
        ghostItem.style.top = `${itemRect.top + deltaY}px`;
        ghostItem.style.left = `${itemRect.left + deltaX}px`;

        // placeholder move 로직
        const ghostItemRect = ghostItem.getBoundingClientRect();
        const ghostCenterX = ghostItemRect.left + ghostItemRect.width / 2;
        const ghostCenterY = ghostItemRect.top + ghostItemRect.height / 2;

        const targetItem = document
          .elementFromPoint(ghostCenterX, ghostCenterY)
          ?.closest('.dnd-item') as HTMLElement;

        if (!targetItem || targetItem.isSameNode(item)) {
          return;
        }

        // 다른 보드에 있다면 같은 보드로 이동시켜 준다.

        // 같은 보드에 있다면
        const targetIndex = Number(targetItem.getAttribute('data-index'));
        const itemIndex = Number(item.getAttribute('data-index'));

        let indexDiff = targetIndex - itemIndex;
        const ITEM_MARGIN = 12;
        const distance = item.getBoundingClientRect().height + ITEM_MARGIN;

        // 아래에서 위로 간다면
        if (indexDiff > 0) {
          let upTarget = targetItem as HTMLElement;
          while (
            upTarget &&
            upTarget.classList.contains('dnd-item') &&
            !upTarget.classList.contains('placeholder')
          ) {
            if (!upTarget.style) upTarget.dataset.index = itemIndex + 1 + '';

            upTarget.style.transition = 'all 200ms ease';
            upTarget.style.transform = `translate3d(0, ${-distance}px, 0)`;
            upTarget = upTarget.previousElementSibling as HTMLElement;
          }
        } else {
          let downTarget = targetItem as HTMLElement;
          while (
            downTarget &&
            downTarget.classList.contains('dnd-item') &&
            !downTarget.classList.contains('placeholder')
          ) {
            if (!downTarget.style) downTarget.dataset.index = itemIndex + 1 + '';

            downTarget.style.transition = 'all 200ms ease';
            downTarget.style.transform = `translate3d(0, ${distance}px, 0)`;
            downTarget = downTarget.nextElementSibling as HTMLElement;
          }
        }

        // if (!item.style) item.attributes('data-index', targetIndex + '');

        item.style.transition = 'all 200ms ease';
        item.style.transform = `translate3d(0, ${indexDiff * distance}px, 0)`;
      },
      onDragEnd: ({}, props) => {
        if (!props) return;
        const { ghostItem, item, itemRect } = props;

        // 제자리 복귀
        item.classList.remove('placeholder');

        const ghostItemRect = ghostItem.getBoundingClientRect();
        ghostItem.style.transition = 'all 200ms ease';
        ghostItem.style.left = `${itemRect.left}px`;
        ghostItem.style.top = `${itemRect.top}px`;
        ghostItem.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.15)';
        ghostItem.style.transform = 'none';
        ghostItem.style.opacity = '1';

        const clear = () => {
          ghostItem.remove();
        };

        if (ghostItemRect.left === itemRect.left && ghostItemRect.top === itemRect.top) {
          clear();
        } else {
          ghostItem.addEventListener(
            'transitionend',
            () => {
              clear();
            },
            { once: true },
          );
        }

        // 움직인 아이템들 제자리 복귀
        item.addEventListener(
          'transitionend',
          () => {
            document
              .querySelectorAll('.dnd-item:not(.ghost)')
              .forEach((item) => item.removeAttribute('style'));
          },
          { once: true },
        );
      },
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
              className="flex flex-col gap-3 rounded-xl bg-gray-200 p-4 ring-1 ring-gray-300 dark:bg-[#000000]"
            >
              <span className="text-xs font-semibold">{key.toLocaleUpperCase()}</span>
              {items[key as TItemType].map((item, index) => (
                <div
                  key={item.id}
                  data-index={index}
                  className="dnd-item rounded-lg bg-white p-4 transition-shadow dark:bg-[#121212]"
                >
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
