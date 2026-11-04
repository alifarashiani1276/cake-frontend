import { CUSTOM, CONTACT } from "../data/site";
import Logo from "../components/layout/Logo";

const STEPS = ["طعم", "اندازه", "طرح"];
const RING = "CUSTOM CAKES • BY KEEKA • MADE BY HAND • ";

// قاب طاق‌دار روی الگوی لوزی‌دار + نشان چرخان
export default function Custom() {
  const src = `${import.meta.env.BASE_URL}cards/caramel-cake`;
  return (
    <section id="custom" data-tone="dark" data-color="#EAD7AD" className="lattice relative overflow-hidden px-5 py-24 text-navy md:px-8 md:py-40">
      <div className="mx-auto grid max-w-6xl items-center gap-16 md:grid-cols-2">
        <div className="reveal relative mx-auto w-full max-w-md md:max-w-lg">
          <div className="rounded-t-[999px] border-[3px] border-teal bg-cream p-3 shadow-[0_40px_70px_-34px_rgb(31_42_68/.6)]">
            <img
              src={`${src}-sm.webp`}
              srcSet={`${src}-sm.webp 800w, ${src}-lg.webp 1600w`}
              sizes="(min-width: 768px) 512px, 90vw"
              alt="کیک کارامل و فندق"
              loading="lazy"
              decoding="async"
              className="aspect-[3/4] w-full rounded-t-[999px] object-cover"
              style={{ objectPosition: "50% 62%" }}
            />
          </div>
          {/* نشان چرخان */}
          <div className="absolute -bottom-8 -start-4 grid size-32 place-items-center rounded-full bg-navy text-cream shadow-xl md:-start-10 md:size-40">
            <svg viewBox="0 0 120 120" className="spin-slow absolute inset-0 size-full" aria-hidden="true">
              <defs><path id="ring" d="M60 60m-46 0a46 46 0 1 1 92 0a46 46 0 1 1-92 0" /></defs>
              <text fontSize="11" fontWeight="700" letterSpacing="2.2" fill="#E6B85C"><textPath href="#ring">{RING}</textPath></text>
            </svg>
            <Logo kind="fa" height={34} className="relative" />
          </div>
        </div>

        <div className="reveal rounded-[2rem] bg-cream/90 p-8 shadow-[0_30px_60px_-40px_rgb(31_42_68/.5)] backdrop-blur md:p-12" style={{ "--rd": "150ms" }}>
          <p className="m-0 flex items-center gap-3 text-sm font-bold text-teal-dark"><span className="h-px w-10 bg-teal-dark" />{CUSTOM.eyebrow}</p>
          <h2 className="m-0 mt-4 text-[clamp(2.2rem,5vw,4.2rem)] font-black leading-[1.2] tracking-tight">{CUSTOM.heading}</h2>
          <p className="mt-5 text-lg leading-9 text-navy/80">{CUSTOM.text}</p>
          <ol className="m-0 mt-7 flex list-none flex-wrap gap-2.5 p-0">
            {STEPS.map((s, i) => (
              <li key={s} className="flex items-center gap-2 rounded-full border border-navy/20 bg-white/50 py-1.5 pe-4 ps-1.5 text-sm font-black">
                <span className="grid size-7 place-items-center rounded-full bg-navy text-xs text-cream">{(i + 1).toLocaleString("fa-IR")}</span>{s}
              </li>
            ))}
          </ol>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href={CONTACT.messageHref} style={{ "--sweep": "#A74448" }} className="btn-sweep inline-flex items-center gap-2 rounded-full bg-navy px-8 py-3.5 text-base font-black text-cream">
              ثبت سفارش ویژه
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="-scale-x-100" aria-hidden="true"><path d="M4 10h12m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </a>
            <a href="#menu" className="rounded-full border border-navy px-8 py-3.5 text-base font-black transition-colors duration-300 hover:bg-navy hover:text-cream">دیدن کیک‌ها</a>
          </div>
        </div>
      </div>
    </section>
  );
}
