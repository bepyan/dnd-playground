import { TItems, TItemType } from '@/pages/dnd';
import { $ } from '@/utils';

export default function DNDExample({
  items,
  setItems,
}: {
  items: TItems;
  setItems: (items: TItems) => void;
}) {
  return (
    <div className="p-4">
      <div className="mb-2">
        <h1 className="text-3xl font-bold">Drag and Drop</h1>
        <span>with Todo</span>
      </div>

      <div className="mt-4 flex">
        <div className="grid flex-1 select-none grid-cols-2 gap-4 rounded-lg">
          {Object.keys(items).map((key) => (
            <div
              key={key}
              className={$(
                'flex flex-col gap-3 rounded-xl bg-gray-200 p-4 ring-1 ring-gray-300 transition-shadow dark:bg-[#000000]',
              )}
            >
              <span className="text-xs font-semibold">{key.toLocaleUpperCase()}</span>
              {items[key as TItemType].map((item, index) => (
                <div key={item.id} className="cursor-grab">
                  <div
                    className={$(
                      'rounded-lg bg-white p-4 transition-shadow dark:bg-[#121212]',
                      // snapshot.isDragging ? 'bg-opacity-90 shadow-2xl shadow-gray-400' : 'shadow',
                    )}
                  >
                    <h5 className="font-semibold">{item.title}</h5>
                    <span className="text-sm text-gray-500">Make the world beatiful</span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
