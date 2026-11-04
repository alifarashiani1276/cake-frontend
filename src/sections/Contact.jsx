import { CONTACT, TAGLINE, SUB } from "../data/site";

// پنل آجری مثل قالب برند؛ فقط کرم و لاجوردی روی آن
export default function Contact() {
  return (
    <section id="contact" data-tone="light" data-color="#B85F47" className="relative bg-brick px-6 py-28 text-center text-cream md:py-44">
      <svg className="mx-auto" width="44" height="44" viewBox="0 0 44 44" fill="none" aria-hidden="true">
        <path d="M22 6c2.4 4.6 6.6 7 6.6 12.4A6.6 6.6 0 0 1 22 25a6.6 6.6 0 0 1-6.6-6.6C15.4 13 19.6 10.6 22 6Z" fill="#E6B85C" />
        <path d="M8 22c5 .4 8.6 3.6 10 9-5.4.2-9.4-2.8-10-9Zm28 0c-5 .4-8.6 3.6-10 9 5.4.2 9.4-2.8 10-9Z" fill="#E6B85C" opacity=".85" />
      </svg>
      <p className="m-0 mt-4 font-serif text-[clamp(4.5rem,16vw,12rem)] font-semibold leading-none tracking-[0.12em] ps-[0.12em]">KIKA</p>
      <p className="m-0 mt-3 text-sm font-bold tracking-[0.3em]">{SUB}</p>
      <div className="mx-auto mt-6 h-px w-20 bg-cream/60" />
      <h2 className="m-0 mt-6 text-balance text-[clamp(1.8rem,4vw,3rem)] font-black">{TAGLINE}</h2>
      <p className="mx-auto mt-4 max-w-md text-xl font-bold leading-9">{CONTACT.note}</p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <a href={CONTACT.phone} className="rounded-full bg-cream px-9 py-4 text-lg font-black text-navy transition-transform duration-300 hover:scale-105">{CONTACT.phoneLabel}</a>
        <a href={CONTACT.messageHref} className="rounded-full border-2 border-cream px-9 py-4 text-lg font-black transition-colors duration-300 hover:bg-cream hover:text-navy">{CONTACT.messageLabel}</a>
      </div>
    </section>
  );
}
