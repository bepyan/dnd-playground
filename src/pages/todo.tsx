import TodoExample from '@/components/todo/TodoExample';
import TodoLibraryExample from '@/components/todo/TodoLibraryExample';
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

export default function TodoPage() {
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
      <TodoLibraryExample items={items} setItems={setItems} />
      {/* <TodoExample items={items} setItems={setItems} /> */}
    </>
  );
}
