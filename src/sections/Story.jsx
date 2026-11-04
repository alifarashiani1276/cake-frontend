import { useEffect, useRef } from "react";
import { STORY } from "../data/site";
import Logo from "../components/layout/Logo";

// کلمه‌ها با پیشرفت اسکرول یکی‌یکی روشن می‌شوند
export default function Story() {
  const sec = useRef(null);
  const spans = useRef([]);
  const words = STORY.text.split(" ");

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const on = () => {
      const r = sec.current.getBoundingClientRect();
      const p = reduced ? 1 : Math.min(1, Math.max(0, -r.top / (r.height - window.innerHeight)));
      const lit = p * (words.length + 4);
      spans.current.forEach((el, i) => el && (el.style.opacity = 0.14 + 0.86 * Math.min(1, Math.max(0, lit - i))));
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); };
  }, [words.length]);

  return (
    <section id="story" ref={sec} data-tone="dark" data-color="#EAD7AD" className="relative h-[240svh] bg-linen text-ink">
      <div className="sticky top-0 flex h-svh items-center overflow-hidden">
        <Logo kind="fa" width="min(95vw,900px)" className="pointer-events-none absolute -bottom-[12%] -start-[8%] text-navy/[.05]" />
        <span className="absolute end-6 top-24 flex items-center gap-3 text-sm font-bold text-teal-dark md:end-10">داستان ما<span className="h-px w-10 bg-teal-dark" /></span>
        <p className="mx-auto m-0 max-w-5xl px-6 text-balance text-[clamp(2rem,5vw,4.6rem)] font-black leading-[1.5] tracking-tight md:px-10">
          {words.map((w, i) => (
            <span key={i} ref={(el) => (spans.current[i] = el)} className="inline-block opacity-[.14] transition-opacity duration-150 [margin-inline-end:.3em]">
              {w}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
