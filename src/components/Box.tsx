export default function Box(props: React.ComponentProps<'div'>) {
  return (
    <div
      {...props}
      className="absolute h-20 w-20 cursor-move rounded-xl bg-white shadow-xl ring-1 ring-gray-100 transition-[shadow,transform] active:scale-95 active:shadow-lg"
    />
  );
}
