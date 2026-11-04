import { SOCIAL } from "../data/site";
import Logo from "../components/layout/Logo";

// فوتر طبق تمپلیت: لوگو + شعار + آیکون شبکه‌ها، و سه ستون لینک؛ تیتر ستون‌ها زعفرانی
export default function Footer() {
  const col = "m-0 mb-4 text-base font-black text-saffron";
  const link = "text-cream/85 transition-colors hover:text-cream";
  return (
    <footer data-tone="light" data-color="#1F2A44" className="relative z-0 bg-navy px-6 pb-10 pt-28 text-cream">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo kind="latin" width="min(60vw,240px)" />
          <p className="m-0 mt-5 max-w-xs leading-8 text-cream/85">کیکا ، شیرینی لحظه‌های خوب</p>
          <ul className="m-0 mt-6 flex list-none gap-3 p-0">
            {SOCIAL.map((s) => (
              <li key={s.label}>
                <a href={s.href} aria-label={s.label} className="grid size-11 place-items-center rounded-full border border-cream/25 text-cream transition-colors duration-300 hover:border-saffron hover:bg-saffron hover:text-navy">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={s.d} /></svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
        <nav aria-label="دسترسی سریع">
          <h3 className={col}>دسترسی سریع</h3>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            <li><a className={link} href="#menu">دسته‌بندی‌ها</a></li>
            <li><a className={link} href="#occasions">مناسب‌ها</a></li>
            <li><a className={link} href="#custom">سفارش ویژه</a></li>
          </ul>
        </nav>
        <div>
          <h3 className={col}>راهنمای خرید</h3>
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            <li><a className={link} href="#why">چرا کیکا</a></li>
            <li><a className={link} href="#collab">همکاری با کیکا</a></li>
          </ul>
        </div>
        <div>
          <h3 className={col}>تماس با ما</h3>
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
