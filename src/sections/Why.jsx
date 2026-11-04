import { WHY } from "../data/site";

export default function Why() {
  return (
    <section id="why" data-tone="dark" data-color="#F6EEDC" className="relative bg-cream px-5 py-28 text-navy md:px-8 md:py-44">
      <div className="mx-auto max-w-6xl">
        <p className="m-0 text-sm font-bold tracking-wide text-teal-dark">PERSIAN SWEETS &amp; BITES</p>
        <h2 className="m-0 mt-3 text-[clamp(3rem,10vw,8rem)] font-black leading-[1.05] tracking-tight">{WHY.heading}</h2>
        <ul className="m-0 mt-16 grid list-none gap-5 p-0 md:grid-cols-3">
          {WHY.items.map((it, i) => (
            <li key={it.title} className="flex min-h-[18rem] flex-col justify-between rounded-[2rem] border border-[#D6BE8C] bg-kahgeli p-8 shadow-[0_20px_40px_-28px_rgb(31_42_68/.45)] md:min-h-[26rem] md:p-10">
              <div className="flex items-center justify-between">
                <span className="text-6xl font-black leading-none text-navy/85">{(i + 1).toLocaleString("fa-IR")}</span>
                <span className="size-3 rounded-full bg-olive" aria-hidden="true" />
              </div>
              <div>
                <h3 className="m-0 text-2xl font-black leading-snug md:text-3xl">{it.title}</h3>
                <p className="mt-3 text-base leading-8 text-navy/80">{it.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
