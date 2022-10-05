import DNDExample from '@/components/DNDExample';
import DNDLibraryExample from '@/components/DNDLibraryExample';
import { useState } from 'react';

export type TItemType = 'todo' | 'doing';

export type TItem = {
  id: string;
  type: TItemType;
  title: string;
};

export type TItems = {
  [key in TItemType]: TItem[];
};

export default function DNDPage() {
  const [items, setItems] = useState<TItems>({
    todo: [...Array(5)].map((_, i) => ({
      id: `${i}${i}${i}`,
      title: `Title ${i + 1}000`,
      type: 'todo',
    })),
    doing: [],
  });

  return (
    <>
      <DNDLibraryExample items={items} setItems={setItems} />
      <DNDExample items={items} setItems={setItems} />
    </>
  );
}
