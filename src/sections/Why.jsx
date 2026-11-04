import { WHY } from "../data/site";

const ICONS = [
  <path key="a" d="M12 36c0-14 9-24 24-26 0 15-8 25-24 26Zm0 0c4-8 9-14 16-19" strokeLinecap="round" strokeLinejoin="round" />,
  <path key="b" d="M6 14h22v18H6zM28 20h8l5 6v6H28zM14 38a4 4 0 1 0 0-.1M36 38a4 4 0 1 0 0-.1" strokeLinecap="round" strokeLinejoin="round" />,
  <path key="c" d="M8 30h32v8H8zM12 30V20h24v10M24 20v-8M24 8c1.5 2 3 3 3 5a3 3 0 0 1-6 0c0-2 1.5-3 3-5Z" strokeLinecap="round" strokeLinejoin="round" />,
];
// هر کارت یک ظاهر: لاجوردی بزرگ، کاهگلی، زعفرانی (چینش bento)
const LOOK = [
  "bg-navy text-cream md:col-span-3 md:row-span-2 md:p-12",
  "bg-kahgeli text-navy md:col-span-2",
  "bg-saffron text-navy md:col-span-2",
];

export default function Why() {
  return (
    <section id="why" data-tone="dark" data-color="#F6EEDC" className="relative bg-cream px-5 py-28 text-navy md:px-8 md:py-44">
      <div className="mx-auto max-w-6xl">
        <p className="reveal m-0 flex items-center gap-3 text-sm font-bold text-teal-dark"><span className="h-px w-10 bg-teal-dark" />PERSIAN SWEETS &amp; BITES</p>
        <h2 className="reveal m-0 mt-4 text-[clamp(3rem,10vw,8rem)] font-black leading-[1.05] tracking-tight">{WHY.heading}</h2>
        <ul className="m-0 mt-14 grid list-none gap-4 p-0 md:mt-20 md:grid-cols-5 md:gap-5">
          {WHY.items.map((it, i) => (
            <li key={it.title} className={`reveal group relative flex min-h-[16rem] flex-col justify-between overflow-hidden rounded-[2rem] p-8 shadow-[0_24px_50px_-34px_rgb(31_42_68/.55)] transition-transform duration-700 hover:-translate-y-1.5 md:min-h-[17rem] ${LOOK[i]}`} style={{ "--rd": `${i * 120}ms` }}>
              {i === 0 && <span className="pointer-events-none absolute -bottom-10 -start-6 select-none text-[16rem] font-black leading-none text-cream/[.06]" aria-hidden="true">۱</span>}
              <div className="relative flex items-start justify-between">
                <svg width="54" height="54" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">{ICONS[i]}</svg>
                <span className="rounded-full border border-current/30 px-3 py-1 text-sm font-black">{(i + 1).toLocaleString("fa-IR")}</span>
              </div>
              <div className="relative mt-10">
                <h3 className={`m-0 font-black leading-snug ${i === 0 ? "text-3xl md:text-5xl" : "text-2xl md:text-3xl"}`}>{it.title}</h3>
                <p className={`mt-3 max-w-md leading-8 ${i === 0 ? "text-lg text-cream/80" : "text-base text-navy/80"}`}>{it.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
