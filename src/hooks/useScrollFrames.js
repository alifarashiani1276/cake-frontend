import { useEffect } from "react";
import { createFrameStore } from "../lib/frameStore";
import { computeLayout } from "../lib/layout";
import { FRAME_COUNT, pickFrameSet, frameUrl, FOCUS_URL, SCROLL_PX_PER_FRAME } from "../data/sequence";

/**
 * منطق انیمیشن، مستقل از رابط کاربری:
 * اسکرول → پیشرفت (۰..۱) → شمارهٔ فریم → رسم روی Canvas.
 * هیچ state ای در React به‌روز نمی‌شود؛ همه‌چیز با ref و requestAnimationFrame است.
 */
export function useScrollFrames({ trackRef, wrapRef, canvasRef, onProgress, onLoad, onReady, onError }) {
  useEffect(() => {
    const track = trackRef.current;
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: false });
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const set = pickFrameSet();
    canvas.width = set.width;   // اندازهٔ رندر = اندازهٔ فریم‌ها؛ اندازهٔ نمایش جدا و با CSS تعیین می‌شود
    canvas.height = set.height;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    let focus = [];
    let target = 0;      // فریم هدف از روی اسکرول
    let current = 0;     // فریم نمایش‌داده‌شده (با میرایی نرم)
    let drawn = -1;
    let dir = 1;         // جهت آخرین اسکرول (۱ پایین، ‎-۱ بالا)
    const MAX_GAP = 2;   // فریم نمایش‌داده‌شده هیچ‌وقت بیشتر از ۲ فریم با فریم دلخواه فاصله ندارد
    const MAX_STEP = 3;  // بیشینهٔ پیشروی در هر کادر؛ مانع از پرش از روی فریم‌ها در اسکرول سریع
    let raf = 0;
    let ready = false;
    let disposed = false;

    const store = createFrameStore({
      count: FRAME_COUNT,
      urlOf: (i) => frameUrl(set, i),
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

    const applyLayout = () => {
      const f = focus[Math.round(current)] ?? 0.5;
      const l = computeLayout(window.innerWidth, window.innerHeight, f);
      Object.assign(wrap.style, {
        width: `${l.width}px`, height: `${l.height}px`,
        left: `${l.left}px`, top: `${l.top}px`,
      });
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
    const kick = () => { if (!raf && ready) raf = requestAnimationFrame(tick); };

    const onScroll = () => {
      const p = readProgress();
      target = p * (FRAME_COUNT - 1);
      onProgress?.(p);
      kick();
    };
    const onResize = () => { applyLayout(); drawn = -1; draw(); onScroll(); };

    // ارتفاع مسیر اسکرول از تعداد فریم‌ها می‌آید
    track.style.height = `calc(280svh + ${FRAME_COUNT * SCROLL_PX_PER_FRAME}px)`;

    fetch(FOCUS_URL).then((r) => r.json()).then((j) => { focus = j; applyLayout(); }).catch(() => {});

    const unsub = store.subscribe(() => {
      if (disposed) return;
      if (!ready && store.nearest(0)) {
        ready = true;
        onReady?.();
        target = readProgress() * (FRAME_COUNT - 1);
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
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      unsub();
      store.dispose();
    };
  }, [trackRef, wrapRef, canvasRef, onProgress, onLoad, onReady, onError]);
}
