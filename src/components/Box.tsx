import React from 'react';

export default React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(function Box(
  props,
  ref,
) {
  return (
    <div
      {...props}
      ref={ref}
      className="h-24 w-24 cursor-move rounded-xl bg-white shadow-xl ring-1 ring-gray-100 transition-[shadow,transform] active:scale-95 active:shadow-lg"
    />
  );
});
