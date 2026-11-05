import { useEffect, useState } from "react";

// عرض و ارتفاع پنجره؛ با تغییر اندازهٔ پنجره به‌روز می‌شود.
// در موبایل با اسکرول، نوار آدرس مرورگر جمع و باز می‌شود و innerHeight چند ده پیکسل تغییر می‌کند؛
// این تغییرهای کوچکِ فقط‌ارتفاع نادیده گرفته می‌شوند تا بخش‌های سنگین هر لحظه دوباره چیده نشوند.
export default function useViewportSize() {
  const read = () => ({ w: window.innerWidth, h: window.innerHeight });
  const [size, setSize] = useState(read);

  useEffect(() => {
    const update = () =>
      setSize((old) => {
        const n = read();
        return n.w === old.w && Math.abs(n.h - old.h) < 140 ? old : n;
      });
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return size;
}
