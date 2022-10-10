import { $ } from '@/utils';

export const DropAlphabet = ({
  isCorrect,
  value,
  ...props
}: { value: string; isCorrect?: boolean } & React.ComponentProps<'div'>) => {
  return (
    <div
      {...props}
      className={$(
        isCorrect ? 'text-stone-700' : 'dnd-drop-area text-white',
        'text-shadow text-7xl font-black drop-shadow-xl will-change-[filter]',
        props.className,
      )}
    >
      {value}
    </div>
  );
};

export const DragAlphabet = ({
  isCorrect,
  value,
  ...props
}: { value: string; isCorrect?: boolean } & React.ComponentProps<'div'>) => {
  return (
    <div
      {...props}
      className={$(
        isCorrect ? 'opacity-50' : 'dnd-drag-item cursor-grab',
        'text-7xl font-black text-stone-700 drop-shadow-xl',
        props.className,
      )}
    >
      {value}
    </div>
  );
};
