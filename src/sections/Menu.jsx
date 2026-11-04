import { useEffect, useRef, useState } from "react";
import { MENU } from "../data/site";

const img = (id, size) => `${import.meta.env.BASE_URL}cards/${id}-${size}.webp`;
const fa = (n) => n.toLocaleString("fa-IR");
const N = MENU.items.length;
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

// کارتوسل سه‌بعدی: کارت‌ها روی یک مدار دایره‌ای می‌چرخند و اسکرول عمودی چرخش را جلو می‌برد.
// کارت وسط بزرگ و روشن است؛ کارت‌های پشتی کوچک‌تر، تیره‌تر و کمی کج‌شده کنارش دیده می‌شوند.
export default function Menu() {
  const stage = useRef(null); // قاب ثابت بخش
  const scr = useRef(null);   // کادر مادرِ کارت‌ها که اسکرول مستقل خودش را دارد
  const [live, setLive] = useState(false);
  const cards = useRef([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    let raf = 0, last = -1;
    const place = () => {
      raf = 0;
      const s = scr.current;
      const p = Math.min(1, Math.max(0, s.scrollTop / Math.max(1, s.scrollHeight - s.clientHeight))); // پیشرفت اسکرول خودِ کادر
      const u = p * (N - 1), k = Math.min(N - 2, Math.floor(u));
      const t = k + smooth(0.2, 0.8, u - k); // هر کارت قبل از رفتن به بعدی کمی در وسط می‌ماند
      const vw = window.innerWidth;
      const Rx = Math.min(560, Math.max(220, vw * 0.62)); // شعاع افقی مدار
      const Rz = Math.min(700, Math.max(380, vw * 0.5));  // عمق مدار
      cards.current.forEach((el, i) => {
        if (!el) return;
        const d = ((((i - t + N / 2) % N) + N) % N) - N / 2; // فاصله از وسط، در بازهٔ [-1.5, 1.5)
        const th = (d * 2 * Math.PI) / N;
        const depth = (1 - Math.cos(th)) / 2; // ۰ جلو، ۱ پشت
        el.style.transform = `translate(-50%,-50%) translate3d(${Math.sin(th) * Rx}px,0,${(Math.cos(th) - 1) * Rz}px) rotateY(${-Math.sin(th) * 52}deg)`;
        el.style.zIndex = String(Math.round(100 + Math.cos(th) * 100));
        el.style.filter = `brightness(${(1 - 0.5 * depth).toFixed(3)})`;
        el.style.pointerEvents = Math.abs(d) < 0.35 ? "auto" : "none";
      });
      const a = Math.round(t) % N;
      if (a !== last) { last = a; setActive(a); }
    };
    const el = scr.current;
    const on = () => { if (!raf) raf = requestAnimationFrame(place); };
    // اسکرول داخلی فقط وقتی فعال می‌شود که قاب کامل جا افتاده باشد؛ وگرنه جلوی اسکرول صفحه را می‌گرفت
    const gate = () => setLive(Math.abs(stage.current.getBoundingClientRect().top) <= 1.5);
    place(); gate();
    el.addEventListener("scroll", on, { passive: true });
    window.addEventListener("scroll", gate, { passive: true });
    window.addEventListener("resize", on);
    return () => { cancelAnimationFrame(raf); el.removeEventListener("scroll", on); window.removeEventListener("scroll", gate); window.removeEventListener("resize", on); };
  }, []);

  return (
    <section data-tone="dark" data-color="#F6EEDC" className="relative z-10 bg-cream text-navy" style={{ height: "calc(100svh + 30svh)" }}>
      <div ref={stage} className="sticky top-0 h-svh overflow-hidden">
        <div ref={scr} className="absolute inset-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" style={{ overflowY: live ? "auto" : "hidden" }}>
          <div style={{ height: "calc(100svh + 320svh)" }}>
            <div className="sticky top-0 h-svh overflow-hidden" style={{ perspective: "1400px", perspectiveOrigin: "50% 45%" }}>
        {MENU.items.map((it, i) => (
          <article
            key={it.id}
            ref={(el) => (cards.current[i] = el)}
            className="absolute left-1/2 overflow-hidden rounded-[2rem] bg-navy will-change-transform shadow-[0_40px_80px_-30px_rgb(31_42_68/.65)]"
            style={{ top: "calc(50% + 24px)", width: "min(74vw, 440px)", height: "min(68svh, 620px)", transform: "translate(-50%,-50%)" }}
          >
            <img
              src={img(it.id, "lg")}
              srcSet={`${img(it.id, "sm")} 800w, ${img(it.id, "lg")} 1600w`}
              sizes="440px"
              alt={it.name}
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: it.pos }}
              draggable="false"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/35 to-transparent" aria-hidden="true" />
            {it.discount && (
              <span className="absolute start-4 top-4 rounded-full bg-saffron px-3.5 py-1 text-sm font-black text-navy">{fa(it.discount)}٪ تخفیف</span>
            )}
            <div className="absolute inset-x-0 bottom-0 p-5 text-cream md:p-6">
              <h3 className="m-0 text-[clamp(1.5rem,3vw,2rem)] font-black leading-tight">{it.name}</h3>
              <p className="mt-1.5 text-sm leading-7 text-cream/85">{it.note}</p>
              <p className="mt-1 text-xs text-cream/75">{it.stock}</p>
              <p className="m-0 mt-3 flex items-baseline gap-2.5">
                {it.oldPrice && <s className="text-sm text-cream/65">{fa(it.oldPrice)}</s>}
                <span className="text-xl font-black">{fa(it.price)} <span className="text-sm font-bold">تومان</span></span>
              </p>
              <button type="button" className="mt-3 w-full rounded-full bg-rouge py-3 text-base font-black text-white transition-colors duration-300 hover:bg-rouge-dark">افزودن به سبد</button>
            </div>
          </article>
        ))}
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-5 z-[300] flex items-center justify-center gap-2" aria-hidden="true">
          {MENU.items.map((it, i) => (
            <span key={it.id} className={`h-1.5 rounded-full transition-all duration-500 ${i === active ? "w-8 bg-navy" : "w-1.5 bg-navy/30"}`} />
          ))}
        </div>
      </div>
    </section>
  );
}
