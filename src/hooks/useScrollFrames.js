import { useEffect } from "react";
import { createFrameStore } from "../lib/frameStore";
import { computeLayout } from "../lib/layout";
import { subscribeScroll, requestScrollFrame } from "../lib/scrollBus";
import { FRAME_COUNT, pickFrameSet, frameUrl, toOriginal, FOCUS_URL, SCROLL_PX_PER_FRAME, TAIL_SVH } from "../data/sequence";

/**
 * منطق انیمیشن، مستقل از رابط کاربری:
 * اسکرول → پیشرفت (۰..۱) → شمارهٔ فریم → رسم روی Canvas.
 * هیچ state ای در React به‌روز نمی‌شود؛ همه‌چیز با ref و requestAnimationFrame است.
 * شمارهٔ فریم‌ها نسبت به فایل‌های همان نسخه است (set.count)؛ طول اسکرول همیشه از FRAME_COUNT می‌آید،
 * پس سرعت و زمان‌بندی انیمیشن در همهٔ نسخه‌ها یکسان است.
 */
export function useScrollFrames({ trackRef, wrapRef, canvasRef, onProgress, onLoad, onReady, onError }) {
  useEffect(() => {
    const track = trackRef.current;
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: false });
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const set = pickFrameSet();
    const LAST = set.count - 1;
    canvas.width = set.width;   // اندازهٔ رندر = اندازهٔ فریم‌ها؛ اندازهٔ نمایش جدا و با CSS تعیین می‌شود
    canvas.height = set.height;

    let focus = [];
    let target = 0;      // فریم هدف از روی اسکرول
    let current = 0;     // فریم نمایش‌داده‌شده (با میرایی نرم)
    let drawn = -1;
    let dir = 1;         // جهت آخرین اسکرول (۱ پایین، ‎-۱ بالا)
    const MAX_GAP = 2;   // فریم نمایش‌داده‌شده هیچ‌وقت بیشتر از ۲ فریم با فریم دلخواه فاصله ندارد
    const MAX_STEP = set.count < FRAME_COUNT ? 2 : 3; // بیشینهٔ پیشروی در هر کادر؛ مانع از پرش از روی فریم‌ها
    let raf = 0;
    let ready = false;
    let disposed = false;

    const store = createFrameStore({
      count: set.count,
      urlOf: (i) => frameUrl(set, i),
      concurrency: set.concurrency,
      window: set.window,
      keep: set.keep,
      sparse: set.sparse,
      onProgress: (p) => onLoad?.(p),
    });

    const readProgress = () => {
      const rect = track.getBoundingClientRect();
      const total = FRAME_COUNT * SCROLL_PX_PER_FRAME; // فقط طول انیمیشن؛ صفحهٔ اضافه برای کشوی بخش بعدی است
      const p = total > 0 ? -rect.top / total : 0;
      return Math.min(1, Math.max(0, p));
    };

    // اندازهٔ قاب فقط وقتی عوض می‌شود نوشته می‌شود؛ جای قاب با transform (بدون چیدمان دوباره)
    let lw = 0, lh = 0, lx = null, ly = null;
    const applyLayout = () => {
      const f = focus[toOriginal(set, Math.round(current))] ?? 0.5;
      const l = computeLayout(window.innerWidth, window.innerHeight, f);
      if (l.width !== lw || l.height !== lh) {
        lw = l.width; lh = l.height;
        wrap.style.width = `${l.width}px`;
        wrap.style.height = `${l.height}px`;
      }
      if (l.left !== lx || l.top !== ly) {
        lx = l.left; ly = l.top;
        wrap.style.transform = `translate3d(${l.left}px, ${l.top}px, 0)`;
      }
    };

    const draw = () => {
      const idx = Math.round(current);
      // تا قبل از اولین رسم هر فریمی قبول است؛ بعد از آن فقط فریم نزدیک.
      // اگر فریم نزدیکِ دقیق هنوز رمزگشایی نشده، همان فریم تیز قبلی می‌ماند (به‌جای فریم دور و کم‌جزئیات)
      const hit = store.nearest(idx, drawn < 0 ? undefined : MAX_GAP);
      if (!hit) return;
      if (hit.index !== drawn) {
        ctx.drawImage(hit.bitmap, 0, 0);
        drawn = hit.index;
        canvas.dataset.frame = String(hit.index);
      }
      if (window.innerWidth < window.innerHeight) applyLayout();
    };

    const tick = () => {
      raf = 0;
      const diff = target - current;
      if (diff !== 0) dir = diff > 0 ? 1 : -1;
      // با کاهش حرکت، بدون میرایی؛ در غیر این‌صورت نزدیک‌شدن نرم به فریم هدف
      if (reduced || Math.abs(diff) < 0.02) current = target;
      else current += Math.max(-MAX_STEP, Math.min(MAX_STEP, diff * 0.18));
      store.focus(Math.round(current), dir);
      draw();
      // اگر فریم دقیق هنوز نرسیده، حلقه ادامه دارد تا به محض آماده‌شدن رسم شود
      if (current !== target || drawn !== Math.round(current)) raf = requestAnimationFrame(tick);
    };
    // وقتی حلقه خاموش است همان لحظه (داخل فریم scrollBus) یک گام اجرا می‌شود تا یک فریم تأخیر نیفتد
    const kick = () => { if (!raf && ready) tick(); };

    const readScroll = () => readProgress();
    const writeScroll = (p) => {
      target = p * LAST;
      onProgress?.(p);
      kick();
    };
    const onResize = () => { lw = lh = 0; lx = ly = null; applyLayout(); drawn = -1; draw(); requestScrollFrame(); };

    // ارتفاع مسیر اسکرول از تعداد فریم‌های منطقی می‌آید (نه تعداد فایل‌ها)
    track.style.height = `calc(${TAIL_SVH}svh + ${FRAME_COUNT * SCROLL_PX_PER_FRAME}px)`;

    fetch(FOCUS_URL).then((r) => r.json()).then((j) => { focus = j; applyLayout(); }).catch(() => {});

    const unsub = store.subscribe(() => {
      if (disposed) return;
      if (!ready && store.nearest(0)) {
        ready = true;
        onReady?.();
        target = readProgress() * LAST;
        current = target;
        applyLayout();
        draw();
        onProgress?.(readProgress());
      }
      if (ready && drawn !== Math.round(current)) { draw(); kick(); } // فریم دقیق‌تر رسید
      if (store.error) onError?.(store.error);
    });

    applyLayout();
    store.start();
    const unsubScroll = subscribeScroll({ read: readScroll, write: writeScroll });
    window.addEventListener("resize", onResize);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      unsubScroll();
      window.removeEventListener("resize", onResize);
      unsub();
      store.dispose();
    };
  }, [trackRef, wrapRef, canvasRef, onProgress, onLoad, onReady, onError]);
}
