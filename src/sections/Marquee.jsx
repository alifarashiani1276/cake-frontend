import { BAND } from "../data/site";

const Star = () => (
  <svg width="26" height="26" viewBox="0 0 26 26" className="mx-8 shrink-0 text-saffron md:mx-12" aria-hidden="true"><path d="M13 0c1 7 6 12 13 13-7 1-12 6-13 13-1-7-6-12-13-13C7 12 12 7 13 0Z" fill="currentColor" /></svg>
);

// نوار کلمه‌های متحرک بین بخش‌ها
export default function Marquee() {
  const row = BAND.map((w) => (
    <span key={w} className="flex shrink-0 items-center whitespace-nowrap">
      <span className="text-[clamp(2.2rem,6vw,4.8rem)] font-black leading-none">{w}</span>
      <Star />
    </span>
  ));
  return (
    <section data-tone="light" data-color="#1F2A44" aria-hidden="true" className="relative z-10 overflow-hidden bg-navy py-8 text-cream md:py-12" dir="ltr">
      <div className="band">{row}{row}{row}{row}</div>
    </section>
  );
}
