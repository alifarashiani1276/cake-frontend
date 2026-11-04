import { TAGLINE, SUB } from "../data/site";

// قانون ۸ قالب: فوتر لاجوردی، متن کرم، تیتر ستون‌ها زعفرانی
export default function Footer() {
  const col = "m-0 mb-4 text-base font-black text-saffron";
  const link = "text-cream/85 transition-colors hover:text-cream";
  return (
    <footer data-tone="light" data-color="#1F2A44" className="bg-navy px-6 pb-10 pt-20 text-cream">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="m-0 font-serif text-5xl font-semibold tracking-[0.2em]">KIKA</p>
          <p className="m-0 mt-2 text-xs tracking-[0.3em] text-cream/75">{SUB}</p>
          <p className="mt-5 max-w-xs leading-8 text-cream/85">{TAGLINE}</p>
        </div>
        <nav aria-label="دسترسی سریع">
          <h3 className={col}>دسترسی سریع</h3>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            <li><a className={link} href="#menu">دسته‌بندی‌ها</a></li>
            <li><a className={link} href="#menu">پرفروش‌ها</a></li>
            <li><a className={link} href="#custom">سفارش ویژه</a></li>
          </ul>
        </nav>
        <div>
          <h3 className={col}>ارتباط با ما</h3>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            <li><a className={link} href="#contact">تماس تلفنی</a></li>
            <li><a className={link} href="#contact">پیام در تلگرام</a></li>
          </ul>
        </div>
      </div>
      <p className="mx-auto mt-16 max-w-6xl border-t border-cream/15 pt-6 text-sm text-cream/70">More than a dessert, a feeling.</p>
    </footer>
  );
}
