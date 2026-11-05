import { useEffect, useRef } from "react";

// آردی که از وردنه می‌ریزد: ذره‌های ریز سفید که کمی می‌افتند، روی صفحه می‌نشینند و آرام محو می‌شوند.
// بوم داخل صحنه است و با آن بالا می‌آید. emitRef.current(count, x0, x1, y) چند ذره از آن بازه می‌ریزد.
const MAX = 520;
const rand = (a, b) => a + Math.random() * (b - a);

export default function FlourDust({ emitRef }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let dpr = 1, w = 0, h = 0, raf = 0, last = 0;
    const parts = [];

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth; h = Math.min(window.innerHeight, 640);
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const tick = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
      last = now;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.age += dt;
        if (p.fallen < p.target) {
          p.vy = Math.min(p.vmax, p.vy + 520 * dt);
          p.vx += (Math.sin(p.age * p.freq + p.ph) * 26 - p.vx) * Math.min(1, 3 * dt);
          p.x += p.vx * dt; p.y += p.vy * dt; p.fallen += p.vy * dt;
        }
        const life = p.age / p.life;
        if (life >= 1) { parts.splice(i, 1); continue; }
        const a = p.a * (p.fallen < p.target ? Math.min(1, p.age * 8) : 1 - life ** 2);
        if (p.puff) {
          const rr = p.r * (1 + life * 1.6);
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, rr);
          g.addColorStop(0, `rgba(255,252,243,${(a * 0.5).toFixed(3)})`);
          g.addColorStop(1, "rgba(255,252,243,0)");
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(p.x, p.y, rr, 0, 6.2832); ctx.fill();
        } else {
          ctx.fillStyle = `rgba(255,253,246,${a.toFixed(3)})`;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill();
        }
      }
      raf = parts.length ? requestAnimationFrame(tick) : 0;
    };

    emitRef.current = (count, x0, x1, y) => {
      for (let i = 0; i < count && parts.length < MAX; i++) {
        const puff = Math.random() < 0.16;
        parts.push({
          x: rand(x0, x1), y: y + rand(-3, 4), vx: rand(-14, 14), vy: rand(10, 50),
          vmax: rand(55, 130), r: puff ? rand(10, 26) : rand(0.9, 3), a: puff ? rand(0.35, 0.6) : rand(0.55, 0.95),
          target: rand(18, 170), fallen: 0, age: 0, life: puff ? rand(1.4, 2.4) : rand(2.2, 5), puff,
          freq: rand(2, 5), ph: rand(0, 6.28),
        });
      }
      if (!raf && parts.length) { last = performance.now(); raf = requestAnimationFrame(tick); }
    };
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(raf); emitRef.current = null; };
  }, [emitRef]);

  return <canvas ref={canvasRef} aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-[5]" style={{ width: "100%", height: "min(100svh, 640px)" }} />;
}
