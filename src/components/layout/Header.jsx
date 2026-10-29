import { useEffect, useRef, useState } from "react";
import { BRAND, NAV, CTA } from "../../data/site";

function Mark() {
  return (
    <svg width="24" height="24" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="14.5" stroke="currentColor" strokeWidth="1" opacity=".6" />
      <path d="M16 7.5c1.2 3 3.6 4.4 3.6 7.6a3.6 3.6 0 0 1-7.2 0c0-1.7.7-2.8 1.5-3.8.3.9.9 1.4 1.4 1.6-.3-1.7-.4-3.5.7-5.4Z" fill="currentColor" />
      <rect x="14.9" y="19.5" width="2.2" height="5" rx="1" fill="currentColor" opacity=".7" />
    </svg>
  );
}

const SHRINK_PX = 160; // با ۱۶۰ پیکسل اسکرول، هدر کامل کوچک می‌شود

export default function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const root = useRef(null);

  // کوچک‌شدن هدر مستقیم با اسکرول (--p از ۰ تا ۱)؛ هدر همیشه سرجایش می‌ماند و پس‌زمینه ندارد
  useEffect(() => {
    const on = () => root.current?.style.setProperty("--p", Math.min(1, window.scrollY / SHRINK_PX).toFixed(3));
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ["hero", ...NAV.map((n) => n.id)].forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* متن سفید با mix-blend-difference: روی تصویر تیره سفید می‌ماند و روی بخش‌های روشن خودکار تیره می‌شود، پس همیشه خوانا است */}
      <header ref={root} style={{ "--p": 0 }} className="pointer-events-none fixed inset-x-0 top-0 z-40 text-white mix-blend-difference [--h0:72px] md:[--h0:96px]">
        <div className="pointer-events-auto mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-5 md:px-10" style={{ height: "calc(var(--h0) - 28px * var(--p))" }}>
          <div className="justify-self-start">
            <nav aria-label="منوی اصلی" className="hidden items-center gap-9 md:flex">
              {NAV.map((n) => (
                <a key={n.id} href={n.href} aria-current={active === n.id ? "true" : undefined} className="group relative py-2 text-[0.92rem] font-bold opacity-75 transition-opacity hover:opacity-100 aria-[current=true]:opacity-100">
                  {n.label}
                  <span className="absolute inset-x-0 bottom-0 h-px origin-center scale-x-0 bg-current transition-transform duration-500 group-hover:scale-x-100 group-aria-[current=true]:scale-x-100" />
                </a>
              ))}
            </nav>
            <button type="button" className="relative -ms-2 h-11 w-11 md:hidden" aria-label={open ? "بستن منو" : "باز کردن منو"} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((v) => !v)}>
              <span className={`absolute start-3 top-[18px] h-px w-5 bg-current transition-transform duration-300 ${open ? "translate-y-[3px] rotate-45" : ""}`} />
              <span className={`absolute start-3 top-[25px] h-px w-5 bg-current transition-transform duration-300 ${open ? "-translate-y-[4px] -rotate-45" : ""}`} />
            </button>
          </div>

          <a href="#hero" className="flex items-center gap-2.5 text-[1.25rem] font-black tracking-tight" style={{ transform: "scale(calc(1.3 - .3 * var(--p)))" }} aria-label={`${BRAND} — بالای صفحه`}>
            <Mark />
            {BRAND}
          </a>

          <a href={CTA.href} className="hidden justify-self-end rounded-full border border-white/60 px-6 py-2.5 text-[0.88rem] font-bold transition-colors duration-300 hover:bg-white hover:text-black sm:inline-flex">
            {CTA.label}
          </a>
        </div>
      </header>

      <div id="mobile-menu" className={`fixed inset-0 z-30 bg-dusk/95 backdrop-blur-2xl transition-opacity duration-500 md:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`} aria-hidden={!open} inert={!open}>
        <nav aria-label="منوی موبایل" className="flex h-full flex-col justify-center gap-1 px-8 pb-10 pt-28">
          {NAV.map((n, i) => (
            <a key={n.id} href={n.href} onClick={() => setOpen(false)} style={{ transitionDelay: open ? `${120 + i * 80}ms` : "0ms" }}
              className={`py-3 text-6xl font-black tracking-tight transition-all duration-700 ${open ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
              {n.label}
            </a>
          ))}
          <a href={CTA.href} onClick={() => setOpen(false)} className="mt-8 w-fit rounded-full bg-ember px-8 py-4 text-lg font-black text-night">{CTA.label}</a>
        </nav>
      </div>
    </>
  );
}
