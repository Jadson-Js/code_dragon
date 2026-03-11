export default function ListNumber({ number }: { number: number }) {
  return (
    <div className="shrink-0 w-6 h-6 rounded-full bg-primary-1 flex items-center justify-center text-white-1 font-bold text-sm">
      {number}
    </div>
  );
}
