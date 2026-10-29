import { CONTACT, BRAND } from "../data/site";

export default function Contact() {
  const line = CONTACT.heading;
  return (
    <section id="contact" className="relative overflow-hidden bg-dusk text-cream">
      <div className="candle-glow pointer-events-none absolute inset-0 rotate-180" />
      <div className="relative py-28 md:py-44">
        <div className="overflow-hidden" aria-hidden="true">
          <div className="marquee text-[clamp(4rem,13vw,11rem)] font-black leading-none tracking-tight text-cream/10">
            {[0, 1, 2, 3].map((k) => <span key={k} className="px-8">{line}</span>)}
          </div>
        </div>
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="m-0 mt-10 text-balance text-[clamp(2.4rem,6vw,4.8rem)] font-black leading-[1.2] tracking-tight">{CONTACT.heading}</h2>
          <p className="mt-5 text-lg text-cream/60">{CONTACT.note}</p>
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <a href={CONTACT.phone} className="rounded-full bg-ember px-9 py-4 text-base font-black text-night shadow-[0_0_60px_-8px_rgb(255_179_92/.7)] transition-transform duration-300 hover:scale-105">
              {CONTACT.phoneLabel}
            </a>
            <a href={CONTACT.messageHref} className="glass rounded-full px-9 py-4 text-base font-black transition-colors duration-300 hover:bg-cream hover:text-night">
              {CONTACT.messageLabel}
            </a>
          </div>
        </div>
        <div className="mx-auto mt-28 max-w-6xl border-t border-cream/10 px-6 pt-6 text-sm text-cream/50">{BRAND}</div>
      </div>
    </section>
  );
}
