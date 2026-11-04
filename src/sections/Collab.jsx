import { COLLAB, CONTACT } from "../data/site";

// بخش «همکاری با کیکا» طبق تمپلیت: عکس فروشگاه یک طرف، متن و دکمه طرف دیگر.
// پایین عکس کمی روی فوتر می‌افتد تا فروشگاه روی آن «ایستاده» باشد.
export default function Collab() {
  const src = `${import.meta.env.BASE_URL}brand/keeka-shop`;
  return (
    <section id="collab" data-tone="dark" data-color="#F6EEDC" className="relative z-10 bg-cream px-5 pt-16 text-navy md:px-8 md:pt-28">
      <div className="mx-auto grid max-w-5xl grid-cols-[1fr_1.15fr] items-center gap-4 md:gap-12">
        {/* ستون اول در RTL سمت راست است: عکس فروشگاه */}
        <img
          src={`${src}-lg.webp`}
          srcSet={`${src}-sm.webp 700w, ${src}-lg.webp 1400w`}
          sizes="(min-width: 1024px) 520px, 55vw"
          width="1400"
          height="933"
          alt="فروشگاه کیکا"
          loading="lazy"
          decoding="async"
          className="reveal relative z-10 mb-[-1.25rem] h-auto w-full md:mb-[-2.5rem]"
        />
        <div className="reveal pb-10 md:pb-16" style={{ "--rd": "150ms" }}>
          <h2 className="m-0 text-[clamp(1.6rem,5vw,3.2rem)] font-black leading-tight text-brick">{COLLAB.heading}</h2>
          <p className="mt-3 text-[clamp(.8rem,2.2vw,1.25rem)] leading-8 text-navy/85">{COLLAB.text}</p>
          <a href={CONTACT.messageHref} className="mt-6 inline-block rounded-full bg-rouge px-7 py-3 text-[clamp(.95rem,2.4vw,1.25rem)] font-black text-white shadow-[0_10px_24px_-8px_rgb(167_68_72/.8)] transition-colors duration-300 hover:bg-rouge-dark md:px-10 md:py-4">
            {COLLAB.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
