import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { MENU } from "../data/site";
import useCarousel from "../hooks/useCarousel";
import useViewportSize from "../hooks/useViewportSize";
import RollingPin, { PIN_W, PIN_H } from "../components/animation/RollingPin";
import FlourDust from "../components/animation/FlourDust";
import { subscribeScroll } from "../lib/scrollBus";

const img = (id, size) => `${import.meta.env.BASE_URL}cards/${id}-${size}.webp`;
const fa = (n) => n.toLocaleString("fa-IR");
const N = MENU.items.length;
const BASE = import.meta.env.BASE_URL;
const TRACK_SVH = 200; // طول مسیر اسکرول بخش (۱۰۰ از آن خودِ صفحه است)
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const easeInOut = (t) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

// همهٔ کارت‌ها روی یک دایرهٔ منظم می‌چرخند (یک محور، یک شعاع، همه هم‌سطح):
// STEP_DEG زاویهٔ بین دو کارت کناری روی دایره؛ RADIUS_K شعاع دایره بر حسب عرض کارت؛
// PERSPECTIVE هرچه کمتر، عمق دیدنی‌تر.
const STEP_DEG = 24;
const TILT_DEG = 0; // چرخش خود کارت‌ها؛ ۰ یعنی همه صاف و در یک ردیف افقی (برای کمی کج شدن، مثلاً ۸ بگذار)
const RADIUS_K = 2.8;
const PERSPECTIVE = 1100;

// ستاره‌های سوسوزنِ دور کارت وسط: جا (٪ از کارت)، اندازه (px)، تأخیر و مدت (ثانیه)
const SPARKS = [
  { x: "9%", y: "-1%", s: 13, d: 0, t: 2.6 },
  { x: "93%", y: "5%", s: 10, d: 0.9, t: 2.2 },
  { x: "101%", y: "42%", s: 14, d: 1.7, t: 3 },
  { x: "96%", y: "97%", s: 11, d: 0.4, t: 2.4 },
  { x: "6%", y: "92%", s: 12, d: 1.3, t: 2.8 },
  { x: "-1%", y: "38%", s: 9, d: 2.1, t: 2.3 },
];

// فاصلهٔ کارت از وسط: ۰ = وسط، ۱ = یک جا سمت راست، -۱ = یک جا سمت چپ (حلقه‌ای، بدون پایان)
function getOffset(index, position) {
  let offset = (((index - position) % N) + N) % N;
  if (offset > N / 2) offset -= N;
  return offset;
}

// جای کارت روی یک قوس سه‌بعدی. فقط transform و opacity عوض می‌شوند (کارت روی GPU می‌ماند)؛
// بلور و filter در هر فریم حذف شد چون در موبایل خیلی سنگین بود. تیرگی عمق با یک لایهٔ جدا و فقط opacity ساخته می‌شود.
// near = موبایل: کارت‌های دورتر که بیرون صفحه‌اند اصلاً کشیده نمی‌شوند.
function getCardStyle(offset, cardW, near) {
  const radians = (offset * STEP_DEG * Math.PI) / 180;
  const radius = cardW * RADIUS_K;
  const distance = Math.abs(offset);
  const x = Math.sin(radians) * radius;
  // عمق = فقط افتادن روی قوس دایره؛ کارت‌ها نه بالا می‌روند و نه اضافه عقب می‌روند
  const z = (Math.cos(radians) - 1) * radius;
  const fadeFrom = near ? 1.1 : 2.4;
  const fadeLen = near ? 0.8 : 0.7;
  const opacity = Math.max(0, Math.min(1, 1 - (distance - fadeFrom) / fadeLen));
  return {
    transform: `translate(-50%,-50%) translate3d(${x.toFixed(1)}px,0,${z.toFixed(1)}px) rotateY(${-offset * TILT_DEG}deg)`,
    opacity,
    visibility: opacity === 0 ? "hidden" : "visible",
    dim: 0.45 * Math.min(1, distance / 2.5),
    zIndex: Math.round(100 - distance * 10),
  };
}

