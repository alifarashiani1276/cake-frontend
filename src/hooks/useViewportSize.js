import { useEffect, useState } from "react";

// عرض و ارتفاع پنجره؛ با تغییر اندازهٔ پنجره به‌روز می‌شود
export default function useViewportSize() {
  const read = () => ({ w: window.innerWidth, h: window.innerHeight });
  const [size, setSize] = useState(read);

  useEffect(() => {
    const update = () => setSize(read());
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return size;
}
