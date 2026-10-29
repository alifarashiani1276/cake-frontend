import { MENU } from "../data/site";

const img = (id, size) => `${import.meta.env.BASE_URL}cards/${id}-${size}.webp`;

// سه کارت عکس‌دار که با اسکرول روی هم می‌نشینند
export default function Menu() {
  return (
    <section id="menu" className="relative z-10 -mt-[100svh] rounded-t-[2rem] bg-dusk text-cream shadow-[0_-30px_80px_-10px_rgb(0_0_0/.8)] md:rounded-t-[3.5rem]">
      <div className="candle-glow pointer-events-none absolute inset-x-0 top-0 h-[60svh]" />
      <div className="relative mx-auto max-w-6xl px-5 pt-40 md:px-8 md:pt-56">
        <h2 className="m-0 text-[clamp(3.2rem,11vw,9rem)] font-black leading-[1.05] tracking-tight">{MENU.heading}</h2>
        <p className="mt-6 max-w-md text-lg leading-9 text-cream/60">{MENU.intro}</p>

        <ul className="m-0 mt-20 list-none p-0 pb-[12svh]">
          {MENU.items.map((it, i) => (
            <li key={it.id} className="sticky mb-[10svh]" style={{ top: `calc(84px + ${i * 20}px)` }}>
              <article className="relative isolate h-[72svh] min-h-[26rem] overflow-hidden rounded-[2rem] bg-ink shadow-[0_-20px_60px_-20px_rgb(0_0_0/.6)] md:h-[78svh] md:rounded-[2.5rem]">
                <img
                  src={img(it.id, "lg")}
                  srcSet={`${img(it.id, "sm")} 800w, ${img(it.id, "lg")} 1600w`}
                  sizes="(min-width: 1152px) 1152px, 100vw"
                  alt={it.name}
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover"
                  style={{ objectPosition: it.pos }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-night/85 via-night/10 to-transparent" aria-hidden="true" />
                <div className="absolute inset-x-0 bottom-0 p-7 md:p-12">
                  <h3 className="m-0 text-[clamp(2.2rem,5.6vw,4.6rem)] font-black leading-[1.15] tracking-tight text-white">{it.name}</h3>
                  <p className="mt-3 max-w-md text-base leading-8 text-white/80 md:text-lg">{it.note}</p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
