import { TItems, TItemStatus } from '@/pages/todo';
import { Dispatch, SetStateAction, useEffect } from 'react';
import registDND from './TodoExample.drag';

export default function TodoExample({
  items,
  setItems,
}: {
  items: TItems;
  setItems: Dispatch<SetStateAction<TItems>>;
}) {
  useEffect(() => {
    const clear = registDND(({ source, destination }) => {
      if (!destination) return;

      const scourceKey = source.droppableId as TItemStatus;
      const destinationKey = destination.droppableId as TItemStatus;

      setItems((items) => {
        const _items = JSON.parse(JSON.stringify(items)) as typeof items;
        const [targetItem] = _items[scourceKey].splice(source.index, 1);
        _items[destinationKey].splice(destination.index, 0, targetItem);
        return _items;
      });
    });
    return () => clear();
  }, [setItems]);

  return (
    <div className="p-4">
      <div className="mb-2">
        <h1 className="text-3xl font-bold">Drag and Drop</h1>
        <span>React with VanillaTS (might have a little bug...)</span>
      </div>

      <div className="mt-4 flex">
        <div className="todo grid flex-1 select-none grid-cols-2 gap-4 rounded-lg">
          {Object.keys(items).map((key) => (
            <div
              key={key}
              data-droppable-id={key}
              className="flex flex-col gap-3 rounded-xl bg-gray-200 p-4 ring-1 ring-gray-300 transition-shadow dark:bg-[#000000]"
            >
              <span className="text-xs font-semibold">{key.toLocaleUpperCase()}</span>
              {items[key as TItemStatus].map((item, index) => (
                <div
                  key={item.id}
                  data-index={index}
                  className="dnd-item rounded-lg bg-white p-4 transition-shadow dark:bg-[#121212]"
                >
                  <h5 className="font-semibold">{item.title}</h5>
                  <span className="text-sm text-gray-500">Make the world beatiful</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
