// مدیریت فریم‌ها: همهٔ فایل‌ها (فشرده) بارگذاری می‌شوند، اما فقط تعدادی از آن‌ها
// هم‌زمان به ImageBitmap رمزگشایی می‌شوند تا حافظه (به‌خصوص روی موبایل) پر نشود.
const CONCURRENCY = 6;

// window: فریم‌های اطراف که همیشه آماده‌اند، keep: فاصلهٔ نگه‌داری، sparse: هر چند فریم یک‌بار برای پرش‌های سریع
export function createFrameStore({ count, urlOf, onProgress, window: WINDOW = 8, keep: KEEP = 10, sparse: SPARSE = 24 }) {
  const blobs = new Array(count).fill(null);
  const bitmaps = new Map();
  const pending = new Set();
  let loaded = 0;
  let disposed = false;
  const listeners = new Set();

  const notify = () => listeners.forEach((fn) => fn());

  async function decode(i) {
    if (disposed || bitmaps.has(i) || pending.has(i) || !blobs[i]) return;
    pending.add(i);
    try {
      const bmp = await createImageBitmap(blobs[i]);
      if (disposed) return bmp.close();
      bitmaps.set(i, bmp);
      notify();
    } catch (e) {
      console.warn("decode failed", i, e);
    } finally {
      pending.delete(i);
    }
  }

  // ترتیب بارگذاری: فریم اول، سپس فریم‌های پراکنده، سپس هر ۴ فریم، سپس بقیه
  function loadOrder() {
    const seen = new Set();
    const order = [];
    const add = (i) => { if (i < count && !seen.has(i)) { seen.add(i); order.push(i); } };
    add(0);
    for (let i = 0; i < count; i += SPARSE) add(i);
    add(count - 1);
    for (let i = 0; i < count; i += 4) add(i);
    for (let i = 0; i < count; i++) add(i);
    return order;
  }

  async function fetchAll() {
    const queue = loadOrder();
    let next = 0;
    async function worker() {
      while (!disposed && next < queue.length) {
        const i = queue[next++];
        try {
          const res = await fetch(urlOf(i));
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          blobs[i] = await res.blob();
          if (i % SPARSE === 0 || i === 0 || i === count - 1) await decode(i);
        } catch (e) {
          store.error = e;
        }
        loaded++;
        onProgress?.(loaded / count);
        notify();
      }
    }
    await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  }

  // نزدیک‌ترین فریم آماده به فریم موردنظر (برای رسم بدون پرش)
  // maxGap: بیشینهٔ فاصلهٔ مجاز؛ اگر فریم آماده‌ای نزدیک‌تر از آن نبود null برمی‌گردد
  function nearest(i, maxGap = count) {
    if (bitmaps.has(i)) return { index: i, bitmap: bitmaps.get(i) };
    for (let d = 1; d <= maxGap && d < count; d++) {
      const a = i - d, b = i + d;
      if (a >= 0 && bitmaps.has(a)) return { index: a, bitmap: bitmaps.get(a) };
      if (b < count && bitmaps.has(b)) return { index: b, bitmap: bitmaps.get(b) };
    }
    return null;
  }

  // اطراف فریم فعلی را رمزگشایی و بقیه را آزاد می‌کند.
  // جهت اسکرول مهم است: جلوتر از فریم فعلی دو برابر بیشتر آماده می‌شود و از نزدیک‌ترین فریم شروع می‌کند.
  function focus(i, dir = 1) {
    const fwd = dir >= 0 ? WINDOW * 2 : WINDOW;
    const back = dir >= 0 ? WINDOW : WINDOW * 2;
    const wanted = [];
    for (let k = i - back; k <= i + fwd; k++) if (k >= 0 && k < count) wanted.push(k);
    wanted.sort((a, b) => Math.abs(a - i) - Math.abs(b - i));
    wanted.forEach(decode);
    for (const [k, bmp] of bitmaps) {
      const near = k >= i - back - 4 && k <= i + fwd + 4;
      if (!near && k % SPARSE !== 0 && k !== count - 1) { bmp.close(); bitmaps.delete(k); }
    }
  }

  const store = {
    error: null,
    start: fetchAll,
    nearest,
    focus,
    subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    dispose() {
      disposed = true;
      bitmaps.forEach((b) => b.close());
      bitmaps.clear();
      listeners.clear();
    },
  };
  return store;
}
