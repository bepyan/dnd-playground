import DomExample from '@/components/DomExample';
import DragBouceExample from '@/components/DragBouceExample';
import DragExample from '@/components/DragExample';
import DragSizeCenterExample from '@/components/DragSizeCenterExample';
import DragSizeExample from '@/components/DragSizeExample';

export default function HomePage() {
  return (
    <div className="mx-auto max-w-4xl">
      <DomExample />
      <DragExample />
      <DragBouceExample />
      <DragSizeCenterExample />
      <DragSizeExample />
    </div>
  );
}