// کاروسل سه‌بعدی کیک‌ها.
// چرخ ماوس بالا و پایین صفحه را اسکرول می‌کند (مثل بقیهٔ سایت).
// کارت‌ها را با درگ، اسکرول افقی تاچ‌پد/ماوس، کلیک روی کارت کناری، نقطه‌ها یا کلیدهای ← و → بچرخانید.
export default function Menu() {
  const { w, h } = useViewportSize();
  const cardsRef = useRef([]); // div بیرونی هر کارت
  const dimsRef = useRef([]); // لایهٔ تیرگی هر کارت
  const glowsRef = useRef([]); // لبهٔ درخشان طلایی هر کارت (فقط کارت وسط کامل روشن است)
  const geo = useRef({ cardW: 300, near: false });

  // موقعیت کارت‌ها مستقیم روی DOM نوشته می‌شود؛ ریاکت در هر فریم دوباره رندر نمی‌شود
  const apply = useCallback((position) => {
    const { cardW, near } = geo.current;
    for (let i = 0; i < N; i++) {
      const el = cardsRef.current[i];
      if (!el) continue;
      const offset = getOffset(i, position);
      const { dim, ...st } = getCardStyle(offset, cardW, near);
      el.style.transform = st.transform;
      el.style.opacity = st.opacity;
      el.style.visibility = st.visibility;
      el.style.zIndex = st.zIndex;
      if (dimsRef.current[i]) dimsRef.current[i].style.opacity = dim.toFixed(3);
      if (glowsRef.current[i]) glowsRef.current[i].style.opacity = Math.max(0, 1 - Math.abs(offset) * 0.8).toFixed(3);
    }
  }, []);

  const { positionRef, activeIndex, next, prev, goTo, dragBy, release } = useCarousel(N, { autoplayMs: 0, onFrame: apply });

  // اندازهٔ کارت و فاصلهٔ کارت‌ها
  const cardH = Math.min(h * 0.6, 580);
  const cardW = Math.min(w * (w < 640 ? 0.66 : 0.7), 440, cardH * 0.78); // کارت همیشه عمودی می‌ماند (مثل عکس‌ها)
  const spacing = cardW * Math.sin((STEP_DEG * Math.PI) / 180) * RADIUS_K; // فاصلهٔ افقی دو کارت کناری روی صفحه (برای سرعت درگ)
    geo.current = { cardW, near: w < 640 };
  // با اولین رندر و هر تغییر اندازه، قبل از نقاشی صفحه جای کارت‌ها نوشته می‌شود
  useLayoutEffect(() => { apply(positionRef.current); }, [apply, positionRef, cardW, cardH, w]);

  const trackRef = useRef(null);
  const sceneRef = useRef(null);
  const bgRef = useRef(null);
  const sharpRef = useRef(null);
  const softRef = useRef(null);
  const vigRef = useRef(null);
  const uiRef = useRef(null);
  const stageRef = useRef(null);
  const pinDrawRef = useRef(null);
  const flourRef = useRef(null);
  const lastTopRef = useRef(null);

  // اسکرول مرحله‌ای: p از ۰ تا ۱ در طول بخش.
  // ۰ تا ۰٫۳: عکس از پایین می‌آید؛ ۰٫۱ تا ۰٫۳۵: کمی تار می‌شود؛ ۰٫۱۲ تا ۰٫۴۲: کارت‌ها ظاهر می‌شوند (بدون صفحهٔ خالی).
  // فقط style عنصرها نوشته می‌شود (بدون رندر ریاکت).
  useEffect(() => {
    // خواندن و نوشتن جدا (scrollBus): یک بار چیدمان در هر فریم
    const read = () => {
      const r = trackRef.current.getBoundingClientRect();
      return { top: r.top, height: r.height, vh: window.innerHeight };
    };
    const write = ({ top, height, vh }) => {
      const p = clamp01(-top / Math.max(1, height - vh));
      const a = easeInOut(clamp01(p / 0.25));
      const b = clamp01((p - 0.12) / 0.25);
      const c = easeInOut(clamp01((p - 0.2) / 0.28));

      // صفحهٔ کرم مثل یک ورقهٔ خمیر با گوشهٔ گرد از پایین بالا می‌آید و وردنه روی لبهٔ آن قل می‌خورد.
      // وقتی ورقه کامل بالا آمد، با اسکرول بعدی عکس فروشگاه از پایین می‌آید.
      const rad = (48 * clamp01(top / (vh * 0.35))).toFixed(1);
      sceneRef.current.style.borderRadius = `${rad}px ${rad}px 0 0`;

      const pinW = Math.min(window.innerWidth * 0.98, 1250);
      const pinH = (pinW * PIN_H) / PIN_W;
      // وردنه و آرد فقط وقتی وردنه روی صفحه است محاسبه می‌شوند (پیش‌تر در کل صفحه با هر اسکرول اجرا می‌شد)
      const pinVisible = top > -pinH && top < vh + pinH;
      if (pinVisible) {
        // وردنه با حرکت لبه می‌چرخد: مسافت طی‌شده ÷ شعاع وردنه (حدود ۶۵ پیکسل) = زاویه
        pinDrawRef.current?.(-top / 65);

        // آرد: هرچه وردنه سریع‌تر قل بخورد، بیشتر از زیر آن می‌ریزد
        const moved = lastTopRef.current === null ? 0 : Math.abs(lastTopRef.current - top);
        const flourY = (top < 0 ? top : 0) + pinH * 0.4; // مختصات داخل صحنه
        if (moved > 0.3 && flourY > 0 && top < vh && flourRef.current) {
          const left = (window.innerWidth - pinW) / 2;
          const count = Math.min(34, moved * 0.85);
          const n = Math.floor(count) + (Math.random() < count % 1 ? 1 : 0);
          flourRef.current(Math.ceil(n * 0.8), left + pinW * 0.26, left + pinW * 0.74, flourY);
          flourRef.current(Math.floor(n * 0.2), left + pinW * 0.03, left + pinW * 0.97, flourY - pinH * 0.08);
        }
      }
      lastTopRef.current = top;

      const bg = bgRef.current;
      bg.style.transform = `translate3d(0,${((1 - a) * 100).toFixed(2)}%,0)`;
      bg.style.borderRadius = `${((1 - a) * 48).toFixed(1)}px ${((1 - a) * 48).toFixed(1)}px 0 0`;
      bg.style.visibility = a === 0 ? "hidden" : "visible";
      softRef.current.style.opacity = b.toFixed(3);
      vigRef.current.style.opacity = b.toFixed(3);
      sharpRef.current.style.visibility = b >= 1 ? "hidden" : "visible";

      const ui = uiRef.current;
      ui.style.opacity = c.toFixed(3);
      ui.style.transform = `translate3d(0,${((1 - c) * 48).toFixed(1)}px,0) scale(${(0.94 + 0.06 * c).toFixed(3)})`;
      ui.style.visibility = c === 0 ? "hidden" : "visible";
      ui.style.pointerEvents = c > 0.6 ? "auto" : "none";

      // رنگ متن هدر: روی کرم تیره، روی عکس روشن
      const dark = p < 0.12;
      sceneRef.current.dataset.tone = dark ? "dark" : "light";
      sceneRef.current.dataset.color = dark ? "#F3DDB6" : "#1c2233";
    };
    return subscribeScroll({ read, write });
  }, []);

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
    // مسیر اسکرول بلند + صحنهٔ چسبان: با اسکرول، اول عکس واضح از پایین می‌آید، بعد کمی تار و کم‌نور می‌شود و کارت‌ها ظاهر می‌شوند
    <section ref={trackRef} className="relative z-10 text-navy" style={{ height: `${TRACK_SVH}svh`, marginTop: "-100svh" }}>
      {/* لنگر منوی «فروشگاه‌ها»: جایی که کارت‌ها کامل دیده می‌شوند */}
      <span id="menu" aria-hidden="true" className="pointer-events-none absolute inset-x-0" style={{ top: `${(TRACK_SVH - 100) * 0.55}svh`, height: 1 }} />
      <RollingPin drawRef={pinDrawRef} />
      <div ref={sceneRef} data-tone="dark" data-color="#F3DDB6" className="sticky top-0 flex h-svh flex-col items-center justify-center overflow-hidden pb-4 pt-16 shadow-[0_-30px_80px_-10px_rgb(31_42_68/.7)]" style={{ backgroundColor: "#FAD199", backgroundImage: `url(${BASE}brand/dough-bg.webp)`, backgroundSize: "cover", backgroundPosition: "center" }}>
        <FlourDust emitRef={flourRef} />
        {/* پس‌زمینه: عکس شعبه؛ از پایین مثل کشو بالا می‌آید. دو لایه (واضح و کمی تار) با کراس‌فید جابه‌جا می‌شوند، بدون فیلتر زنده */}
        <div ref={bgRef} className="pointer-events-none absolute inset-0 overflow-hidden will-change-transform" style={{ transform: "translate3d(0,100%,0)", visibility: "hidden" }} aria-hidden="true">
          <picture>
            <source media="(max-width: 640px)" srcSet={`${BASE}brand/bakery-sharp-sm.webp`} />
            <img ref={sharpRef} src={`${BASE}brand/bakery-sharp-lg.webp`} alt="" loading="eager" decoding="async" draggable="false" className="absolute inset-0 h-full w-full object-cover object-center" />
          </picture>
          <picture>
            <source media="(max-width: 640px)" srcSet={`${BASE}brand/bakery-soft-sm.webp`} />
            <img ref={softRef} src={`${BASE}brand/bakery-soft-lg.webp`} alt="" loading="lazy" decoding="async" draggable="false" className="absolute inset-0 h-full w-full object-cover object-center" style={{ opacity: 0 }} />
          </picture>
          {/* تیرگی لبه‌ها تا کارت‌های شیشه‌ای خوانا بمانند */}
          <div ref={vigRef} className="absolute inset-0" style={{ opacity: 0, background: "radial-gradient(ellipse at 50% 50%, rgb(10 14 28 / .08) 30%, rgb(10 14 28 / .5) 100%)" }} />
        </div>

        {/* کارت‌ها و نوار صفحه‌بندی؛ با اسکرول نرم ظاهر می‌شوند */}
        <div ref={uiRef} className="relative flex w-full flex-col items-center will-change-transform" style={{ opacity: 0, visibility: "hidden", pointerEvents: "none" }}>
          {/* تیتر کوچک و ساده، چسبیده به کارت‌ها */}
          <h2 className="m-0 mb-2 text-base font-bold tracking-wide text-cream/90 md:mb-3 md:text-xl">{MENU.heading}</h2>
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
        style={{ height: cardH + 56, perspective: `${PERSPECTIVE}px`, perspectiveOrigin: "50% 50%" }}
      >
        {/* سایهٔ تماس کارت وسط با کف */}
        <div className="absolute left-1/2 -translate-x-1/2" style={{ top: cardH + 18, width: cardW * 1.1, height: 56, background: "radial-gradient(ellipse at center, rgb(31 42 68 / .42), transparent 70%)" }} aria-hidden="true" />

        <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
          {MENU.items.map((it, i) => {
            const isActive = i === activeIndex;
            const offset = (((i - activeIndex) % N) + N) % N; // فقط برای aria و کلیک؛ جای دقیق را apply می‌گذارد
            const far = Math.min(offset, N - offset) > 1;
            return (
              <div key={it.key} ref={(el) => (cardsRef.current[i] = el)} className="absolute left-1/2 top-1/2 [backface-visibility:hidden] will-change-transform" style={{ width: cardW, height: cardH }}>
              {/* سایهٔ نرم زیر شیشه */}
              <div className="absolute inset-0 rounded-[1.6rem] shadow-[0_18px_30px_-18px_rgb(10_14_28/.7)] md:shadow-[0_34px_55px_-28px_rgb(10_14_28/.75)]" aria-hidden="true" />
              {/* کارت شیشه‌ای: قاب نیمه‌شفاف با لبهٔ روشن؛ بدون backdrop-filter چون روی موبایل سنگین است */}
              <article
                dir="rtl"
                aria-hidden={far}
                // کلیک روی کارت کناری فقط آن را به وسط می‌آورد؛ کلیک کیبورد (detail = 0) همیشه کار می‌کند
                onClickCapture={(e) => {
                  if (e.detail !== 0 && i !== activeOnPointerDown.current) { e.stopPropagation(); e.preventDefault(); goTo(i); }
                }}
                className="absolute inset-0 flex flex-col rounded-[1.6rem] p-2"
                style={{
                  background: "linear-gradient(155deg, rgb(255 255 255 / .30), rgb(255 255 255 / .08) 42%, rgb(255 255 255 / .16))",
                  boxShadow: "inset 0 1px 0 rgb(255 255 255 / .7), inset 0 0 0 1px rgb(255 255 255 / .32)",
                }}
              >
                {/* پنجرهٔ عکس داخل شیشه */}
                <div className="relative min-h-0 flex-1 overflow-hidden rounded-[1.2rem] bg-navy">
                  <img
                    src={img(it.id, "sm")}
                    srcSet={`${img(it.id, "sm")} 800w, ${img(it.id, "lg")} 1400w`}
                    sizes="480px"
                    alt={it.name}
                    loading={i < 3 ? "eager" : "lazy"}
                    fetchPriority={i < 3 ? "high" : "auto"}
                    decoding="async"
                    className="absolute left-0 w-full object-cover"
                    // عکس کمی بالاتر قرار می‌گیرد تا کیک بالای متن دیده شود
                    style={{ top: "-6%", height: "106%", objectPosition: it.pos, opacity: 0, transition: "opacity 0.9s ease" }}
                    ref={(el) => { if (el?.complete && el.naturalWidth) el.style.opacity = 1; }}
                    onLoad={(e) => { e.currentTarget.style.opacity = 1; }}
                    draggable="false"
                  />
                  {/* گرادیان پایین برای خوانایی متن + بازتاب نور شیشه */}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-transparent to-transparent" aria-hidden="true" />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(105deg, rgb(255 255 255 / .2) 0%, rgb(255 255 255 / .04) 30%, transparent 46%)" }} aria-hidden="true" />
                  <div className="absolute inset-0 rounded-[1.2rem] ring-1 ring-inset ring-white/25" aria-hidden="true" />
                  {it.discount && (
                    <span className="absolute start-3 top-3 rounded-full bg-saffron px-2.5 py-0.5 text-xs font-black text-navy">{fa(it.discount)}٪ تخفیف</span>
                  )}
                  <div className="absolute inset-x-2.5 bottom-2.5 flex items-center justify-between gap-3 rounded-2xl border border-white/20 bg-[#0a0e1c]/50 py-2 pe-2 ps-4 text-cream">
                    <div className="min-w-0">
                      <h3 className="m-0 truncate text-base font-black leading-tight md:text-lg">{it.name}</h3>
                      <p className="m-0 mt-1 flex items-baseline gap-2">
                        {it.oldPrice && <s className="text-xs text-cream/60">{fa(it.oldPrice)}</s>}
                        <span className="text-sm font-bold text-saffron">{fa(it.price)} <span className="text-xs font-medium text-cream/80">تومان</span></span>
                      </p>
                    </div>
                    <button type="button" tabIndex={isActive ? 0 : -1} aria-label={`افزودن ${it.name} به سبد`} className="grid size-9 shrink-0 place-items-center rounded-full bg-rouge text-white shadow-[0_8px_18px_-6px_rgb(167_68_72/.9)] transition-colors duration-300 hover:bg-rouge-dark">
                      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                    </button>
                  </div>
                </div>

                {/* لبهٔ درخشان طلایی؛ فقط کارت وسط کامل روشن است (لایهٔ جدا با opacity).
                    کارت وسط زنده است: هاله می‌تپد، نور طلایی دور کارت می‌چرخد و ستاره‌های ریز سوسو می‌زنند؛ کارت‌های کناری متوقف‌اند */}
                <div ref={(el) => (glowsRef.current[i] = el)} data-live={isActive ? "1" : "0"} className="card-glow pointer-events-none absolute inset-0 rounded-[1.6rem] will-change-[opacity]" style={{ opacity: 0, boxShadow: "0 0 0 1.5px rgb(255 226 165 / .95), inset 0 0 22px rgb(255 226 165 / .4)" }} aria-hidden="true">
                  {!far && (
                    <>
                      <span className="card-glow__halo" />
                      <span className="card-glow__bloom" />
                      <span className="card-glow__ring" />
                      {SPARKS.map((sp, k) => (
                        <span key={k} className="card-glow__spark" style={{ left: sp.x, top: sp.y, "--s": `${sp.s}px`, animationDelay: `${sp.d}s`, animationDuration: `${sp.t}s` }} />
                      ))}
                    </>
                  )}
                </div>
                {/* تیرگی عمق: لایهٔ جدا که فقط opacityش عوض می‌شود */}
                <div ref={(el) => (dimsRef.current[i] = el)} className="pointer-events-none absolute inset-0 rounded-[1.6rem] bg-[#0a0e1c] will-change-[opacity]" style={{ opacity: 0 }} aria-hidden="true" />
              </article>
              </div>
            );
          })}
        </div>
      </div>
      {/* نقطه‌های ساده؛ نقطهٔ فعال کشیده‌تر و سفید */}
      <div dir="ltr" className="relative mt-1 flex items-center gap-1">
        {MENU.items.map((it, i) => (
          <button key={it.key} type="button" onClick={() => goTo(i)} aria-label={`${fa(i + 1)} از ${fa(N)}`} className="group flex h-6 items-center px-1">
            <span className={`block h-1.5 rounded-full transition-all duration-500 ${i === activeIndex ? "w-5 bg-white" : "w-1.5 bg-white/40 group-hover:bg-white/80"}`} />
          </button>
        ))}
      </div>
        </div>
      </div>
    </section>
  );
}
