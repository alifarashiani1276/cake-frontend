// نوار نازک بارگذاری؛ صفحه هیچ‌وقت خالی نیست، چون زمینه همان سیاهی صحنه است
export default function LoadingBar({ barRef, visible }) {
  return (
    <div
      className={`pointer-events-none absolute inset-x-0 bottom-0 h-[2px] transition-opacity duration-700 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div ref={barRef} className="h-full origin-right bg-saffron" style={{ transform: "scaleX(0)" }} />
    </div>
  );
}
