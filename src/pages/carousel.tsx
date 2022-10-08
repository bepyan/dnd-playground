import CarouselExample from '@/components/carousel/CarouselExample';
import CarouselInfiniteExample from '@/components/carousel/CarouselInfiniteExample';

export default function CarouselPage() {
  return (
    <>
      <CarouselExample />
      <div className="h-12" />
      <CarouselInfiniteExample />
    </>
  );
}
