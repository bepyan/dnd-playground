import { $ } from '@/utils';

export const DropAlphabet = (props: { value: string } & React.ComponentProps<'div'>) => {
  return (
    <div
      {...props}
      className={$(
        'text-shadow text-9xl font-black text-white drop-shadow-xl transition-all',
        props.className,
      )}
    >
      {props.value}
    </div>
  );
};

export const DragAlphabet = (props: { value: string } & React.ComponentProps<'div'>) => {
  return (
    <div
      {...props}
      className={$(
        'cursor-grab drop-shadow-xl transition-[transform] active:scale-95',
        'text-9xl font-black text-stone-700',
        props.className,
      )}
    >
      {props.value}
    </div>
  );
};
