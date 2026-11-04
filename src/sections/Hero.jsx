import { useCallback, useEffect, useRef, useState } from "react";
import { MENU } from "../data/site";
import FrameCanvas from "../components/animation/FrameCanvas";
import Captions from "../components/animation/Captions";
import LoadingBar from "../components/layout/LoadingBar";
import { useScrollFrames } from "../hooks/useScrollFrames";
import { FRAME_COUNT, SCROLL_PX_PER_FRAME } from "../data/sequence";

export default function Hero() {
  const trackRef = useRef(null);
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const captionsRef = useRef(null);
  const barRef = useRef(null);
  const hintRef = useRef(null);
  const lineRef = useRef(null);
  const curtainRef = useRef(null);

  // بعد از پایان انیمیشن، پرده در ۱٫۶ صفحه اسکرول و با منحنی نرم بالا می‌آید و کل صحنه را می‌پوشاند
  useEffect(() => {
    const N = FRAME_COUNT * SCROLL_PX_PER_FRAME;
    const on = () => {
      const c = curtainRef.current;
      if (!c) return;
      const s = -trackRef.current.getBoundingClientRect().top;
      const q = Math.min(1, Math.max(0, (s - N) / (window.innerHeight * 1.6)));
      const e = q < 0.5 ? 4 * q ** 3 : 1 - (-2 * q + 2) ** 3 / 2; // easeInOutCubic
      c.style.transform = `translate3d(0, ${(1 - e) * 100}%, 0)`;
      c.style.borderTopLeftRadius = c.style.borderTopRightRadius = `${(1 - e) * 56}px`;
      c.style.visibility = q === 0 ? "hidden" : "visible";
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); };
  }, []);
  const [ready, setReady] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // callbackها ثابت‌اند تا افکت هوک دوباره راه نیفتد
  const onProgress = useCallback((p) => {
    captionsRef.current?.update(p);
    if (lineRef.current) lineRef.current.style.transform = `scaleY(${p})`;
    if (hintRef.current) hintRef.current.style.opacity = p > 0.02 ? 0 : 1;
  }, []);
  const onLoad = useCallback((p) => {
    if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
    if (p >= 1) setLoaded(true);
  }, []);
  const onReady = useCallback(() => setReady(true), []);
  const onError = useCallback(() => setError(true), []);

  useScrollFrames({ trackRef, wrapRef, canvasRef, onProgress, onLoad, onReady, onError });

  return (
    <main id="hero" ref={trackRef} className="relative" style={{ height: `calc(280svh + ${FRAME_COUNT * SCROLL_PX_PER_FRAME}px)` }}>
      <div data-tone="light" data-color="#050403" className="sticky top-0 h-svh w-full overflow-hidden bg-night">
        <div className={`transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}>
          <FrameCanvas ref={wrapRef} canvasRef={canvasRef} />
        </div>
        <Captions ref={captionsRef} />
        <div
          ref={curtainRef}
          data-tone="dark"
          data-color="#F6EEDC"
          className="absolute inset-0 z-20 bg-cream text-ink shadow-[0_-30px_80px_-10px_rgb(31_42_68/.7)] will-change-transform"
          style={{ transform: "translate3d(0,100%,0)", visibility: "hidden" }}
        >
          <div className="mx-auto max-w-6xl px-5 pt-40 md:px-8 md:pt-56">
            <h2 className="m-0 text-[clamp(3.2rem,11vw,9rem)] font-black leading-[1.05] tracking-tight">{MENU.heading}</h2>
            <p className="mt-6 max-w-md text-lg leading-9 text-navy/70">{MENU.intro}</p>
          </div>
        </div>
        <div className="pointer-events-none absolute inset-y-[22svh] end-[3vw] hidden w-px bg-cream/15 md:block" aria-hidden="true">
          <div ref={lineRef} className="h-full w-full origin-top scale-y-0 bg-ember" />
        </div>

        <div
          ref={hintRef}
          className="pointer-events-none absolute bottom-[5svh] start-[6vw] flex flex-col items-center gap-3 text-sm text-ember/80 transition-opacity duration-500"
        >
          <span>اسکرول کنید</span>
          <span className="scroll-hint-line block h-10 w-px bg-ember/60" />
        </div>

        {error && (
          <p className="absolute inset-x-0 top-1/2 text-center text-linen">
            بارگذاری تصاویر انیمیشن ممکن نشد. صفحه را دوباره باز کنید.
          </p>
        )}
        <LoadingBar barRef={barRef} visible={!loaded} />
      </div>
    <span id="menu" aria-hidden="true" className="pointer-events-none absolute inset-x-0" style={{ top: `calc(${FRAME_COUNT * SCROLL_PX_PER_FRAME}px + 160svh)`, height: "100svh" }} />
    </main>
  );
}
