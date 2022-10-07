import CarouselExample from '@/components/CarouselExample';
import CarouselInfiniteExample from '@/components/CarouselInfiniteExample';

export default function CarouselPage() {
  return (
    <>
      <CarouselExample />
      <div className="h-12" />
      <CarouselInfiniteExample />
    </>
  );
}
