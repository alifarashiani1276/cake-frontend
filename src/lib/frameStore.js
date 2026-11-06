// مدیریت فریم‌ها: همهٔ فایل‌ها (فشرده) بارگذاری می‌شوند، اما فقط تعدادی از آن‌ها
// هم‌زمان به ImageBitmap رمزگشایی می‌شوند تا حافظه (به‌خصوص روی موبایل) پر نشود.
// رمزگشایی‌ها در صف‌اند و حداکثر MAX_DECODE تا هم‌زمان اجرا می‌شود (پیش‌تر تا ۲۴ تا هم‌زمان بود
// و در اسکرول سریع، موبایل را قفل می‌کرد).
const MAX_DECODE = 2;

// window: فریم‌های اطراف که همیشه آماده‌اند، keep: فاصلهٔ نگه‌داری، sparse: هر چند فریم یک‌بار برای پرش‌های سریع
export function createFrameStore({ count, urlOf, onProgress, concurrency = 6, window: WINDOW = 8, keep: KEEP = 10, sparse: SPARSE = 24 }) {
  const blobs = new Array(count).fill(null);
  const bitmaps = new Map();
  const pending = new Set();
  const forced = []; // فریم‌های پراکنده که باید حتماً رمزگشایی شوند (اولویت اول)
  let wantedList = []; // فریم‌های اطراف جای فعلی، مرتب از نزدیک به دور
  let active = 0;
  let loaded = 0;
  let disposed = false;
  const listeners = new Set();

  const notify = () => listeners.forEach((fn) => fn());
  const isSparse = (i) => i % SPARSE === 0 || i === count - 1;

  async function decodeOne(i) {
    pending.add(i);
    active++;
    try {
      const bmp = await createImageBitmap(blobs[i]);
      if (disposed) { bmp.close(); return; }
      bitmaps.set(i, bmp);
      notify();
    } catch (e) {
      console.warn("decode failed", i, e);
    } finally {
      pending.delete(i);
      active--;
      pump();
    }
  }

  // تا وقتی ظرفیت هست، نزدیک‌ترین فریمِ دانلودشده‌ای که هنوز رمزگشایی نشده شروع می‌شود
  function pump() {
    while (!disposed && active < MAX_DECODE) {
      const ok = (k) => blobs[k] && !bitmaps.has(k) && !pending.has(k);
      let i = forced.find(ok);
      if (i === undefined) i = wantedList.find(ok);
      if (i === undefined) return;
      decodeOne(i);
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
          if (isSparse(i)) forced.push(i);
          pump();
        } catch (e) {
          store.error = e;
        }
        loaded++;
        onProgress?.(loaded / count);
        notify();
      }
    }
    await Promise.all(Array.from({ length: concurrency }, worker));
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

  // اطراف فریم فعلی را آماده و بقیه را آزاد می‌کند.
  // جهت اسکرول مهم است: جلوتر از فریم فعلی دو برابر بیشتر آماده می‌شود و از نزدیک‌ترین فریم شروع می‌کند.
  // اگر جای فریم و جهت عوض نشده باشد کاری نمی‌کند (این تابع در هر کادر صدا زده می‌شود).
  let lastI = -1, lastDir = 0;
  function focus(i, dir = 1) {
    if (i === lastI && dir === lastDir) return;
    lastI = i; lastDir = dir;
    const fwd = dir >= 0 ? WINDOW * 2 : WINDOW;
    const back = dir >= 0 ? WINDOW : WINDOW * 2;
    const wanted = [];
    for (let k = i - back; k <= i + fwd; k++) if (k >= 0 && k < count) wanted.push(k);
    wanted.sort((a, b) => Math.abs(a - i) - Math.abs(b - i));
    wantedList = wanted;
    for (const [k, bmp] of bitmaps) {
      const near = k >= i - back - 4 && k <= i + fwd + 4;
      if (!near && !isSparse(k)) { bmp.close(); bitmaps.delete(k); }
    }
    pump();
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
