// یک شنونده و یک requestAnimationFrame برای کل سایت.
// هر بخش دو تابع می‌دهد: read (فقط خواندن از DOM) و write (فقط نوشتن روی DOM).
// همهٔ readها اول اجرا می‌شوند و بعد همهٔ writeها؛ پس مرورگر در هر فریم فقط یک بار چیدمان را حساب می‌کند
// (پیش‌تر هر بخش جدا می‌نوشت و می‌خواند و چیدمان چندبار اجباری دوباره محاسبه می‌شد).
const subs = new Set();
let raf = 0;
let bound = false;

function frame() {
  raf = 0;
  const list = Array.from(subs);
  const data = list.map((s) => (s.read ? s.read() : undefined));
  list.forEach((s, i) => s.write?.(data[i]));
}

export function requestScrollFrame() {
  if (!raf) raf = requestAnimationFrame(frame);
}

export function subscribeScroll(sub) {
  subs.add(sub);
  if (!bound) {
    window.addEventListener("scroll", requestScrollFrame, { passive: true });
    window.addEventListener("resize", requestScrollFrame);
    bound = true;
  }
  requestScrollFrame();
  return () => {
    subs.delete(sub);
    if (!subs.size && bound) {
      window.removeEventListener("scroll", requestScrollFrame);
      window.removeEventListener("resize", requestScrollFrame);
      bound = false;
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };
}
