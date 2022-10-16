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
    const item = startEvent.target as HTMLElement;

    if (
      !item.classList.contains('dnd-item')
      // item.classList.contains('ghost') ||
      // item.classList.contains('placeholder')
    ) {
      return;
    }

    const itemRect = item.getBoundingClientRect();
    const itemOriginIndex = Number(item.dataset.index);

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
      // if (moveEvent.cancelable) moveEvent.preventDefault();

      //--- Ghost Drag
      const { deltaX, deltaY } = getDelta(startEvent, moveEvent);
      ghostItem.style.top = `${itemRect.top + deltaY}px`;
      ghostItem.style.left = `${itemRect.left + deltaX}px`;
      //--- Ghost Drag END

      // if() return;

      //--- Drop 영역 확인
      const ghostItemRect = ghostItem.getBoundingClientRect();
      const ghostCenterX = ghostItemRect.left + ghostItemRect.width / 2;
      const ghostCenterY = ghostItemRect.top + ghostItemRect.height / 2;

      const dropItem = document
        .elementFromPoint(ghostCenterX, ghostCenterY)
        ?.closest<HTMLElement>('.dnd-item');

      if (!dropItem || dropItem.isSameNode(item)) return;

      document.querySelectorAll<HTMLElement>('.dnd-item:not(.ghost)').forEach((item) => {
        item.style.transition = 'all 200ms ease';
      });

      // 같은 보드에 있다면
      const targetIndex = Number(dropItem.dataset.index);
      const itemIndex = Number(item.dataset.index);
      const ITEM_MARGIN = 12;
      const distance = itemRect.height + ITEM_MARGIN;
      item.style.transform = `translate3d(0, ${targetIndex - itemIndex * distance}px, 0)`;

      console.log('item', itemIndex, targetIndex);

      // 위에서 아래로 간다면
      if (itemIndex < targetIndex) {
        let upTarget = dropItem;
        while (
          upTarget &&
          upTarget.classList.contains('dnd-item') &&
          !upTarget.classList.contains('placeholder')
        ) {
          upTarget.dataset.index = Number(upTarget.dataset.index) - 1 + '';
          upTarget.style.transform = `translate3d(0, ${-distance}px, 0)`;
          upTarget = upTarget.previousElementSibling as HTMLElement;
        }
      } else {
        // let downTarget = dropItem;
        // while (
        //   downTarget &&
        //   downTarget.classList.contains('dnd-item') &&
        //   !downTarget.classList.contains('placeholder')
        // ) {
        //   downTarget.dataset.index = itemIndex + 1 + '';
        //   downTarget.style.transform = `translate3d(0, ${-distance}px, 0)`;
        //   downTarget = downTarget.nextElementSibling as HTMLElement;
        // }
      }

      // item.dataset.index = targetIndex + '';

      //--- Drop 영역 END
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

      ghostItem.addEventListener(
        'transitionend',
        () => {
          document.querySelectorAll('.dnd-item').forEach((item) => {
            item.removeAttribute('style');
          });

          ghostItem.remove();
          // Ghost 제자리 복귀 END

          // onDrop({
          //   source: {
          //     droppableId: 'todo',
          //     index: itemIndex,
          //   },
          //   destination: {
          //     droppableId: 'todo',
          //     index: 1,
          //   },
          // });
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
