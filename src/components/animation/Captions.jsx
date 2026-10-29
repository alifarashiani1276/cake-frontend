import { useEffect, useImperativeHandle, useRef, forwardRef } from "react";
import { CAPTIONS } from "../../data/captions";

// محو شدن نرم در ابتدا و انتهای هر بازه
const FADE = 0.05;
const opacityAt = (p, { from, to }) => {
  if (p < from || p > to) return 0;
  const fadeIn = Math.min(1, (p - from) / FADE);
  const fadeOut = Math.min(1, (to - p) / FADE);
  return Math.min(fadeIn, fadeOut);
};

// با ref از بیرون صدا زده می‌شود تا هنگام اسکرول، React دوباره رندر نشود
const Captions = forwardRef(function Captions(_, ref) {
  const items = useRef([]);
  const reduced = useRef(false);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useImperativeHandle(ref, () => ({
    update(p) {
      CAPTIONS.forEach((c, i) => {
        const el = items.current[i];
        if (!el) return;
        const o = opacityAt(p, c);
        el.style.opacity = o;
        // جابه‌جایی کوچک فقط اگر کاربر کاهش حرکت نخواسته باشد
        el.style.transform = reduced.current ? "none" : `translateY(${(1 - o) * 10}px)`;
      });
    },
  }));

  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-[15svh] px-7 md:inset-x-auto md:inset-y-0 md:start-[5vw] md:top-0 md:flex md:w-[30vw] md:items-center md:px-0"
      aria-live="polite"
    >
      <div className="relative w-full md:h-40">
        {CAPTIONS.map((c, i) => (
          <div
            key={c.title}
            ref={(el) => (items.current[i] = el)}
            className="absolute inset-x-0 top-0 opacity-0 will-change-[opacity,transform] md:top-1/2 md:-translate-y-1/2"
          >
            <h2 className="m-0 text-[clamp(2.4rem,5.2vw,5rem)] font-black leading-[1.15] tracking-tight text-cream">
              {c.title}
            </h2>
            {c.sub && (
              <p className="mt-3 max-w-[24ch] text-[clamp(1rem,1.5vw,1.25rem)] leading-8 text-ember/90">
                {c.sub}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

export default Captions;
