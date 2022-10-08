import { $ } from '@/utils';

export const DropAlphabet = (props: { value: string } & React.ComponentProps<'div'>) => {
  return (
    <div
      {...props}
      className={$('drop-shadow-xl', 'text-9xl font-black text-white', props.className)}
      style={{
        textShadow: '-1px 0 #ececec, 0 1px #ececec, 1px 0 #ececec, 0 -1px #ececec',
        ...props.style,
      }}
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
        'cursor-move drop-shadow-xl transition-[transform] active:scale-95',
        'text-9xl font-black text-stone-700',
        props.className,
      )}
    >
      {props.value}
    </div>
  );
};
