import { DragAlphabet, DropAlphabet } from './Alphabet';

export default function DNDMatchExample() {
  const dropList = 'DRAG'.split('');
  const alphabetList = 'AGDR'.split('').sort(() => Math.random() - 0.5);

  return (
    <div className="flex flex-col items-center gap-16">
      <div className="flex gap-8">
        {dropList.map((value, index) => (
          <DropAlphabet key={value} value={value} />
        ))}
      </div>

      <div className="flex gap-8">
        {alphabetList.map((value, index) => (
          <DragAlphabet key={value} value={value} />
        ))}
      </div>
    </div>
  );
}
