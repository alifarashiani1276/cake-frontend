import { useEffect, useRef } from "react";
import { MENU } from "../data/site";
import useCarousel from "../hooks/useCarousel";
import useViewportSize from "../hooks/useViewportSize";

const img = (id, size) => `${import.meta.env.BASE_URL}cards/${id}-${size}.webp`;
const fa = (n) => n.toLocaleString("fa-IR");
const N = MENU.items.length;

// دایرهٔ چرخش بزرگ‌تر و عمق بیشتر:
// STEP_DEG زاویهٔ بین دو کارت کناری روی دایره؛ RADIUS_K شعاع دایره بر حسب عرض کارت (قبلاً حدود ۱٫۴)؛
// DEPTH_K عقب‌رفتن اضافهٔ هر کارت کناری بر حسب عرض کارت؛ PERSPECTIVE هرچه کمتر، عمق دیدنی‌تر.
const STEP_DEG = 22;
const RADIUS_K = 3.1;
const DEPTH_K = 0.5;
const PERSPECTIVE = 1000;

// ذره‌های غبار نور پشت کارت‌ها (جای هرکدام با درصد صفحه)
const DUST = [
  { x: "8%", y: "62%", s: 10, d: "16s", dx: "30px", dy: "-70px" },
  { x: "17%", y: "30%", s: 7, d: "12s", dx: "-20px", dy: "-40px" },
  { x: "27%", y: "74%", s: 14, d: "19s", dx: "40px", dy: "-90px" },
  { x: "41%", y: "20%", s: 6, d: "13s", dx: "24px", dy: "-30px" },
  { x: "58%", y: "16%", s: 9, d: "17s", dx: "-30px", dy: "-50px" },
  { x: "72%", y: "70%", s: 12, d: "21s", dx: "-36px", dy: "-80px" },
  { x: "84%", y: "36%", s: 8, d: "15s", dx: "20px", dy: "-60px" },
  { x: "92%", y: "66%", s: 11, d: "18s", dx: "-26px", dy: "-70px" },
];

// فاصلهٔ کارت از وسط: ۰ = وسط، ۱ = یک جا سمت راست، -۱ = یک جا سمت چپ (حلقه‌ای، بدون پایان)
function getOffset(index, position) {
  let offset = (((index - position) % N) + N) % N;
  if (offset > N / 2) offset -= N;
  return offset;
}

// جای کارت روی یک قوس سه‌بعدی. کارت‌های کناری عقب‌تر می‌روند، کج می‌شوند،
// کمی تیره می‌شوند و محو (کم‌عمق‌نمایی لنز) و کم‌رنگ می‌شوند.
function getCardStyle(offset, cardW) {
  const radians = (offset * STEP_DEG * Math.PI) / 180;
  const radius = cardW * RADIUS_K;
  const distance = Math.abs(offset);
  const x = Math.sin(radians) * radius;
  // عمق = افتادن روی قوس دایره + عقب‌رفتن اضافه (با فاصله از وسط بیشتر می‌شود)
  const z = (Math.cos(radians) - 1) * radius - Math.min(distance, 3) * cardW * DEPTH_K;
  const opacity = Math.max(0, Math.min(1, 1 - (distance - 2.4) / 0.7)); // تا فاصلهٔ ۲٫۴ کامل دیده می‌شود و تا ۳٫۱ محو می‌شود
  const brightness = 1 - 0.6 * Math.min(1, distance / 3);
  const blur = Math.min(5, Math.max(0, (distance - 0.5) * 1.8)); // کارت وسط شفاف، پشتی‌ها نرم‌تر
  const lift = distance * 22; // کارت‌های پشتی بالاتر می‌روند تا عمق بیشتر حس شود
  return {
    transform: `translate(-50%,-50%) translate3d(${x.toFixed(1)}px,${-lift.toFixed(1)}px,${z.toFixed(1)}px) rotateY(${-offset * STEP_DEG}deg)`,
    opacity,
    visibility: opacity === 0 ? "hidden" : "visible",
    filter: `brightness(${brightness.toFixed(3)}) blur(${blur.toFixed(2)}px)`,
    zIndex: Math.round(100 - distance * 10),
  };
}

