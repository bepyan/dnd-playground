import React from 'react';

export default function Boundary(props: React.ComponentProps<'div'>) {
  return (
    <div
      {...props}
      className="relative h-64 overflow-hidden rounded bg-gray-50 dark:bg-[#121212]"
    />
  );
}
