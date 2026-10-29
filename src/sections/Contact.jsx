import { CONTACT, BRAND } from "../data/site";
import Logo from "../components/layout/Logo";

export default function Contact() {
  const line = CONTACT.heading;
  return (
    <section id="contact" data-tone="light" className="relative overflow-hidden bg-clay text-cream">
      <div className="relative pt-28 md:pt-44">
        <div className="overflow-hidden" aria-hidden="true">
          <div className="marquee text-[clamp(4rem,13vw,11rem)] font-black leading-none tracking-tight text-cream/10">
            {[0, 1, 2, 3].map((k) => <span key={k} className="px-8">{line}</span>)}
          </div>
        </div>
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="m-0 mt-10 text-balance text-[clamp(2.4rem,6vw,4.8rem)] font-black leading-[1.2] tracking-tight">{CONTACT.heading}</h2>
          <p className="mt-5 text-lg text-cream/75">{CONTACT.note}</p>
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <a href={CONTACT.phone} className="rounded-full bg-cream px-9 py-4 text-base font-black text-clay transition-transform duration-300 hover:scale-105">{CONTACT.phoneLabel}</a>
            <a href={CONTACT.messageHref} className="rounded-full border border-cream/45 px-9 py-4 text-base font-black transition-colors duration-300 hover:bg-cream hover:text-clay">{CONTACT.messageLabel}</a>
          </div>
        </div>
        <footer className="mx-auto mt-28 max-w-6xl px-6 pb-10">
          <Logo kind="latin" height={96} className="mx-auto max-w-full text-caramel" style={{ maxHeight: "22vw" }} />
          <div className="mt-10 flex flex-col items-center justify-between gap-2 border-t border-cream/15 pt-6 text-sm text-cream/65 sm:flex-row">
            <span>{BRAND} — فروشگاه آنلاین کیک</span>
            <span>Keeka · Online Cake Shop</span>
          </div>
        </footer>
      </div>
    </section>
  );
}
