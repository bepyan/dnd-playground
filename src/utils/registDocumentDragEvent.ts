const isTouchScreen =
  typeof window !== 'undefined' && window.matchMedia('(hover: none) and (pointer: coarse)').matches;

export type TDragEvent = {
  e: Event;
  initX: number;
  initY: number;
  deltaX: number;
  deltaY: number;
};

export default function registDocumentDragEvent<T>({
  onDragStart,
  onDragChange,
  onDragEnd,
}: {
  onDragStart?: (event: TDragEvent) => T | undefined;
  onDragChange?: (event: TDragEvent, props?: T) => void;
  onDragEnd?: (event: TDragEvent, props?: T) => void;
}) {
  if (isTouchScreen) {
    document.addEventListener('touchstart', (touchEvent) => {
      const initX = touchEvent.touches[0].pageX;
      const initY = touchEvent.touches[0].pageY;

      const props = onDragStart?.({
        e: touchEvent,
        initX,
        initY,
        deltaX: 0,
        deltaY: 0,
      });

      const touchMoveHandler = (e: TouchEvent) => {
        onDragChange?.(
          {
            e,
            initX,
            initY,
            deltaX: e.touches[0].pageX - initX,
            deltaY: e.touches[0].pageY - initY,
          },
          props,
        );
      };

      const touchEndHandler = (e: TouchEvent) => {
        onDragEnd?.(
          {
            e,
            initX,
            initY,
            deltaX: e.changedTouches[0].pageX - initX,
            deltaY: e.changedTouches[0].pageY - initY,
          },
          props,
        );
        document.removeEventListener('touchmove', touchMoveHandler);
      };

      document.addEventListener('touchmove', touchMoveHandler);
      document.addEventListener('touchend', touchEndHandler, { once: true });
    });

    return;
  }

  document.addEventListener('mousedown', (clickEvent) => {
    const initX = clickEvent.pageX;
    const initY = clickEvent.pageY;

    const props = onDragStart?.({
      e: clickEvent,
      initX,
      initY,
      deltaX: 0,
      deltaY: 0,
    });

    const mouseMoveHandler = (e: MouseEvent) => {
      onDragChange?.(
        {
          e,
          initX,
          initY,
          deltaX: e.pageX - initX,
          deltaY: e.pageY - initY,
        },
        props,
      );
    };

    const mouseUpHandler = (e: MouseEvent) => {
      onDragEnd?.(
        {
          e,
          initX,
          initY,
          deltaX: e.pageX - initX,
          deltaY: e.pageY - initY,
        },
        props,
      );
      document.removeEventListener('mousemove', mouseMoveHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler, { once: true });
  });
}
