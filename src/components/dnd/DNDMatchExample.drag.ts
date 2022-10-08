export const registDND = (
  onDrop: (props: { source: string; destination: string; isCorrect: boolean }) => void,
) => {
  const startEvent = (startEvent: MouseEvent) => {
    const item = startEvent.target as HTMLElement;
    if (
      !item.classList.contains('dnd-drag-item') ||
      item.classList.contains('ghost') ||
      item.classList.contains('placeholder')
    ) {
      return;
    }

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
      ghostItem.style.textShadow = '0 30px 60px rgba(0, 0, 0, .2)';
      ghostItem.style.transform = 'scale(1.05)';

      item.classList.add('placeholder');
      item.style.opacity = '0.5';
      item.style.cursor = 'grabbing';
      document.body.style.cursor = 'grabbing';
    }, 0);

    document.body.appendChild(ghostItem);
    // Ghost 만들기 END

    const mouseMoveHandler = (moveEvent: MouseEvent) => {
      // Ghost Drag
      const deltaX = moveEvent.pageX - startEvent.pageX;
      const deltaY = moveEvent.pageY - startEvent.pageY;

      ghostItem.style.top = `${itemRect.top + deltaY}px`;
      ghostItem.style.left = `${itemRect.left + deltaX}px`;

      // Drop 영역 확인
      const ghostItemRect = ghostItem.getBoundingClientRect();
      const ghostCenterX = ghostItemRect.left + ghostItemRect.width / 2;
      const ghostCenterY = ghostItemRect.top + ghostItemRect.height / 2;

      const dropItem = document
        .elementFromPoint(ghostCenterX, ghostCenterY)
        ?.closest<HTMLElement>('.dnd-drop-area');

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
      const dropItem = document.querySelector<HTMLElement>('.dnd-drop-area.active');
      const isCorrect = item.innerText === dropItem?.innerText;

      if (isCorrect) {
        // 이동
        const dropItemRect = dropItem.getBoundingClientRect();
        ghostItem.style.left = `${dropItemRect.left}px`;
        ghostItem.style.top = `${dropItemRect.top}px`;
      } else {
        // 제자리 복귀
        ghostItem.style.left = `${itemRect.left}px`;
        ghostItem.style.top = `${itemRect.top}px`;
      }

      ghostItem.style.transition = 'all 200ms ease';
      ghostItem.style.transform = 'none';
      ghostItem.addEventListener(
        'transitionend',
        () => {
          item.classList.remove('placeholder');
          item.removeAttribute('style');
          document.body.removeAttribute('style');

          if (dropItem) {
            dropItem.classList.remove('active');
            dropItem.removeAttribute('style');

            if (!isCorrect) {
              item.classList.add('shake');
              item.addEventListener(
                'animationend',
                () => {
                  item.classList.remove('shake');
                },
                { once: true },
              );
            } else {
              item.classList.add('opacity-50');
              dropItem.classList.remove('text-white');
              dropItem.classList.add('text-stone-700');
            }
          }

          ghostItem.remove();
          onDrop({
            source: item.innerText,
            destination: dropItem?.innerText ?? '',
            isCorrect,
          });
        },
        { once: true },
      );

      document.removeEventListener('mousemove', mouseMoveHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler, { once: true });
  };

  document.addEventListener('mousedown', startEvent);
  return () => document.removeEventListener('mousedown', startEvent);
};
