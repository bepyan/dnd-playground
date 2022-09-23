import React from 'react';

export default function Boundary(props: React.ComponentProps<'div'>) {
  return (
    <div
      {...props}
      className="relative grid h-64 items-center justify-center overflow-hidden rounded-xl bg-gray-50 dark:bg-[#121212]"
    />
  );
}
