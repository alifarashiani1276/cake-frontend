import { useEffect, useRef } from "react";

// وردنهٔ چوبی: خود عکس اصلی است و «همهٔ» اجزایش (بدنه، دو سر و هر دو دسته) دور محور خودش می‌چرخد.
// روش: هر ستون وردنه یک استوانه است (شعاعش از شکل عکس به‌دست می‌آید). برای هر پیکسل، رگهٔ چوب
// از ردیفی از همان ستون برداشته می‌شود که با زاویهٔ چرخش جابه‌جا شده است؛ سایه‌روشن استوانه ثابت می‌ماند.
// عکس فقط نیمی از محیط استوانه را نشان می‌دهد؛ پس بخش امن عکس (بدون لبه‌های تیره) به‌صورت موج مثلثی
// (رفت‌وبرگشتی) دور محیط تکرار می‌شود تا در هیچ زاویه‌ای ردیف تکراری و خط‌های عمودی کشیده پیدا نشود.
// در زاویهٔ صفر دقیقاً همان عکس اصلی دیده می‌شود. Menu.jsx با drawRef.current(theta) زاویه را می‌دهد.
const BASE = import.meta.env.BASE_URL;
export const PIN_W = 2152; // اندازهٔ عکس برش‌خوردهٔ وردنه
export const PIN_H = 272;

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export default function RollingPin({ pinRef, drawRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    // روی موبایل بوم چرخان کوچک‌تر است (تعداد پیکسل‌هایی که هر فریم محاسبه می‌شود حدود ۳ برابر کمتر)
    const mobile = window.innerWidth < 768;
    const SCALE = mobile ? 0.42 : 0.7;
    const MIN_STEP = mobile ? 0.03 : 0.012; // کمترین تغییر زاویه‌ای که ارزش رسم دوباره دارد (رادیان)
    const CW = Math.round(PIN_W * SCALE);
    const CH = Math.round(PIN_H * SCALE);
    const canvas = canvasRef.current;
    canvas.width = CW;
    canvas.height = CH;
    const ctx = canvas.getContext("2d");
    let alive = true;
    let theta = 0;
    let lastTheta = 1e9;
    let ready = null;

    const setup = async () => {
      const [albedo, shade] = await Promise.all([loadImage(`${BASE}brand/pin-albedo.webp`), loadImage(`${BASE}brand/pin-shade.webp`)]);
      if (!alive) return;
      const off = document.createElement("canvas");
      off.width = PIN_W; off.height = PIN_H;
      const octx = off.getContext("2d", { willReadFrequently: true });
      octx.drawImage(albedo, 0, 0);
      const A = octx.getImageData(0, 0, PIN_W, PIN_H).data;

      // بالا و پایین وردنه در هر ستون: از روی آلفای عکس
      const top = new Int16Array(PIN_W).fill(-1);
      const bot = new Int16Array(PIN_W).fill(-1);
      for (let x = 0; x < PIN_W; x++) {
        for (let y = 0; y < PIN_H; y++) if (A[(y * PIN_W + x) * 4 + 3] > 200) { top[x] = y; break; }
        for (let y = PIN_H - 1; y >= 0; y--) if (A[(y * PIN_W + x) * 4 + 3] > 200) { bot[x] = y; break; }
      }

      // سایه‌روشن ثابت (عکس کوچک و نرم) در اندازهٔ بوم
      const sc = document.createElement("canvas");
      sc.width = CW; sc.height = CH;
      const sctx = sc.getContext("2d", { willReadFrequently: true });
      sctx.imageSmoothingQuality = "high";
      sctx.drawImage(shade, 0, 0, CW, CH);
      const S = sctx.getImageData(0, 0, CW, CH).data;

      // جدول‌های ثابت هر پیکسل بوم (فقط یک بار ساخته می‌شود)
      const n = CW * CH;
      const px = new Uint16Array(n);
      const mask = new Uint8Array(n);
      const AS = new Float32Array(n), UM = new Float32Array(n), CY = new Float32Array(n), R = new Float32Array(n);
      const LO = new Float32Array(n), HI = new Float32Array(n);
      const SH = new Float32Array(n * 3);
      for (let y = 0; y < CH; y++) {
        for (let x = 0; x < CW; x++) {
          const i = y * CW + x;
          const xs = Math.min(PIN_W - 1, Math.floor((x + 0.5) / SCALE));
          const ys = (y + 0.5) / SCALE;
          if (top[xs] < 0 || ys < top[xs] + 0.5 || ys > bot[xs] - 0.5) continue;
          const cy = (top[xs] + bot[xs] + 1) / 2;
          const r = (bot[xs] - top[xs] + 1) / 2;
          const t = Math.max(-1, Math.min(1, (ys - cy) / r));
          mask[i] = 1; px[i] = xs; AS[i] = Math.asin(t); CY[i] = cy; R[i] = r;
          // بخش امن عکس در این ستون: ۴ پیکسل کنار لبه (تیره و نیمه‌شفاف) کنار گذاشته می‌شود
          UM[i] = Math.asin(Math.min(0.95, 1 - 4 / Math.max(r, 5)));
          LO[i] = top[xs] + 3; HI[i] = bot[xs] - 4;
          SH[i * 3] = S[i * 4] / 100; SH[i * 3 + 1] = S[i * 4 + 1] / 100; SH[i * 3 + 2] = S[i * 4 + 2] / 100;
        }
      }
      const out = ctx.createImageData(CW, CH);
      const O = out.data;

      ready = (th) => {
        for (let i = 0; i < n; i++) {
          if (!mask[i]) { O[i * 4 + 3] = 0; continue; }
          const xs = px[i];
          const um = UM[i];
          // موج مثلثی: زاویه همیشه داخل بخش امن عکس می‌ماند و بدون پرش رفت‌وبرگشت می‌کند
          let p = (AS[i] + th + um) % (4 * um);
          if (p < 0) p += 4 * um;
          const arc = p < 2 * um ? p - um : 3 * um - p;
          let yf = CY[i] + R[i] * Math.sin(arc) - 0.5;
          if (yf < LO[i]) yf = LO[i]; else if (yf > HI[i]) yf = HI[i];
          // میان‌یابی دوخطی بین دو ردیف مجاور تا رگه‌ها نرم و بدون پله باشند
          const y0 = yf | 0;
          const f = yf - y0;
          const k0 = (y0 * PIN_W + xs) * 4;
          const k1 = k0 + PIN_W * 4;
          const j = i * 3;
          const r = (A[k0] * (1 - f) + A[k1] * f) * SH[j];
          const g = (A[k0 + 1] * (1 - f) + A[k1 + 1] * f) * SH[j + 1];
          const b = (A[k0 + 2] * (1 - f) + A[k1 + 2] * f) * SH[j + 2];
          O[i * 4] = r > 255 ? 255 : r; O[i * 4 + 1] = g > 255 ? 255 : g; O[i * 4 + 2] = b > 255 ? 255 : b; O[i * 4 + 3] = 255;
        }
        ctx.putImageData(out, 0, 0);
      };
      render();
    };

    const render = () => {
      if (!ready || Math.abs(theta - lastTheta) < MIN_STEP) return;
      lastTheta = theta;
      ready(theta);
    };

    setup();
    drawRef.current = (t) => { theta = t; render(); };
    return () => { alive = false; drawRef.current = null; };
  }, [drawRef]);

  return (
    <div
      ref={pinRef}
      dir="ltr"
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-0 z-30"
      style={{ width: "min(98vw, 1250px)", aspectRatio: `${PIN_W} / ${PIN_H}`, transform: "translate(-50%, -50%)" }}
    >
      {/* سایهٔ نرم زیر وردنه روی صفحه */}
      <div className="absolute inset-x-[6%] top-[62%] h-[70%] rounded-full" style={{ background: "radial-gradient(ellipse at center, rgb(70 35 5 / .38), transparent 70%)", filter: "blur(6px)" }} />
      {/* عکس اصلی: تا وقتی چرخش آماده شود و در زاویهٔ صفر دیده می‌شود */}
      <img src={`${BASE}brand/rolling-pin.webp`} alt="" draggable="false" className="absolute inset-0 block h-full w-full" />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
