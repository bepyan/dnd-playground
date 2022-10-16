import { TItems, TItemStatus } from '@/pages/todo';
import { $ } from '@/utils';
import { useEffect, useState } from 'react';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd';

export default function TodoLibraryExample({
  items,
  setItems,
}: {
  items: TItems;
  setItems: (items: TItems) => void;
}) {
  const onDragEnd = ({ source, destination }: DropResult) => {
    if (!destination) return;

    const scourceKey = source.droppableId as TItemStatus;
    const destinationKey = destination.droppableId as TItemStatus;

    const _items = JSON.parse(JSON.stringify(items)) as typeof items;
    const [targetItem] = _items[scourceKey].splice(source.index, 1);
    _items[destinationKey].splice(destination.index, 0, targetItem);
    setItems(_items);
  };

  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));

    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  if (!enabled) {
    return null;
  }

  return (
    <div className="p-4">
      <div className="mb-2">
        <h1 className="text-3xl font-bold">react-beautiful-dnd</h1>
        <span>with react library</span>
      </div>

      <div className="mt-4 flex">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="grid flex-1 select-none grid-cols-2 gap-4 rounded-lg">
            {Object.keys(items).map((key) => (
              <Droppable key={key} droppableId={key}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={$(
                      'flex flex-col gap-3 rounded-xl bg-gray-200 p-4 ring-1 ring-gray-300 transition-shadow dark:bg-[#000000]',
                      snapshot.isDraggingOver ? 'shadow-lg' : 'shadow',
                    )}
                  >
                    <span className="text-xs font-semibold">{key.toLocaleUpperCase()}</span>
                    {items[key as TItemStatus].map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={$(
                              'rounded-lg bg-white p-4 transition-shadow dark:bg-[#121212]',
                              snapshot.isDragging
                                ? 'bg-opacity-90 shadow-2xl shadow-gray-400'
                                : 'shadow',
                            )}
                          >
                            <h5 className="font-semibold">{item.title}</h5>
                            <span className="text-sm text-gray-500">Make the world beatiful</span>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}
