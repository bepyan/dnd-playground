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

export type onDropEvent = {
  source: any;
  destination?: any;
};

export default function registDND(onDrop: (event: onDropEvent) => void) {
  const startHandler = (startEvent: MouseEvent | TouchEvent) => {
    const item = startEvent.target as HTMLElement;
    if (
      !item.classList.contains('dnd-drag-item') ||
      item.classList.contains('ghost') ||
      item.classList.contains('placeholder')
    ) {
      return;
    }

    const itemRect = item.getBoundingClientRect();

    // Ghost 만들기
    const ghostItem = item.cloneNode(true) as HTMLElement;
    ghostItem.classList.add('ghost');
    ghostItem.style.position = 'fixed';
    ghostItem.style.top = `${itemRect.top}px`;
    ghostItem.style.left = `${itemRect.left}px`;
    ghostItem.style.pointerEvents = 'none';
    ghostItem.style.textShadow = '0 30px 60px rgba(0, 0, 0, .2)';
    ghostItem.style.transform = 'scale(1.05)';
    ghostItem.style.transition = 'transform 200ms ease';

    item.classList.add('placeholder');
    item.style.opacity = '0.5';
    item.style.cursor = 'grabbing';
    document.body.style.cursor = 'grabbing';

    document.body.appendChild(ghostItem);
    // Ghost 만들기 END

    const moveHandler = (moveEvent: MouseEvent | TouchEvent) => {
      if (moveEvent.cancelable) moveEvent.preventDefault();

      // Ghost Drag
      const { deltaX, deltaY } = getDelta(startEvent, moveEvent);
      ghostItem.style.top = `${itemRect.top + deltaY}px`;
      ghostItem.style.left = `${itemRect.left + deltaX}px`;
      // Ghost Drag END

      // Drop 영역 확인
      const ghostItemRect = ghostItem.getBoundingClientRect();
      const ghostCenterX = ghostItemRect.left + ghostItemRect.width / 2;
      const ghostCenterY = ghostItemRect.top + ghostItemRect.height / 2;

      const dropItem = document
        .elementFromPoint(ghostCenterX, ghostCenterY)
        ?.closest<HTMLElement>('.dnd-drop-area');

      if (dropItem) {
        dropItem.classList.add('active');
        dropItem.style.filter = 'drop-shadow(16px 16px 16px gray)';
      }
      // Drop 영역 END
    };

    const endHandler = () => {
      const dropItem = document.querySelector<HTMLElement>('.dnd-drop-area.active');

      // Ghost 제자리 복귀
      ghostItem.style.left = `${itemRect.left}px`;
      ghostItem.style.top = `${itemRect.top}px`;
      ghostItem.style.transition = 'all 200ms ease';
      ghostItem.style.transform = 'none';

      ghostItem.addEventListener(
        'transitionend',
        () => {
          item.classList.remove('placeholder');
          item.removeAttribute('style');

          document.body.removeAttribute('style');

          ghostItem.remove();
          // Ghost 제자리 복귀 END

          onDrop({
            source: item,
            destination: dropItem,
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
