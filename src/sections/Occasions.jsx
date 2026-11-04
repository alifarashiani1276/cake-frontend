import { OCCASIONS } from "../data/site";

const img = (id) => `${import.meta.env.BASE_URL}cards/${id}-sm.webp`;
// ارتفاع قوس‌ها طبق تمپلیت: وسطی از همه بلندتر
const H = ["md:h-[300px]", "md:h-[360px]", "md:h-[440px]", "md:h-[360px]", "md:h-[300px]"];

// قوس‌های مناسبتی؛ در موبایل افقی و با اسنپ، در دسکتاپ یک ردیف با قوس وسطیِ بلندتر
export default function Occasions() {
  return (
    <section id="occasions" data-tone="dark" data-color="#F6EEDC" className="relative z-10 overflow-hidden bg-cream py-24 text-navy md:py-36">
      <div className="reveal mx-auto flex max-w-5xl items-center gap-5 px-5 md:gap-8 md:px-8">
        <span className="h-px flex-1 bg-navy/70" />
        <h2 className="m-0 text-[clamp(1.6rem,4vw,2.6rem)] font-black">{OCCASIONS.heading}</h2>
        <span className="h-px flex-1 bg-navy/70" />
      </div>

      <ul className="snap-row m-0 mt-14 flex list-none items-end gap-4 overflow-x-auto px-[12vw] pb-6 md:mt-20 md:justify-center md:gap-5 md:overflow-visible md:px-8">
        {OCCASIONS.items.map((it, i) => (
          <li key={it.id} className="reveal shrink-0" style={{ "--rd": `${i * 90}ms` }}>
            <a
              href="#custom"
              className={`group relative block h-[340px] w-[210px] overflow-hidden rounded-t-[999px] rounded-b-2xl bg-kahgeli shadow-[0_28px_50px_-32px_rgb(31_42_68/.6)] transition-transform duration-700 [transition-timing-function:cubic-bezier(.2,.7,.2,1)] hover:-translate-y-3 md:w-[clamp(120px,15vw,190px)] ${H[i]}`}
            >
              <img src={img(it.id)} alt="" loading="lazy" decoding="async" draggable="false" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-110" style={{ objectPosition: it.pos }} />
              <span className="absolute inset-0 bg-gradient-to-t from-navy/85 via-transparent to-transparent" aria-hidden="true" />
              <span className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-4 text-cream">
                <span className="text-base font-black md:text-lg">{it.title}</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0 -scale-x-100 opacity-0 transition-all duration-500 group-hover:translate-x-1 group-hover:opacity-100" aria-hidden="true"><path d="M4 10h12m0 0-5-5m5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
