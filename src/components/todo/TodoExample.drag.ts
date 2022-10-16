const isTouchScreen =
  typeof window !== 'undefined' && window.matchMedia('(hover: none) and (pointer: coarse)').matches;

const startEventName = isTouchScreen ? 'touchstart' : 'mousedown';
const moveEventName = isTouchScreen ? 'touchmove' : 'mousemove';
const endEventName = isTouchScreen ? 'touchend' : 'mouseup';

const getDelta = (startEvent: MouseEvent | TouchEvent, moveEvent: MouseEvent | TouchEvent) => {
  if (isTouchScreen) {
    const se = startEvent as TouchEvent;
    const me = moveEvent as TouchEvent;

    return {
      deltaX: me.touches[0].pageX - se.touches[0].pageX,
      deltaY: me.touches[0].pageY - se.touches[0].pageY,
    };
  }

  const se = startEvent as MouseEvent;
  const me = moveEvent as MouseEvent;

  return {
    deltaX: me.pageX - se.pageX,
    deltaY: me.pageY - se.pageY,
  };
};

export type DropItem = {
  droppableId: string;
  index: number;
};

export type DropEvent = {
  source: DropItem;
  destination?: DropItem;
};

export default function registDND(onDrop: (event: DropEvent) => void) {
  const startHandler = (startEvent: MouseEvent | TouchEvent) => {
    const item = (startEvent.target as HTMLElement).closest<HTMLElement>('.dnd-item');

    if (!item || item.classList.contains('moving')) {
      return;
    }

    const itemRect = item.getBoundingClientRect();

    let destination: HTMLElement | null | undefined;
    let destinationItem: HTMLElement | null | undefined;
    let destinationIndex: number;
    let destinationDroppableId: string;

    const source = item.closest<HTMLElement>('[data-droppable-id]');

    if (!source) return console.warn('Need `data-droppable-id` at dnd-item parent');
    if (!item.dataset.index) return console.warn('Need `data-index` at dnd-item');

    const sourceIndex = Number(item.dataset.index);
    const sourceDroppableId = source.dataset.droppableId!;

    //--- Ghost 만들기
    const ghostItem = item.cloneNode(true) as HTMLElement;
    ghostItem.classList.add('ghost');
    ghostItem.style.position = 'fixed';
    ghostItem.style.top = `${itemRect.top}px`;
    ghostItem.style.left = `${itemRect.left}px`;
    ghostItem.style.width = `${itemRect.width}px`;
    ghostItem.style.height = `${itemRect.height}px`;
    ghostItem.style.pointerEvents = 'none';

    ghostItem.style.opacity = '0.95';
    ghostItem.style.boxShadow = '0 30px 60px rgba(0, 0, 0, .2)';
    ghostItem.style.transform = 'scale(1.05)';
    ghostItem.style.transition = 'transform 200ms ease, opacity 200ms ease, boxShadow 200ms ease';

    item.classList.add('placeholder');
    item.style.cursor = 'grabbing';

    document.body.style.cursor = 'grabbing';
    document.body.appendChild(ghostItem);
    //--- Ghost 만들기 END

    const moveHandler = (moveEvent: MouseEvent | TouchEvent) => {
      if (moveEvent.cancelable) moveEvent.preventDefault();

      //--- Ghost Drag
      const { deltaX, deltaY } = getDelta(startEvent, moveEvent);
      ghostItem.style.top = `${itemRect.top + deltaY}px`;
      ghostItem.style.left = `${itemRect.left + deltaX}px`;
      //--- Ghost Drag END

      //
      //--- Drop 영역 확인
      const ghostItemRect = ghostItem.getBoundingClientRect();

      const targetItem = document
        .elementFromPoint(
          ghostItemRect.left + ghostItemRect.width / 2,
          ghostItemRect.top + ghostItemRect.height / 2,
        )
        ?.closest<HTMLElement>('.dnd-item');

      if (!targetItem || targetItem.isSameNode(item) || item.classList.contains('moving')) {
        return;
      }

      document.querySelectorAll<HTMLElement>('.dnd-item:not(.ghost)').forEach((item) => {
        item.style.transition = 'all 200ms ease';
      });

      destinationItem = targetItem;
      destination = destinationItem.closest<HTMLElement>('[data-droppable-id]');
      if (!destination) return console.warn('Need `data-droppable-id` at dnd-item parent');

      destinationIndex = Number(destinationItem.dataset.index);
      destinationDroppableId = destination.dataset.droppableId + '';

      if (destinationDroppableId !== sourceDroppableId) {
        console.log('on orther board');
      }

      const ITEM_MARGIN = 12;
      const distance = itemRect.height + ITEM_MARGIN;
      const transX = (destinationIndex - sourceIndex) * distance;
      item.style.transform = `translate3d(0, ${transX}px, 0)`;

      item.classList.add('moving');
      item.addEventListener(
        'transitionend',
        () => {
          item.classList.remove('moving');
        },
        { once: true },
      );

      // 위에서 아래로 간다면
      if (sourceIndex < destinationIndex) {
        let upTarget = destinationItem;
        while (
          upTarget &&
          upTarget.classList.contains('dnd-item') &&
          !upTarget.classList.contains('placeholder')
        ) {
          upTarget.style.transform = `translate3d(0, ${-distance}px, 0)`;
          upTarget = upTarget.previousElementSibling as HTMLElement;
        }
      } else {
        let downTarget = destinationItem;
        while (
          downTarget &&
          downTarget.classList.contains('dnd-item') &&
          !downTarget.classList.contains('placeholder')
        ) {
          downTarget.style.transform = `translate3d(0, ${distance}px, 0)`;
          downTarget = downTarget.nextElementSibling as HTMLElement;
        }
      }
      //--- Drop 영역 확인 END
    };

    const endHandler = () => {
      // Ghost 제자리 복귀
      const itemRect = item.getBoundingClientRect();
      ghostItem.style.left = `${itemRect.left}px`;
      ghostItem.style.top = `${itemRect.top}px`;
      ghostItem.style.opacity = '1';
      ghostItem.style.transform = 'none';
      ghostItem.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.15)';
      ghostItem.style.transition = 'all 200ms ease';

      document.body.removeAttribute('style');
      item.classList.remove('placeholder');
      item.classList.add('moving');

      ghostItem.addEventListener(
        'transitionend',
        () => {
          document.querySelectorAll<HTMLElement>('.dnd-item').forEach((item) => {
            item.removeAttribute('style');
          });

          item.classList.remove('moving');

          if (destination && destinationItem) {
            destination.insertBefore(item, destinationItem);
          }

          ghostItem.remove();
          // Ghost 제자리 복귀 END

          onDrop({
            source: {
              droppableId: sourceDroppableId,
              index: sourceIndex,
            },
            destination: destination
              ? {
                  droppableId: destinationDroppableId,
                  index: destinationIndex,
                }
              : undefined,
          });
        },
        { once: true },
      );

      document.removeEventListener(moveEventName, moveHandler);
    };

    document.addEventListener(moveEventName, moveHandler, { passive: false });
    document.addEventListener(endEventName, endHandler, { once: true });
  };

  document.addEventListener(startEventName, startHandler);
  return () => document.removeEventListener(startEventName, startHandler);
}
