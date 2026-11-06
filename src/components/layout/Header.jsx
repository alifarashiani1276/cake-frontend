import { useEffect, useRef, useState } from "react";
import { BRAND, NAV, CTA } from "../../data/site";
import Logo from "./Logo";
import { subscribeScroll } from "../../lib/scrollBus";

const SHRINK_PX = 160; // با ۱۶۰ پیکسل اسکرول، هدر کامل کوچک می‌شود

export default function Header() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");
  const [tone, setTone] = useState("light"); // light = متن روشن روی زمینهٔ تیره، dark = متن تیره روی زمینهٔ روشن
  const root = useRef(null);

  // کوچک‌شدن هدر مستقیم با اسکرول (--p از ۰ تا ۱)؛ هدر همیشه سرجایش می‌ماند و پس‌زمینه ندارد.
  // خواندن (اندازه‌ها) و نوشتن (استایل) از طریق scrollBus جدا از هم و یک بار در هر فریم انجام می‌شود.
  useEffect(() => {
    let lastColor = "";
    let lastP = "";
    const tones = Array.from(document.querySelectorAll("[data-tone]")); // یک بار؛ بخش‌ها ثابت‌اند
    return subscribeScroll({
      read: () => {
        // آخرین بخشِ دارای data-tone که زیر هدر است تعیین‌کنندهٔ رنگ متن است
        let t = "light", c = null;
        for (const el of tones) {
          const r = el.getBoundingClientRect();
          if (r.top <= 44 && r.bottom > 44) { t = el.dataset.tone; c = el.dataset.color || c; }
        }
        return { p: Math.min(1, window.scrollY / SHRINK_PX).toFixed(3), t, c };
      },
      write: ({ p, t, c }) => {
        if (p !== lastP) { lastP = p; root.current?.style.setProperty("--p", p); }
        setTone(t);
        // زمینهٔ صفحه و رنگ نوار مرورگر (حتی زیر دکمه‌های لمسی گوشی) با بخش فعلی یکی می‌شود
        if (c && c !== lastColor) {
          lastColor = c;
          document.documentElement.style.backgroundColor = c;
          document.querySelector('meta[name="theme-color"]')?.setAttribute("content", c);
        }
      },
    });
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
      {/* بدون پس‌زمینه؛ رنگ متن با بخشی که زیر هدر است عوض می‌شود تا همیشه خوانا بماند */}
      <header ref={root} style={{ "--p": 0 }} className={`pointer-events-none fixed inset-x-0 top-0 z-40 transition-colors duration-500 [--h0:72px] md:[--h0:96px] ${tone === "dark" && !open ? "text-ink" : "text-cream"}`}>
        <div className="pointer-events-auto mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center px-5 md:px-10" style={{ height: "var(--h0)", transform: "translate3d(0, calc(-14px * var(--p)), 0)" }}>
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

          <a href="#hero" className="block origin-center" style={{ transform: "scale(calc(1.3 - .3 * var(--p)))" }} aria-label={`${BRAND} — بالای صفحه`}>
            <Logo kind="latin" height={34} />
          </a>

          <a href={CTA.href} className="hidden justify-self-end rounded-full border border-current/50 px-6 py-2.5 text-[0.88rem] font-bold transition-colors duration-300 hover:bg-current/10 sm:inline-flex">
            {CTA.label}
          </a>
        </div>
      </header>

      <div id="mobile-menu" className={`fixed inset-0 z-30 bg-navy/97 text-cream backdrop-blur-2xl transition-[opacity,visibility] duration-500 md:hidden ${open ? "opacity-100" : "pointer-events-none invisible opacity-0"}`} aria-hidden={!open} inert={!open}>
        <nav aria-label="منوی موبایل" className="flex h-full flex-col justify-center gap-1 px-8 pb-10 pt-28">
          {NAV.map((n, i) => (
            <a key={n.id} href={n.href} onClick={() => setOpen(false)} style={{ transitionDelay: open ? `${120 + i * 80}ms` : "0ms" }}
              className={`py-3 text-6xl font-black tracking-tight transition-all duration-700 ${open ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}>
              {n.label}
            </a>
          ))}
          <a href={CTA.href} onClick={() => setOpen(false)} className="mt-8 w-fit rounded-full bg-cream px-8 py-4 text-lg font-black text-navy">{CTA.label}</a>
        </nav>
      </div>
    </>
  );
}
