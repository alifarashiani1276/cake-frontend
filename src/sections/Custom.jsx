import { CUSTOM, CONTACT } from "../data/site";

// قاب طاق‌دار روی الگوی لوزی‌دار، همان نشان تصویری قالب برند
export default function Custom() {
  const src = `${import.meta.env.BASE_URL}cards/caramel-cake`;
  return (
    <section id="custom" data-tone="dark" data-color="#EAD7AD" className="lattice relative px-5 py-24 text-navy md:px-8 md:py-40">
      <div className="mx-auto grid max-w-6xl items-center gap-14 md:grid-cols-2">
        <div className="mx-auto w-full max-w-md rounded-t-[999px] border-[3px] border-teal bg-cream p-3 shadow-[0_30px_60px_-30px_rgb(31_42_68/.5)] md:max-w-lg">
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
        <div className="rounded-[2rem] bg-cream/90 p-8 md:p-12">
          <p className="m-0 text-sm font-bold text-teal-dark">{CUSTOM.eyebrow}</p>
          <h2 className="m-0 mt-3 text-[clamp(2.2rem,5vw,4.2rem)] font-black leading-[1.2] tracking-tight">{CUSTOM.heading}</h2>
          <p className="mt-5 text-lg leading-9 text-navy/80">{CUSTOM.text}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a href={CONTACT.messageHref} className="rounded-full bg-navy px-8 py-3.5 text-base font-black text-cream transition-transform duration-300 hover:scale-105">ثبت سفارش ویژه</a>
            <a href="#menu" className="rounded-full border border-navy px-8 py-3.5 text-base font-black transition-colors duration-300 hover:bg-navy hover:text-cream">دیدن کیک‌ها</a>
          </div>
        </div>
      </div>
    </section>
  );
}