// کاروسل سه‌بعدی کیک‌ها.
// چرخ ماوس بالا و پایین صفحه را اسکرول می‌کند (مثل بقیهٔ سایت).
// کارت‌ها را با درگ، اسکرول افقی تاچ‌پد/ماوس، کلیک روی کارت کناری، نقطه‌ها یا کلیدهای ← و → بچرخانید.
export default function Menu() {
  const { w, h } = useViewportSize();
  const { position, activeIndex, next, prev, goTo, dragBy, release } = useCarousel(N, { autoplayMs: 0 });

  // اندازهٔ کارت و فاصلهٔ کارت‌ها
  const cardH = Math.min(h * 0.66, 620);
  const cardW = Math.min(w * (w < 640 ? 0.62 : 0.7), 440, cardH * 0.78); // کارت همیشه عمودی می‌ماند (مثل عکس‌ها)
  const spacing = cardW * Math.sin((STEP_DEG * Math.PI) / 180) * RADIUS_K; // فاصلهٔ افقی دو کارت کناری روی صفحه (برای سرعت درگ)
  const compact = cardH < 480; // روی صفحه‌های کم‌ارتفاع توضیح کارت حذف می‌شود تا کیک پوشیده نشود

  const stageRef = useRef(null);
  const drag = useRef({ down: false, moved: false, startX: 0, lastX: 0, lastTime: 0, velocity: 0 });
  const activeOnPointerDown = useRef(0);

  // اسکرول افقی (تاچ‌پد یا Shift + چرخ ماوس) کارت‌ها را می‌چرخاند؛ اسکرول عمودی دست‌نخورده می‌ماند
  useEffect(() => {
    const stage = stageRef.current;
    let busy = false;
    const onWheel = (e) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return; // عمودی: بگذار صفحه اسکرول شود
      e.preventDefault();
      if (busy || Math.abs(e.deltaX) < 20) return;
      if (e.deltaX > 0) next(); else prev();
      busy = true;
      setTimeout(() => (busy = false), 260);
    };
    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
  }, [next, prev]);

  const onPointerDown = (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const d = drag.current;
    d.down = true; d.moved = false; d.startX = e.clientX; d.velocity = 0;
    activeOnPointerDown.current = activeIndex;
  };

  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d.down) return;
    if (!d.moved) {
      if (Math.abs(e.clientX - d.startX) < 6) return; // حرکت خیلی کم = فقط کلیک
      d.moved = true; d.lastX = d.startX; d.lastTime = performance.now();
      e.currentTarget.setPointerCapture(e.pointerId);
    }
    const now = performance.now();
    const change = -(e.clientX - d.lastX) / spacing; // کشیدن به چپ = کارت بعدی
    d.velocity = 0.8 * d.velocity + 0.2 * (change / Math.max(1, now - d.lastTime));
    d.lastX = e.clientX; d.lastTime = now;
    dragBy(change);
  };

  const onPointerEnd = () => {
    const d = drag.current;
    if (d.down && d.moved) release(d.velocity);
    d.down = false;
  };

  // بعد از درگ، دکمه‌ها و کارت‌ها کلیک نمی‌شوند
  const onClickCapture = (e) => {
    if (drag.current.moved) { e.preventDefault(); e.stopPropagation(); drag.current.moved = false; }
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  };

  return (
    <section data-tone="dark" data-color="#F6EEDC" className="relative z-10 flex h-svh flex-col items-center justify-center overflow-hidden pb-4 pt-20 text-navy" style={{ background: "linear-gradient(to bottom, #F6EEDC 0%, #F3E8CF 45%, #EAD7AD 100%)" }}>
      {/* فضای پشت کارت‌ها: نور نرم، رنگ‌های محیطی، پرتوهای کم‌رنگ، کف و غبار نور */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {/* هالهٔ نور پشت کارت وسط */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 55% 50% at 50% 44%, rgb(255 251 238 / .95), rgb(255 246 225 / .45) 45%, transparent 75%)" }} />
        {/* رنگ‌های محیطی: فیروزه‌ای کم‌رنگ چپ، زعفرانی راست */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 14% 32%, rgb(44 159 154 / .10), transparent 42%), radial-gradient(circle at 88% 26%, rgb(230 184 92 / .20), transparent 44%)" }} />
        {/* پرتوهای نور از بالا */}
        <div className="absolute inset-x-0 top-0 h-[75%] opacity-70 blur-xl" style={{ background: "conic-gradient(from 180deg at 50% -8%, transparent 148deg, rgb(255 255 255 / .55) 163deg, transparent 172deg, rgb(255 255 255 / .35) 183deg, transparent 194deg, rgb(255 255 255 / .5) 203deg, transparent 214deg)", maskImage: "linear-gradient(to bottom, transparent, black 25%, transparent 95%)", WebkitMaskImage: "linear-gradient(to bottom, transparent, black 25%, transparent 95%)" }} />
        {/* حوضچهٔ نور روی کف */}
        <div className="absolute bottom-[8%] left-1/2 h-48 w-[78%] -translate-x-1/2" style={{ background: "radial-gradient(ellipse at center, rgb(255 251 238 / .85), rgb(255 246 225 / .3) 50%, transparent 72%)" }} />
        {/* غبار نور */}
        {DUST.map((p, i) => (
          <span key={i} className="dust" style={{ left: p.x, top: p.y, width: p.s, height: p.s, "--d": p.d, "--dx": p.dx, "--dy": p.dy }} />
        ))}
        {/* تیرگی لبه‌ها */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 46%, transparent 52%, rgb(122 86 54 / .20) 100%)" }} />
        <div className="film-grain absolute inset-0" />
      </div>

      {/* dir="ltr": چپ و راست هندسهٔ کارت‌ها در فارسی برعکس نشود؛ متن داخل کارت‌ها همچنان راست‌به‌چپ است */}
      <div
        ref={stageRef}
        dir="ltr"
        role="group"
        aria-roledescription="carousel"
        aria-label={MENU.heading}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerEnd}
        onPointerCancel={onPointerEnd}
        onClickCapture={onClickCapture}
        className="relative w-full cursor-grab touch-pan-y select-none active:cursor-grabbing"
        style={{ height: cardH + 90, perspective: `${PERSPECTIVE}px`, perspectiveOrigin: "50% 40%" }}
      >
        {/* سایهٔ تماس کارت وسط با کف */}
        <div className="absolute left-1/2 -translate-x-1/2 rounded-[50%] bg-navy/40 blur-2xl" style={{ top: cardH + 18, width: cardW * 0.95, height: 44 }} aria-hidden="true" />

        <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
          {MENU.items.map((it, i) => {
            const offset = getOffset(i, position);
            const isActive = i === activeIndex;
            const { filter, ...place } = getCardStyle(offset, cardW); // filter: عمق‌نمایی؛ بقیه: جای کارت
            return (
              <div key={it.key} className="absolute left-1/2 top-1/2 will-change-transform" style={{ width: cardW, height: cardH, ...place }}>
              {/* سایه جدا از کارت است تا با محو شدن کارت‌های کناری بریده نشود */}
              <div className="absolute inset-0 rounded-[2rem] shadow-[0_30px_50px_-28px_rgb(31_42_68/.6)]" aria-hidden="true" />
              <article
                dir="rtl"
                aria-hidden={Math.abs(offset) > 1.5}
                // کلیک روی کارت کناری فقط آن را به وسط می‌آورد؛ کلیک کیبورد (detail = 0) همیشه کار می‌کند
                onClickCapture={(e) => {
                  if (e.detail !== 0 && i !== activeOnPointerDown.current) { e.stopPropagation(); e.preventDefault(); goTo(i); }
                }}
                className="absolute inset-0 overflow-hidden rounded-[2rem] bg-navy"
                style={{ filter }}
              >
                <img
                  src={img(it.id, "lg")}
                  srcSet={`${img(it.id, "sm")} 800w, ${img(it.id, "lg")} 1400w`}
                  sizes="440px"
                  alt={it.name}
                  loading={i < 3 ? "eager" : "lazy"}
                  fetchPriority={i < 3 ? "high" : "auto"}
                  decoding="async"
                  className="absolute left-0 w-full object-cover"
                  // عکس کمی بالاتر از کارت قرار می‌گیرد تا کیک بالای متن دیده شود؛ رنگ‌ها کمی سینمایی می‌شوند
                  style={{ top: "-16%", height: "116%", objectPosition: it.pos, filter: "saturate(1.1) contrast(1.06)", opacity: 0, transition: "opacity 0.9s ease" }}
                  // عکس وقتی آماده شد نرم ظاهر می‌شود (فریم‌های هیرو اول بارگذاری می‌شوند)
                  ref={(el) => { if (el?.complete && el.naturalWidth) el.style.opacity = 1; }}
                  onLoad={(e) => { e.currentTarget.style.opacity = 1; }}
                  draggable="false"
                />
                {/* گرادیان پایین کارت برای خوانایی متن */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent" aria-hidden="true" />
                {/* تیرگی لبه‌های کارت، مثل لنز دوربین */}
                <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 40%, transparent 55%, rgb(10 14 28 / .35) 100%)" }} aria-hidden="true" />
                {/* بازتاب نور روی سطح کارت؛ با چرخش کارت جابه‌جا می‌شود */}
                <div className="absolute inset-0" style={{ background: `linear-gradient(${105 + offset * 28}deg, rgb(255 255 255 / .22) 0%, rgb(255 255 255 / .05) 28%, transparent 45%)` }} aria-hidden="true" />
                {/* لبهٔ شیشه‌ای */}
                <div className="absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/25" aria-hidden="true" />
                {it.discount && (
                  <span className="absolute start-4 top-4 rounded-full bg-saffron px-3.5 py-1 text-sm font-black text-navy shadow-lg">{fa(it.discount)}٪ تخفیف</span>
                )}
                <div className="absolute inset-x-0 bottom-0 p-5 text-cream md:p-6">
                  <h3 className="m-0 text-[clamp(1.35rem,2.6vw,1.8rem)] font-black leading-tight [text-shadow:0_2px_14px_rgb(0_0_0/.45)]">{it.name}</h3>
                  {!compact && <p className="mt-1.5 text-sm leading-7 text-cream/85">{it.note}</p>}
                  {!compact && <p className="mt-1 text-xs text-cream/75">{it.stock}</p>}
                  <p className="m-0 mt-2.5 flex items-baseline gap-2.5">
                    {it.oldPrice && <s className="text-sm text-cream/65">{fa(it.oldPrice)}</s>}
                    <span className="text-xl font-black">{fa(it.price)} <span className="text-sm font-bold">تومان</span></span>
                  </p>
                  <button type="button" tabIndex={isActive ? 0 : -1} className="mt-3 w-full rounded-full bg-rouge py-3 text-base font-black text-white shadow-[0_10px_24px_-8px_rgb(167_68_72/.8)] transition-colors duration-300 hover:bg-rouge-dark">افزودن به سبد</button>
                </div>
              </article>
              </div>
            );
          })}
        </div>
      </div>

      {/* نقطه‌ها: با کلیک روی هرکدام، همان کارت می‌آید وسط */}
      <div dir="ltr" className="relative mt-2 flex items-center justify-center gap-1">
        {MENU.items.map((it, i) => (
          <button
            key={it.key}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`${fa(i + 1)} از ${fa(N)}`}
            className="group flex h-6 items-center px-0.5"
          >
            <span className={`block h-1.5 rounded-full transition-all duration-500 ${i === activeIndex ? "w-8 bg-navy/80" : "w-1.5 bg-navy/25 group-hover:bg-navy/50"}`} />
          </button>
        ))}
      </div>
    </section>
  );
}
