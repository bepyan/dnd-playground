export default function Box(props: React.ComponentProps<'div'>) {
  return (
    <div
      {...props}
      className="absolute h-20 w-20 cursor-move rounded bg-white shadow-lg transition-[transform,shadow] active:scale-95 active:shadow-xl"
    />
  );
}
